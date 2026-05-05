import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createClient } from '@/lib/supabase/server';
import {
  getCategoryLabel,
  getCategoryColor,
  INSIDER_CATEGORIES,
  type InsiderCategory,
  type InsiderEdition,
  type InsiderPost,
  type InsiderSubscription,
  type SubscribeRequest,
} from '@/config/insider.config';

// Service-role Supabase — all subscription + digest_sends access routes
// through the shared `@/lib/supabase/server` helper to keep the typing
// consistent with the rest of the Insider services.

async function getSupabase() {
  return createClient();
}

// ── Lazy-init Nodemailer transport ────────────────────────────────────────────
// Follows email.service.ts pattern: delay DNS+TLS until first send.

let _transporter: nodemailer.Transporter | null = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      },
    });
  }
  return _transporter;
}

function getAppUrl(): string {
  return process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

function getSmtpFromEmail(): string {
  return process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? '';
}

// ── HMAC token utilities ──────────────────────────────────────────────────────

export function generateHmacToken(email: string): string {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {throw new Error('HMAC_SECRET environment variable is not set');}
  const normalized = email.toLowerCase();
  return crypto.createHmac('sha256', secret).update(normalized).digest('base64url');
}

export function verifyHmacToken(token: string, email: string): boolean {
  const expected = generateHmacToken(email.toLowerCase());
  const tokenBuf = Buffer.from(token);
  const expectedBuf = Buffer.from(expected);
  if (tokenBuf.length !== expectedBuf.length) {return false;}
  return crypto.timingSafeEqual(tokenBuf, expectedBuf);
}

export function maskEmail(email: string): string {
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) {return email;}
  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  if (local.length <= 1) {return `${local}${domain}`;}
  const first = local[0];
  const last = local[local.length - 1];
  const masked = `${first}${'*'.repeat(local.length - 2)}${last}`;
  return `${masked}${domain}`;
}

// ── Subscription CRUD ─────────────────────────────────────────────────────────

export async function subscribe(data: SubscribeRequest): Promise<InsiderSubscription> {
  const email = data.email.toLowerCase();
  const token = generateHmacToken(email);
  const supabase = await getSupabase();

  const { data: row, error } = await supabase
    .from('insider_subscriptions')
    .upsert(
      { email, categories: data.categories, token, is_active: true },
      { onConflict: 'email' }
    )
    .select()
    .single();

  if (error) {throw new Error(`Failed to upsert subscription: ${error.message}`);}

  // Fire-and-forget confirmation email
  sendConfirmation(email, token).catch((err: unknown) => {
    console.error('[Insider] Confirmation email failed:', err);
  });

  return row as unknown as InsiderSubscription;
}

export async function getSubscriptionByToken(token: string): Promise<InsiderSubscription | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('insider_subscriptions')
    .select('*')
    .eq('token', token)
    .maybeSingle();

  if (error) {throw new Error(`Failed to fetch subscription by token: ${error.message}`);}
  return data as InsiderSubscription | null;
}

export async function updatePreferences(token: string, categories: InsiderCategory[]): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('insider_subscriptions')
    .update({ categories })
    .eq('token', token);

  if (error) {throw new Error(`Failed to update preferences: ${error.message}`);}
}

export async function unsubscribeAll(token: string): Promise<void> {
  const supabase = await getSupabase();
  const { error } = await supabase
    .from('insider_subscriptions')
    .update({ is_active: false })
    .eq('token', token);

  if (error) {throw new Error(`Failed to unsubscribe: ${error.message}`);}
}

// ── HTML rendering helpers ────────────────────────────────────────────────────

function emailBase(title: string, previewText: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
          ${body}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function categoryBadge(category: InsiderCategory): string {
  const color = getCategoryColor(category);
  const label = getCategoryLabel(category);
  return `<span style="display:inline-block;background:${color};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.05em;padding:2px 8px;border-radius:4px;text-transform:uppercase;">${label}</span>`;
}

function postItemHtml(post: InsiderPost): string {
  const appUrl = getAppUrl();
  const sourceDate = new Date(post.source_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
  return `
    <tr>
      <td style="padding:16px 0;border-bottom:1px solid #e2e8f0;">
        <div style="margin-bottom:6px;">${categoryBadge(post.category)}</div>
        <p style="margin:0 0 6px 0;font-size:15px;font-weight:600;color:#1e293b;line-height:1.4;">
          <a href="${appUrl}/insider/posts/${post.slug}" style="color:#1e293b;text-decoration:none;">${post.title}</a>
        </p>
        <p style="margin:0 0 8px 0;font-size:14px;color:#475569;line-height:1.5;">${post.summary}</p>
        <p style="margin:0;font-size:12px;color:#94a3b8;">${post.source_name} &bull; ${sourceDate}</p>
      </td>
    </tr>`;
}

// ── Digest email ──────────────────────────────────────────────────────────────

export function renderDigestHtml(
  edition: InsiderEdition,
  posts: InsiderPost[],
  subscriberToken: string,
): string {
  const appUrl = getAppUrl();
  const manageUrl = `${appUrl}/insider/unsubscribe?token=${subscriberToken}`;
  const unsubscribeUrl = `${appUrl}/insider/unsubscribe?token=${subscriberToken}&action=unsubscribe`;

  const editionLabel = edition.title ?? `Edition #${edition.edition_number}`;
  const weekRange = `${new Date(edition.week_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(edition.week_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Group posts by section
  const topSignal = posts.filter(p => {
    // A post is top_signal if it appears in the edition with that section
    // We use the edition's posts array if available, otherwise fall back to highest relevance
    const ep = edition.posts?.find(ep => ep.post_id === p.id);
    return ep?.section === 'top_signal';
  });
  const otherPosts = posts.filter(p => {
    const ep = edition.posts?.find(ep => ep.post_id === p.id);
    return ep?.section !== 'top_signal';
  });

  // Section groupings by category label
  const grouped: Record<string, InsiderPost[]> = {};
  for (const post of otherPosts) {
    const label = getCategoryLabel(post.category);
    if (!grouped[label]) {grouped[label] = [];}
    grouped[label].push(post);
  }

  const headerBlock = `
    <tr>
      <td style="background:linear-gradient(135deg,#E9472F,#38C6F4);padding:32px 24px;text-align:center;">
        <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:rgba(255,255,255,0.8);text-transform:uppercase;">Ironmark Intelligence</p>
        <h1 style="margin:0 0 8px 0;font-size:26px;font-weight:800;color:#ffffff;">Ignition Insider</h1>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.85);">${editionLabel} &bull; ${weekRange}</p>
      </td>
    </tr>`;

  const summaryBlock = edition.executive_summary ? `
    <tr>
      <td style="padding:24px 24px 0 24px;">
        <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#64748b;text-transform:uppercase;">Executive Summary</p>
        <p style="margin:0;font-size:15px;color:#334155;line-height:1.6;">${edition.executive_summary}</p>
      </td>
    </tr>` : '';

  const topSignalBlock = topSignal.length > 0 ? `
    <tr>
      <td style="padding:24px 24px 0 24px;">
        <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;letter-spacing:0.06em;color:#E9472F;text-transform:uppercase;border-bottom:2px solid #E9472F;padding-bottom:6px;">Top Signal</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${topSignal.map(postItemHtml).join('')}
        </table>
      </td>
    </tr>` : '';

  const sectionBlocks = Object.entries(grouped).map(([sectionLabel, sectionPosts]) => `
    <tr>
      <td style="padding:24px 24px 0 24px;">
        <p style="margin:0 0 12px 0;font-size:13px;font-weight:700;letter-spacing:0.06em;color:#475569;text-transform:uppercase;border-bottom:1px solid #e2e8f0;padding-bottom:6px;">${sectionLabel}</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${sectionPosts.map(postItemHtml).join('')}
        </table>
      </td>
    </tr>`).join('');

  const dataPointBlock = edition.data_point_of_week ? `
    <tr>
      <td style="padding:24px 24px 0 24px;">
        <div style="background:#f8fafc;border-left:4px solid #38C6F4;padding:16px 20px;border-radius:0 6px 6px 0;">
          <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#38C6F4;text-transform:uppercase;">Data Point of the Week</p>
          <p style="margin:0;font-size:15px;color:#1e293b;line-height:1.5;font-style:italic;">"${edition.data_point_of_week}"</p>
        </div>
      </td>
    </tr>` : '';

  const comingUpBlock = edition.coming_up ? `
    <tr>
      <td style="padding:24px 24px 0 24px;">
        <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#8B5CF6;text-transform:uppercase;">Coming Up</p>
        <p style="margin:0;font-size:14px;color:#475569;line-height:1.5;">${edition.coming_up}</p>
      </td>
    </tr>` : '';

  const footerBlock = `
    <tr>
      <td style="padding:24px;text-align:center;border-top:1px solid #e2e8f0;margin-top:24px;">
        <p style="margin:0 0 8px 0;font-size:12px;color:#94a3b8;">
          <a href="${manageUrl}" style="color:#64748b;text-decoration:underline;">Manage preferences</a>
          &nbsp;&bull;&nbsp;
          <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
        </p>
        <p style="margin:0;font-size:11px;color:#cbd5e1;">
          List-Unsubscribe: &lt;${unsubscribeUrl}&gt;
        </p>
        <p style="margin:8px 0 0 0;font-size:11px;color:#cbd5e1;">Ignition Insider &bull; Ironmark</p>
      </td>
    </tr>`;

  const body = `
    ${headerBlock}
    ${summaryBlock}
    ${topSignalBlock}
    ${sectionBlocks}
    ${dataPointBlock}
    ${comingUpBlock}
    ${footerBlock}`;

  return emailBase(
    `Ignition Insider — ${editionLabel}`,
    edition.executive_summary ?? 'Your weekly competitive intelligence digest',
    body,
  );
}

export function renderDigestText(edition: InsiderEdition, posts: InsiderPost[]): string {
  const lines: string[] = [];
  const editionLabel = edition.title ?? `Edition #${edition.edition_number}`;
  const weekRange = `${edition.week_start} – ${edition.week_end}`;

  lines.push('IGNITION INSIDER');
  lines.push('Ironmark Competitive Intelligence');
  lines.push('');
  lines.push(`${editionLabel} | ${weekRange}`);
  lines.push('='.repeat(60));

  if (edition.executive_summary) {
    lines.push('');
    lines.push('EXECUTIVE SUMMARY');
    lines.push(edition.executive_summary);
  }

  for (const post of posts) {
    lines.push('');
    lines.push('-'.repeat(40));
    lines.push(`[${getCategoryLabel(post.category).toUpperCase()}]`);
    lines.push(post.title);
    lines.push('');
    lines.push(post.summary);
    lines.push('');
    lines.push(`Source: ${post.source_name} | ${post.source_date}`);
  }

  if (edition.data_point_of_week) {
    lines.push('');
    lines.push('DATA POINT OF THE WEEK');
    lines.push(`"${edition.data_point_of_week}"`);
  }

  if (edition.coming_up) {
    lines.push('');
    lines.push('COMING UP');
    lines.push(edition.coming_up);
  }

  return lines.join('\n');
}

// ── Alert email ───────────────────────────────────────────────────────────────

export function renderAlertHtml(post: InsiderPost, subscriberToken: string): string {
  const appUrl = getAppUrl();
  const manageUrl = `${appUrl}/insider/unsubscribe?token=${subscriberToken}`;
  const unsubscribeUrl = `${appUrl}/insider/unsubscribe?token=${subscriberToken}&action=unsubscribe`;
  const postUrl = `${appUrl}/insider/posts/${post.slug}`;

  const severityColor = post.relevance_score >= 9 ? '#E9472F' : '#f59e0b';
  const severityLabel = post.relevance_score >= 9 ? 'HIGH' : 'ELEVATED';

  const sourceDate = new Date(post.source_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const body = `
    <tr>
      <td style="background:#1e293b;padding:20px 24px;">
        <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:rgba(255,255,255,0.6);text-transform:uppercase;">Ignition Insider</p>
        <div style="display:inline-flex;align-items:center;gap:8px;">
          <span style="font-size:18px;font-weight:800;color:#ffffff;">[CI ALERT]</span>
          <span style="background:${severityColor};color:#ffffff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:0.06em;">${severityLabel}</span>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <div style="margin-bottom:12px;">${categoryBadge(post.category)}</div>
        <h2 style="margin:0 0 16px 0;font-size:20px;font-weight:700;color:#1e293b;line-height:1.3;">${post.title}</h2>

        <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#64748b;text-transform:uppercase;">What Happened</p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#334155;line-height:1.6;">${post.summary}</p>

        ${post.admin_commentary ? `
        <p style="margin:0 0 6px 0;font-size:11px;font-weight:700;letter-spacing:0.08em;color:#64748b;text-transform:uppercase;">Why It Matters Now</p>
        <p style="margin:0 0 20px 0;font-size:15px;color:#334155;line-height:1.6;">${post.admin_commentary}</p>
        ` : ''}

        <p style="margin:0 0 4px 0;font-size:12px;color:#94a3b8;">Source: ${post.source_name} &bull; ${sourceDate}</p>

        <div style="margin-top:20px;">
          <a href="${postUrl}" style="display:inline-block;background:#E9472F;color:#ffffff;text-decoration:none;padding:10px 24px;border-radius:6px;font-size:14px;font-weight:600;">
            Read Full Analysis
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:12px;color:#94a3b8;">
          <a href="${manageUrl}" style="color:#64748b;text-decoration:underline;">Manage preferences</a>
          &nbsp;&bull;&nbsp;
          <a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>`;

  return emailBase(
    `[CI Alert] ${post.title}`,
    `${severityLabel} signal: ${post.summary.slice(0, 120)}`,
    body,
  );
}

export function renderAlertText(post: InsiderPost): string {
  const appUrl = getAppUrl();
  const postUrl = `${appUrl}/insider/posts/${post.slug}`;
  const lines: string[] = [];

  lines.push('[CI ALERT] — Ignition Insider');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(post.title);
  lines.push('');
  lines.push('WHAT HAPPENED');
  lines.push(post.summary);

  if (post.admin_commentary) {
    lines.push('');
    lines.push('WHY IT MATTERS NOW');
    lines.push(post.admin_commentary);
  }

  lines.push('');
  lines.push(`Source: ${post.source_name} | ${post.source_date}`);
  lines.push(`Category: ${getCategoryLabel(post.category)}`);
  lines.push('');
  lines.push(`Read full analysis: ${postUrl}`);

  return lines.join('\n');
}

// ── Confirmation email ────────────────────────────────────────────────────────

export function renderConfirmationHtml(email: string, token: string): string {
  const appUrl = getAppUrl();
  const manageUrl = `${appUrl}/insider/unsubscribe?token=${token}`;

  const categoryListHtml = INSIDER_CATEGORIES.map(c =>
    `<li style="padding:4px 0;color:#475569;font-size:14px;">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${c.color};margin-right:8px;vertical-align:middle;"></span>
      ${c.label}
    </li>`
  ).join('');

  const body = `
    <tr>
      <td style="background:linear-gradient(135deg,#E9472F,#38C6F4);padding:32px 24px;text-align:center;">
        <p style="margin:0 0 4px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;color:rgba(255,255,255,0.8);text-transform:uppercase;">Welcome to</p>
        <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;">Ignition Insider</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px;">
        <p style="margin:0 0 16px 0;font-size:15px;color:#334155;line-height:1.6;">
          You're subscribed to Ironmark's competitive intelligence digest. You'll receive weekly updates covering:
        </p>
        <ul style="margin:0 0 20px 0;padding-left:0;list-style:none;">
          ${categoryListHtml}
        </ul>
        <div style="text-align:center;margin-top:24px;">
          <a href="${manageUrl}" style="display:inline-block;background:#E9472F;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:6px;font-size:14px;font-weight:600;">
            Manage Preferences
          </a>
        </div>
        <p style="margin:20px 0 0 0;font-size:13px;color:#94a3b8;text-align:center;">
          You subscribed as ${email}. You can unsubscribe at any time from the link above.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="margin:0;font-size:11px;color:#cbd5e1;">Ignition Insider &bull; Ironmark</p>
      </td>
    </tr>`;

  return emailBase(
    'Welcome to Ignition Insider',
    'Your competitive intelligence digest is set up.',
    body,
  );
}

// ── Send functions ────────────────────────────────────────────────────────────

export async function sendDigestToSubscriber(params: {
  subscriber: InsiderSubscription;
  edition: InsiderEdition;
  posts: InsiderPost[];
}): Promise<{ status: 'sent' | 'failed'; error?: string }> {
  const { subscriber, edition, posts } = params;

  const filteredPosts = posts.filter(p => subscriber.categories.includes(p.category));
  if (filteredPosts.length === 0) {
    return { status: 'failed', error: 'no_matching_posts' };
  }

  const appUrl = getAppUrl();
  const unsubscribeUrl = `${appUrl}/insider/unsubscribe?token=${subscriber.token}&action=unsubscribe`;
  const editionLabel = edition.title ?? `Edition #${edition.edition_number}`;

  try {
    await getTransporter().sendMail({
      from: `"Ignition Insider" <${getSmtpFromEmail()}>`,
      to: subscriber.email,
      subject: `Ignition Insider — ${editionLabel}`,
      text: renderDigestText(edition, filteredPosts),
      html: renderDigestHtml(edition, filteredPosts, subscriber.token),
      headers: {
        'List-Unsubscribe': `<${unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
    return { status: 'sent' };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { status: 'failed', error: message };
  }
}

export async function sendAlertToSubscriber(params: {
  subscriber: InsiderSubscription;
  post: InsiderPost;
}): Promise<void> {
  const { subscriber, post } = params;
  const appUrl = getAppUrl();
  const unsubscribeUrl = `${appUrl}/insider/unsubscribe?token=${subscriber.token}&action=unsubscribe`;

  await getTransporter().sendMail({
    from: `"Ignition Insider" <${getSmtpFromEmail()}>`,
    to: subscriber.email,
    subject: `[CI Alert] ${post.title}`,
    text: renderAlertText(post),
    html: renderAlertHtml(post, subscriber.token),
    headers: {
      'List-Unsubscribe': `<${unsubscribeUrl}>`,
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
    },
  });
}

export async function sendConfirmation(email: string, token: string): Promise<void> {
  await getTransporter().sendMail({
    from: `"Ignition Insider" <${getSmtpFromEmail()}>`,
    to: email,
    subject: 'Welcome to Ignition Insider',
    html: renderConfirmationHtml(email, token),
    text: `Welcome to Ignition Insider.\n\nManage your preferences: ${getAppUrl()}/insider/unsubscribe?token=${token}`,
  });
}

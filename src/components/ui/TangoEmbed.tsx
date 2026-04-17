/**
 * TangoEmbed — renders a Tango workflow embed.
 *
 * When you record a workflow in Tango and click "Share → Embed", Tango gives
 * you an `<iframe src="https://app.tango.us/app/embed/XXXX" ...>`. Copy the
 * `src` URL (the long `/app/embed/...` one) and drop it into this component.
 *
 * Usage:
 *   <TangoEmbed
 *     src="https://app.tango.us/app/embed/abc-123-def-456"
 *     title="How to create an Insider post"
 *   />
 *
 * Optional:
 *   height       — px (default 640)
 *   aspectRatio  — CSS aspect-ratio (overrides height). e.g. "16 / 9"
 *
 * If you prefer to paste Tango's full <iframe> tag instead of extracting the
 * src, use <TangoEmbedRaw html={...} /> below — it accepts the entire embed
 * snippet via dangerouslySetInnerHTML.
 */

interface TangoEmbedProps {
  src: string;
  title: string;
  height?: number;
  aspectRatio?: string;
}

export function TangoEmbed({ src, title, height = 640, aspectRatio }: TangoEmbedProps) {
  const style = aspectRatio ? { aspectRatio } : { height: `${height}px` };
  return (
    <div
      className="my-6 overflow-hidden rounded-lg border border-brand-border bg-white shadow-sm"
      style={style}
    >
      <iframe
        src={src}
        title={title}
        className="h-full w-full"
        sandbox="allow-scripts allow-top-navigation-by-user-activation allow-popups allow-same-origin allow-forms"
        referrerPolicy="strict-origin-when-cross-origin"
        loading="lazy"
        allow="clipboard-read; clipboard-write; fullscreen"
        allowFullScreen
      />
    </div>
  );
}

/**
 * TangoEmbedRaw — accepts a full <iframe>…</iframe> HTML snippet copied
 * directly from Tango. Use this if you don't want to extract the src URL.
 * Rendered via dangerouslySetInnerHTML; Tango's markup is trusted.
 */
export function TangoEmbedRaw({ html, title }: { html: string; title: string }) {
  return (
    <div
      className="my-6 overflow-hidden rounded-lg border border-brand-border bg-white shadow-sm"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

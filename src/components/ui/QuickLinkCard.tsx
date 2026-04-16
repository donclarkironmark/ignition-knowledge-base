import Link from 'next/link';

interface QuickLinkCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickLinkCard({ title, description, href, icon }: QuickLinkCardProps) {
  return (
    <Link href={href} className="block no-underline group">
      <div className="rounded-lg border border-brand-border bg-white p-5 shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="text-brand-cyan mb-3">{icon}</div>
        <h3 className="text-lg font-semibold text-foreground group-hover:text-brand-cyan transition-colors mb-1">
          {title}
        </h3>
        <p className="text-sm text-brand-gray leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

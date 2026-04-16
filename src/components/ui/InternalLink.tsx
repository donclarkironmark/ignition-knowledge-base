import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export function InternalLink({ href, children }: InternalLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-brand-cyan hover:underline font-medium text-sm"
    >
      {children}
      <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  );
}

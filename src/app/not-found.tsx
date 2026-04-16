import Link from 'next/link';

/**
 * Branded 404 page (S-42)
 *
 * Shows a clear message, search suggestion, and home link.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f2f2]">
      <div className="text-center">
        <h1
          className="text-6xl tracking-wide text-[#EF462F]"
          style={{ fontFamily: 'var(--font-bebas-neue), system-ui' }}
        >
          404
        </h1>
        <h2 className="mt-2 text-xl font-semibold text-[#1a1a1a]">
          Document Not Found
        </h2>
        <p className="mt-2 text-[#707070]">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[#EF462F] px-5 py-2.5 font-medium text-white transition hover:bg-[#d93d28]"
          >
            Go Home
          </Link>
          <p className="text-sm text-[#707070]">
            or use <kbd className="rounded bg-white px-1.5 py-0.5 text-xs shadow-sm">⌘K</kbd> to search
          </p>
        </div>
      </div>
    </div>
  );
}

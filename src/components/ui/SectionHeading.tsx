interface SectionHeadingProps {
  children: React.ReactNode;
}

export function SectionHeading({ children }: SectionHeadingProps) {
  return (
    <h2 className="text-2xl md:text-3xl font-heading tracking-wide text-foreground mb-4 mt-10 first:mt-0">
      {children}
    </h2>
  );
}

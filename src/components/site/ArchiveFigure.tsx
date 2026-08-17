type ArchiveFigureProps = {
  src: string;
  alt: string;
  caption: string;
  date?: string;
  className?: string;
  aspect?: "portrait" | "landscape" | "wide" | "square";
};

const aspectClass: Record<NonNullable<ArchiveFigureProps["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
  square: "aspect-square",
};

/** A real archive photograph, used as structural input. Never a stock or generated image. */
export const ArchiveFigure = ({ src, alt, caption, date, className = "", aspect = "landscape" }: ArchiveFigureProps) => (
  <figure className={className}>
    <div className={`overflow-hidden bg-field-dense ${aspectClass[aspect]}`}>
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover" />
    </div>
    <figcaption className="mt-2 flex items-baseline justify-between gap-3 text-xs text-foreground/55">
      <span>{caption}</span>
      {date ? <span className="stamp shrink-0">{date}</span> : null}
    </figcaption>
  </figure>
);

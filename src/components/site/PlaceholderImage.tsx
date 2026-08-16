import { cn } from "@/lib/utils";

type Props = {
  /** File name (without extension) inside /public/images. */
  name: "hero" | "care-partner" | "cooking" | "companionship" | "safety";
  alt: string;
  className?: string;
  ratio?: "video" | "square" | "portrait" | "wide";
};

const ratios: Record<NonNullable<Props["ratio"]>, string> = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[4/5]",
  wide: "aspect-[16/9]",
};

/**
 * Renders a replaceable image from /public/images.
 * Drop a real photo in as `public/images/<name>.jpg` and update the src
 * extension here (or simply overwrite the .svg) — see README.
 */
export function PlaceholderImage({ name, alt, className, ratio = "video" }: Props) {
  return (
    <div className={cn("overflow-hidden rounded-2xl bg-sand", ratios[ratio], className)}>
      <img
        src={`/images/${name}.svg`}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

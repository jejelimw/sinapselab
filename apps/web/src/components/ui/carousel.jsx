import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "../../lib/utils";

export function Carousel({
  items,
  renderItem,
  className,
  slideClassName,
  options,
  autoplayDelay = 3000,
}) {
  const autoplay = useMemo(() => Autoplay({ delay: autoplayDelay, stopOnInteraction: false }), [autoplayDelay]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1, ...options },
    [autoplay],
  );
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("space-y-5", className)}>
      <div
        className="overflow-hidden"
        ref={emblaRef}
        onMouseEnter={() => autoplay.stop()}
        onMouseLeave={() => autoplay.play()}
      >
        <div className="-ml-4 flex">
          {items.map((item, index) => (
            <div
              className={cn(
                "min-w-0 shrink-0 grow-0 basis-full pl-4 md:basis-1/2 lg:basis-1/3 transition duration-300",
                selected === index ? "scale-[1.01]" : "scale-[0.985] opacity-80",
                slideClassName,
              )}
              key={`${item.title}-${index}`}
            >
              {renderItem(item, selected === index)}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-orange-400/70"
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground hover:border-orange-400/70"
            type="button"
            onClick={() => emblaApi?.scrollNext()}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {items.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={cn(
                "h-2 rounded-full transition-all",
                selected === index ? "w-8 bg-orange-500" : "w-2 bg-muted-foreground/60",
              )}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

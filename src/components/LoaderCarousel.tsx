import useEmblaCarousel from 'embla-carousel-react';
const LoaderCarousel = ({
  content,
}: {
  content: {
    videoId: string;
    title: string;
  }[];
}) => {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });

  return (
    <div className="embla">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y touch-pinch-zoom">
          {content.map((_, ind) => (
            <div key={ind} className="shrink-0 px-2 basis-[60%] grow-1 min-w-0">
              <div className="h-40 bg-slate-300 rounded-2xl animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoaderCarousel;

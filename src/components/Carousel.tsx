import useEmblaCarousel from 'embla-carousel-react';

const Carousel = ({ children }: { children: React.ReactNode }) => {
  const [emblaRef] = useEmblaCarousel({
    dragFree: true,
  });
  return (
    <div className="embla">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex touch-pan-y touch-pinch-zoom">
          {children}
          {/* <div className="embla__slide h-20 shrink-0 p-2 basis-1/2 grow-1 min-w-0">
            <div className="con bg-red-400 h-full">Slide 1</div>
          </div>
          <div className="embla__slide h-20 shrink-0 p-2 basis-1/2 grow-1 min-w-0">
            <div className="con bg-red-400 h-full">Slide 2</div>
          </div>
          <div className="embla__slide h-20 shrink-0 p-2 basis-1/2 grow-1 min-w-0">
            <div className="con bg-red-400 h-full">Slide 3</div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

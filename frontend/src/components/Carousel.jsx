import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const ResponsiveCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { navigate } = useAppContext();

  const carouselItems = [
    {
        id: 1,
        src: assets.banner2,
        alt: "Winter Sale",
        content: (
          <div>
            <div className="absolute inset-0 flex flex-col items-center md:items-start justify-end md:justify-center pb-24 md:pb-0 px-4 md:pl-18 lg:pl-24">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-15">
                We Fix What Your Cat Broke!😼{" "}
              </h1>
  
              <div className="flex items-center mt-6 font-medium">
                <Link
                  to={"/products"}
                  className="group flex items-center gap-2 px-7 md:px-9 py-3 bg-indigo-500 hover:bg-indigo-900 transition rounded text-white cursor-pointer "
                >
                  Shop now
                  <img src={assets.white_arrow_icon} alt="arrow" />
                </Link>
                <Link
                  to={"/products"}
                  className="group hidden md:flex items-center gap-2 px-9 py-3  cursor-pointer"
                >
                  Explore deals
                  <img src={assets.black_arrow_icon} alt="arrow" />
                </Link>
              </div>
            </div>
            <div className="absolute left-25 bottom-10 text-left">
              <h3 className="text-2xl font-semibold text-white">Winter Sale</h3>
              <p className="text-white">Up to 50% off selected items</p>
            </div>
          </div>
        ),
        containerClasses: "bg-gray-900",
      },
    {
      id: 2,
      src: assets.main_banner_bg,
      alt: "Summer Collection",
      content: (
        <div className="absolute inset-0 flex flex-col items-start justify-center text-center p-4 bg-black/30">
          <Link
            to={"/products"}
            className="px-8 py-3 text-white bg-indigo-500 font-medium rounded-full hover:bg-indigo-800 transition-all group hidden md:flex items-center gap-2 cursor-pointer"
          >
            Shop Now
            <img src={assets.white_arrow_icon} alt="arrow" />
          </Link>
        </div>
      ),
    },
    
    {
      id: 3,
      src: assets.banner3,
      alt: "New Arrivals",
      // No content for this slide, just image
      containerClasses: "",
    },
    {
      id: 4,
      src: assets.banner4,
      alt: "Limited Offer",
      content: (
        <div className="absolute left-0 bottom-0 w-full bg-red-600/90 py-4 text-center">
          <p className="text-white font-bold text-lg">
            LIMITED TIME OFFER - ENDS SOON
          </p>
        </div>
      ),
      containerClasses: "border-4 border-yellow-400",
    },
  ];

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 1000000);
    return () => clearInterval(interval);
  }, [carouselItems.length]);

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  const goToPrev = () => {
    setActiveIndex(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  return (
    <div className="relative w-full group">
      {/* Carousel wrapper */}
      <div
        className={`relative ${
          isMobile ? "h-64" : "h-[500px]"
        } overflow-hidden rounded-lg`}
      >
        {carouselItems.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              item.containerClasses
            } ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          >
            {/* Background Image */}
            <img
              src={item.src}
              className="absolute block w-full h-full object-cover"
              alt={item.alt}
              loading="lazy"
            />

            {/* Custom Content Overlay */}
            {item.content && (
              <div className="absolute inset-0 z-10">{item.content}</div>
            )}
          </div>
        ))}
      </div>

      {/* Indicators and navigation buttons remain the same */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`${
              isMobile ? "w-4 h-1" : "w-3 h-3 rounded-full"
            } transition-all duration-300 ${
              index === activeIndex
                ? "bg-white"
                : "bg-white/50 hover:bg-white/80"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {!isMobile ? (
        <>
          <button
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-8 h-8 text-white bg-black/50 rounded-full p-1" />
          </button>
          <button
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <FiChevronRight className="w-8 h-8 text-white bg-black/50 rounded-full p-1" />
          </button>
        </>
      ) : (
        <div className="absolute inset-0 z-20 flex items-center justify-between px-2">
          <button
            type="button"
            className="h-full px-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            onClick={goToPrev}
            aria-label="Previous slide"
          >
            <FiChevronLeft className="w-8 h-8 text-white bg-black/30 rounded-full p-1" />
          </button>
          <button
            type="button"
            className="h-full px-4 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <FiChevronRight className="w-8 h-8 text-white bg-black/30 rounded-full p-1" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ResponsiveCarousel;

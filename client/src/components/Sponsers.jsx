import { useState, useEffect } from "react";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import { RxDotFilled } from "react-icons/rx";
import { useGetAllSponsorsQuery } from "../redux/api/sponsorsApi";

const Sponsers = () => {
    const { data } = useGetAllSponsorsQuery();
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Update slides when data is fetched
    useEffect(() => {
        if (data?.sponsors) {
            const imageUrls = data.sponsors.map((sponsor) => ({
                url: sponsor.photos[0]?.url || "", // Handle case where photos might be missing
            }));
            setSlides(imageUrls);
        }
    }, [data]);

    // Auto-slide every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 3000);
        return () => clearInterval(interval); // Cleanup timeout on component unmount
    }, [currentIndex, slides]);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const nextSlide = () => {
        // Generate a random index
        const randomIndex = Math.floor(Math.random() * slides.length);
        setCurrentIndex(randomIndex);
    };

    return (
        <div className="w-full flex justify-center items-center py-4 mx-auto mt-16 md:mt-4">
            {/* Square container with aspect ratio 1:1 */}
            <div className="relative w-full max-w-[50vw] h-0 pb-[37.5%] bg-gray-600 rounded-xl p-2 shadow-lg">
                {/* Slide - absolute positioned to fill the square container */}
                {slides.length > 0 && (
                    <div
                        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                        className="absolute top-0 left-0 w-full h-full rounded-2xl bg-center bg-cover duration-500"
                    ></div>
                )}

                {/* Left Arrow */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 left-2 text-lg p-1 bg-black/40 text-white rounded-full cursor-pointer"
                    onClick={prevSlide}
                >
                    <BsChevronCompactLeft size={20} />
                </div>

                {/* Right Arrow */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 right-2 text-lg p-1 bg-black/40 text-white rounded-full cursor-pointer"
                    onClick={nextSlide}
                >
                    <BsChevronCompactRight size={20} />
                </div>

                {/* Dots */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className="text-2xl cursor-pointer"
                        >
                            <RxDotFilled
                                className={currentIndex === index ? "text-white" : "text-gray-400"}
                                size={14}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default Sponsers;


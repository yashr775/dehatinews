import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useGetSinglePostQuery } from "../redux/api/postApi";
import Loader from "../components/Loader";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const Viewfull = () => {
    const params = useParams();
    const { user } = useSelector((state) => state.user);

    // Fetch the single post data
    const { data, isLoading } = useGetSinglePostQuery({ userId: user._id, postId: params.id });

    // Show a loader while data is being fetched
    if (isLoading) return <Loader />;


    return (
        <div className="bg-gray-600 pt-20 min-h-screen flex justify-center p-4">
            <div className="bg-white h-auto w-full sm:w-3/4 md:w-1/2 rounded-lg m-2">
                {/* Post Title */}
                <div className="flex justify-center p-2 m-4 font-bold text-xl sm:text-3xl">
                    {data.post.title}
                </div>

                {/* Image Swiper */}
                {data?.post?.photos?.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        navigation
                        pagination={{ clickable: true }}
                        className="w-full h-48 sm:h-64"
                    >
                        {data.post.photos.map((photo, index) => (
                            <SwiperSlide key={index} className="flex justify-center items-center p-2">
                                <img
                                    src={photo.url} // Access the `url` property of each photo object
                                    alt={`Post Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="text-center text-gray-600 p-4">No images selected</p>
                )}

                {/* Post Description */}
                <div className="flex justify-center p-4 m-4 text-sm sm:text-base">
                    {data.post.description}
                </div>
            </div>
        </div>
    );
};

export default Viewfull;
import { useGetAllPostsQuery } from "../redux/api/postApi";
import Newscard from "../components/Newscard";
import Loader from "../components/Loader";
import { motion } from "framer-motion";
import Sponsers from "../components/Sponsers.jsx";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";

const Local = () => {
    const { category } = useSelector((state) => state.category);

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const observerRef = useRef(null);
    const loadingRef = useRef(false);


    const [activeCategory, setActiveCategory] = useState("general");

    // Reset on category change
    useEffect(() => {
        if (category) {
            setActiveCategory(category);
            setPage(1);
            setPosts([]);
            setHasMore(true);
            setInitialLoaded(false);
            loadingRef.current = false;
            if (observerRef.current) {
                observerRef.current.disconnect();
                observerRef.current = null;
            }
        }
    }, [category]);

    const { data, isFetching, error } = useGetAllPostsQuery(
        { page, limit: 10, category: activeCategory },
        {
            skip: !activeCategory,
            keepPreviousData: true,
            refetchOnMountOrArgChange: false,
        }
    );

    // Handle data load
    useEffect(() => {
        if (!data) return;

        loadingRef.current = false;

        if (page === 1) {
            setPosts(data.posts || []);
        } else {
            setPosts((prev) => {
                const newPosts = (data.posts || []).filter(
                    (post) => !prev.some((p) => p._id === post._id)
                );
                return [...prev, ...newPosts];
            });
        }

        setHasMore(data?.hasMore ?? false);
        setInitialLoaded(true);
    }, [data, page]);

    // Infinite Scroll Handler
    useEffect(() => {
        if (!initialLoaded || !hasMore || isFetching) return;

        const observerOptions = {
            root: null,
            rootMargin: "100px",
            threshold: 1.0,
        };

        const observerCallback = (entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !loadingRef.current) {
                loadingRef.current = true;
                setPage((prev) => prev + 1);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observerRef.current = observer;

        const postItems = document.querySelectorAll(".post-item");
        const lastItem = postItems[postItems.length - 1];

        if (lastItem) observer.observe(lastItem);

        return () => observer.disconnect();
    }, [posts, hasMore, isFetching, initialLoaded]);

    // Render
    if (error) {
        return (
            <div className="bg-gray-600 min-h-screen flex items-center justify-center">
                <div className="text-white text-xl">Error loading posts. Please try again.</div>
            </div>
        );
    }

    if (!initialLoaded && isFetching) {
        return (
            <div className="bg-gray-600 min-h-screen flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <motion.div
            layoutId="underline"
            className="bg-gray-600 min-h-screen pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="pt-4 sm:m-4 flex justify-center">
                <Sponsers />
            </div>

            <div className="posts-container">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mt-4">
                        {posts.map((post, idx) => (
                            <div
                                key={`${post._id}-${idx}`}
                                className="post-item bg-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <Newscard
                                    title={post.title}
                                    postId={post._id}
                                    link={`/viewfull/${post._id}`}
                                    description={
                                        post.description
                                            ? `${post.description.slice(0, 88)}...`
                                            : "No description available"
                                    }
                                    pubDate={post.createdAt}
                                    sourceId={"DehatiNews"}
                                    creator={post.creator || "Ajay Sharma"}
                                    imageUrl={post.photos?.[0]?.url}
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    !isFetching && (
                        <div className="text-white text-center text-xl mt-10">
                            No Posts Available
                        </div>
                    )
                )}

                {isFetching && page > 1 && (
                    <div className="flex justify-center my-8">
                        <Loader />
                    </div>
                )}

                {hasMore && !isFetching && posts.length > 0 && (
                    <div className="flex justify-center my-8">
                        <button
                            onClick={() => setPage((prev) => prev + 1)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-200"
                        >
                            Load More
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default Local;

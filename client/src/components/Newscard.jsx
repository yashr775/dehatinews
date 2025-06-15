/* eslint-disable react/prop-types */
import { Helmet } from "react-helmet-async";
import { BsWhatsapp as Watsapp, BsFacebook as Facebook, BsTwitter as Twitter } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { format } from 'date-fns-tz';

const Newscard = ({ title, link, description, pubDate, imageUrl }) => {
    const url = `${import.meta.env.VITE_SERVER}${link}`;
    console.log(link)
    const handleCopyLink = () => {
        navigator.clipboard.writeText(url).then(() => {
            alert("Link copied to clipboard!");
        });
    };
    // Utility function to format date in IST
    const formatToIST = (dateString) => {
        try {
            const date = new Date(dateString);
            // For IST (Asia/Kolkata), we need to specify the time zone
            return format(date, 'dd MMM yyyy, hh:mm a', {
                timeZone: 'Asia/Kolkata'
            });
        } catch (e) {
            console.error("Invalid date format:", dateString);
            return "Date not available";
        }
    };


    // Function to generate social media share URLs
    const shareOnWhatsApp = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
    const shareOnFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const shareOnTwitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

    return (
        <>
            {/* 🚀 Dynamic Meta Tags for Correct Social Media Previews */}
            <Helmet>
                <title>{title} Dehaat News</title>
                <meta name="description" content={description} />

                {/* Open Graph Meta Tags (Facebook, WhatsApp, LinkedIn) */}
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={imageUrl} />
                <meta property="og:image:secure_url" content={imageUrl} />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={url} />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={imageUrl} />
            </Helmet>


            <div className="p-4 border-b border-gray-300 relative">
                {/* Source ID in Top-Right Corner */}
                <div className="absolute top-2 right-4 bg-red-800 text-white px-2 py-1 rounded-lg text-sm">
                    DehaatNews
                </div>

                {/* Title */}
                <div className="font-extrabold text-xl mb-3 mt-8">
                    <Link to={link}>{title}</Link>
                </div>

                {/* Image */}
                <div className="w-full overflow-hidden rounded-lg">
                    <img src={imageUrl} alt={title} className="w-full h-auto object-cover" />
                </div>

                {/* Description and Metadata */}
                <div className="mt-4">
                    <span className="font-bold text-lg">{description}...</span>
                    <br />
                    <span className="mt-2 text-sm text-gray-600">
                        on {formatToIST(pubDate)} IST
                    </span>
                </div>

                {/* Read More Button */}
                <div className="mt-7 flex justify-end">
                    <Link
                        className="bg-blue-700 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-blue-950 hover:font-bold transition-all duration-300 text-sm sm:text-base"
                        to={link}
                    >
                        READ MORE
                    </Link>
                </div>

                {/* Social Media and Copy Link Buttons */}
                <div className="mt-4 flex justify-start space-x-4">
                    {/* WhatsApp */}
                    <a href={shareOnWhatsApp} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800">
                        <Watsapp className="text-2xl text-green-600 hover:text-green-800" />
                    </a>

                    {/* Facebook */}
                    <a href={shareOnFacebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Facebook className="text-2xl text-blue-600 hover:text-blue-800" />
                    </a>

                    {/* Twitter */}
                    <a href={shareOnTwitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                        <Twitter className="text-2xl text-blue-400 hover:text-blue-600" />
                    </a>

                    {/* Copy Link */}
                    <button onClick={handleCopyLink} className="text-gray-600 hover:text-gray-800">
                        <FaRegCopy className="text-2xl" />
                    </button>
                </div>
            </div>
        </>
    );
};

export default Newscard;

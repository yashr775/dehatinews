const allowedHosts = new Set([
    process.env.ALLOWED_HOST,
    `www.${process.env.ALLOWED_HOST}`,
]);

const validateHost = (req, res, next) => {
    const host = req.headers.host?.split(":")[0].toLowerCase();

    if (!host || !allowedHosts.has(host)) {

        return res.status(400).json({
            success: false,
            message: "Invalid host.",
        });
    }

    next();
};

export default validateHost;
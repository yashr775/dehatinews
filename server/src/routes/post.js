import express from "express";
import { adminOnly } from "../middleware/auth.js";
import {
    createPost,
    deleteImage,
    deletePost,
    getAllPosts,
    getSinglePost,
    updatePost,
    downloadPost,
    getAll,
    getAllPostsForAdmin
} from "../controllers/post.js";
import { multiUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/createpost", adminOnly, multiUpload, createPost);
app.post("/getAllPosts", getAllPosts);
app.get("/getAll", getAll);
app.delete("/deleteImage", deleteImage);
app.get("/download", downloadPost);
app.get("/:postId", getSinglePost);
app.post("/getAllPostsForAdmin", getAllPostsForAdmin)

app
    .route("/:postId", adminOnly)
    .delete(deletePost)
    .put(multiUpload, updatePost);

export default app;

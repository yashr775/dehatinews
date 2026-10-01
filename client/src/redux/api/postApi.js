import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const Url = import.meta.env.VITE_SERVER

export const postApi = createApi({
    reducerPath: "postApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${Url}/api/v1/posts/`,
    }),
    tagTypes: ["posts"],

    endpoints: (builder) => ({
        newPost: builder.mutation({
            query: ({ postData, id }) => ({
                url: `createPost?id=${id}`,
                method: "POST",
                body: postData,
            }),
            invalidatesTags: ["posts"],
        }),
        getAllPostsForAdmin: builder.query({
            query: () => `getAll`,
            providesTags: ["posts"],
        }),
        getAllPosts: builder.query({
            query: ({ page = 1, limit = 4, category = "general" } = {}) => ({
                url: "getAllPosts",
                method: "POST",
                body: { page, limit, category },
            }),
            providesTags: ["posts"]
        }),
        getAllPostsForAdminLimit: builder.query({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: "getAllPostsForAdmin",
                method: "POST",
                body: {
                    page,
                    limit,
                },
            }),
            providesTags: ["posts"],
        }),

        getSinglePost: builder.query({
            query: ({ userId, postId }) => `${postId}?id=${userId}`,
            providesTags: ["posts"],
        }),

        deleteImage: builder.mutation({
            query: ({ postId, imageId }) => ({
                url: `deleteImage?postId=${postId}&imageId=${imageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["posts"],
        }),

        deletePost: builder.mutation({
            query: ({ postId, userId }) => ({
                url: `${postId}?id=${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["posts"],
        }),

        updatePost: builder.mutation({
            query: ({ postData, userId, postId }) => ({
                url: `${postId}?id=${userId}`,
                method: "PUT",
                body: postData,
            }),
            invalidatesTags: ["posts"],
        }),
    }),
});

export const {
    useNewPostMutation,
    useGetAllPostsQuery,
    useGetSinglePostQuery,
    useDeleteImageMutation,
    useDeletePostMutation,
    useUpdatePostMutation,
    useGetAllPostsForAdminQuery,
    useGetAllPostsForAdminLimitQuery

} = postApi;

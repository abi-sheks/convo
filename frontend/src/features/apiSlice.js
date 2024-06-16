import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_ENDPOINT } from '../constants';

export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({
        baseUrl : BASE_API_ENDPOINT
    }),
    tagTypes: ['Profile', 'Post', 'Comment'],
    endpoints : (builder) => ({
        getProfiles : builder.query({
            query : ({profileName, token}) => ({
                url : "profiles/",
                params : {profileName},
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            providesTags: (result = [], error, arg) => [
                'Profile',
                ...result.map(({ id }) => [{ type: 'Profile', id }])
            ]
        }),
        getProfile : builder.query({
            query : ({profileName, token})=> ({
                url : `profiles/${profileName}/`,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            providesTags: (result, error, arg) => [{ type: 'Profile', id: arg }]
        }),
        editProfile: builder.mutation({
            query: ({ profile, token }) => ({
                url: `/profiles/${profile.profile_name}/`,
                method: 'PUT',
                body: profile,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Profile', id: arg.id }]
        }),
        getPosts : builder.query({
            query : ({token}) => ({
                url : "posts/",
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            providesTags: (result = [], error, arg) => [
                'Post',
                ...result.map(({ id }) => [{ type: 'Post', id }])
            ]
        }),
        getPost : builder.query({
            query : ({postID, token})=> ({
                url : `posts/${postID}/`,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            providesTags: (result, error, arg) => [{ type: 'Post', id: arg }]
        }),
        addNewPost : builder.mutation({
            query : ({post, token}) => ({
                url : 'posts/',
                method : "POST",
                body : post,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            invalidatesTags : ["Post"]
        }),
        editPost: builder.mutation({
            query: ({ post, token }) => ({
                url: `/posts/${post.id}/`,
                method: 'PUT',
                body: post,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            invalidatesTags: (result, error, arg) => [{ type: 'Post', id: arg.id }]
        }),
        addNewComment : builder.mutation({
            query : ({comment, token}) => ({
                url : 'comments/',
                method : "POST",
                body : comment,
                headers : {
                    'Authorization' : `Token ${token}`
                }
            }),
            invalidatesTags : ["Comment", "Post"]
        })
    })
})

export const {
    useGetProfileQuery,
    useGetProfilesQuery,
    useEditProfileMutation,
    useAddNewPostMutation,
    useGetPostQuery,
    useGetPostsQuery,
    useEditPostMutation,
    useAddNewCommentMutation
} = apiSlice
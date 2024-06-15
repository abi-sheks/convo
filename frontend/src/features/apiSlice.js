import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_ENDPOINT } from '../constants';

export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({
        baseUrl : BASE_API_ENDPOINT
    }),
    tagTypes: ['Profile'],
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
    })
})

export const {
    useGetProfileQuery,
    useGetProfilesQuery,
    useEditProfileMutation
} = apiSlice
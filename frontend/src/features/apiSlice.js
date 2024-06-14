import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_ENDPOINT } from '../../constants';

export const apiSlice = createApi({
    reducerPath : "api",
    baseQuery : fetchBaseQuery({
        baseUrl : BASE_API_ENDPOINT
    }),
    tagTypes: ['User'],
    
})
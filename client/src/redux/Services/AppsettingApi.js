import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AppsettingApi = createApi({
    reducerPath: 'AppsettingApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/shopinfo/' }),
    endpoints: (builder) => ({
        getShopInfo: builder.query({
            query: () => 'getall',
        }),
        createShopInfo: builder.mutation({
            query: (newShopData) => ({
                url: 'new',
                method: 'POST',
                body: newShopData,
            }),
        }),
        updateShopInfo: builder.mutation({
            query: ({ id, updatedShopData }) => ({
                url: `/update/${id}`,
                method: 'PUT',
                body: updatedShopData,
            }),
        }),
    }),
});

export const { useCreateShopInfoMutation,useUpdateShopInfoMutation,useGetShopInfoQuery} = AppsettingApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/auth/',credentials: 'include'}),
    tagTypes:['User'],
    endpoints: (builder) => ({
        GetAllUser: builder.query({
            query: () => 'getall',
            providesTags:['User']
        }),
        AddUser: builder.mutation({
            query: (values) => ({
                url: 'new',
                method: 'POST',
                body: values
            }),
            invalidatesTags:['User']
        }),
        Login: builder.mutation({
            query: (values) => ({
                url: 'userlogin',
                method: 'POST',
                body: values
            })
        }),
        DeletUser :builder.mutation({
            query:(id)=>({
                url:`delete/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:['User']
        }),
    })
})

export const { useGetAllUserQuery, useAddUserMutation,useLoginMutation ,useDeletUserMutation} = AuthApi

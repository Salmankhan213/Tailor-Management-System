import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const StitchingCategoryApi = createApi({
  reducerPath: 'StitchingCategoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/stitching/category/',credentials: 'include' }),
  tagTypes:['StitchingCategory'],
  endpoints: (builder) => ({
    GetStitchingCategory: builder.query({
      query: () => 'getall',
      providesTags:['StitchingCategory']
    }),
    AddStitchingCategory: builder.mutation({
      query: (Values) => ({
        url:'new',
        method:'POST',
        body:Values
      }),
      invalidatesTags:['StitchingCategory']
    }),
    UpdateStitchingCategory: builder.mutation({
      query: ({id,values}) => {
        console.log(id,values);
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:values
          }
        )

      },
      invalidatesTags:['StitchingCategory']
    }),
    DeleteStitchingCategory: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['StitchingCategory']
    }),
  }),
})

export const {useAddStitchingCategoryMutation,useGetStitchingCategoryQuery,useDeleteStitchingCategoryMutation,useUpdateStitchingCategoryMutation}  = StitchingCategoryApi
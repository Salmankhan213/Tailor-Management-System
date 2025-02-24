import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const StitchingDesignApi = createApi({
  reducerPath: 'StitchingDesignApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/stitching/design/',credentials: 'include' }),
  tagTypes:['StitchingDesign'],
  endpoints: (builder) => ({
    GetStitchingDesign: builder.query({
      query: () => 'getall',
      providesTags:['StitchingDesign']
    }),
    AddStitchingDesign: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['StitchingDesign']
    }),
    UpdateStitchingDesign: builder.mutation({
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
      invalidatesTags:['StitchingDesign']
    }),
    DeleteStitchingDesign: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['StitchingDesign']
    }),
  }),
})

export const {useAddStitchingDesignMutation,useDeleteStitchingDesignMutation,useUpdateStitchingDesignMutation,useGetStitchingDesignQuery}  = StitchingDesignApi
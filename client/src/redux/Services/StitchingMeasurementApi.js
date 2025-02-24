import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const StitchingMeasurmentApi = createApi({
  reducerPath: 'StitchingMeasurmentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/stitching/measurement/',credentials: 'include' }),
  tagTypes:['StitchingMeasurement'],
  endpoints: (builder) => ({
    GetStitchingMeasurement: builder.query({
      query: () => 'getall',
      providesTags:['StitchingMeasurement']
    }),
    AddStitchingMeasurement: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['StitchingMeasurement']
    }),
    UpdateStitchingMeasurement: builder.mutation({
      query: ({id,ind,StitchingDetial}) => {
        console.log(id,ind,StitchingDetial);
        return(
          {
            url:`update/${id}/${ind}`,
            method:'PUT',
            body:{StitchingDetial}
          }
        )

      },
      invalidatesTags:['StitchingMeasurement']
    }),
    DeleteStitchingMeasurement: builder.mutation({
      query: ({id,ind}) => ({
        url:`delete/${id}/${ind}`,
        method:'DELETE'
      }),
      invalidatesTags:['StitchingMeasurement']
    }),
  }),
})

export const {useAddStitchingMeasurementMutation,useDeleteStitchingMeasurementMutation,useUpdateStitchingMeasurementMutation,useGetStitchingMeasurementQuery}  = StitchingMeasurmentApi
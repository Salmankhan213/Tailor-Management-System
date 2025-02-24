import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const CustomerMeasurementApi = createApi({
  reducerPath: 'CustomerMeasurementApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/customer/measurement',credentials: 'include' }),
  tagTypes:['CustomerMeasurement'],
  endpoints: (builder) => ({
    GetCustMeasurement: builder.query({
      query: () => 'getall',
      providesTags:['CustomerMeasurement']
    }),
    AddCustMeasurement: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['CustomerMeasurement']
    }),
    UpdateCustMeasurement: builder.mutation({
      query: ({id,newval}) => {
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:newval
          }
        )

      },
      invalidatesTags:['CustomerMeasurement']
    }),
    GetByIdCustMeasurement:  builder.query({
      query: ({CustId,typeStitching}) => {
        return (
          {
            url : `getbyid/${CustId}/${typeStitching}`,

          }

        )
      },
    }),

  }),
})

export const {useGetCustMeasurementQuery,useAddCustMeasurementMutation,useUpdateCustMeasurementMutation,useGetByIdCustMeasurementQuery}  = CustomerMeasurementApi
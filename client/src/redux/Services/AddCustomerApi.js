import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const AddCustomerApi = createApi({
  reducerPath: 'AddCustomerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/customer/',credentials: 'include' }),
  tagTypes:['Customer'],
  endpoints: (builder) => ({
    GetCustomer: builder.query({
      query: () => 'getall',
      providesTags:['Customer']
    }),
    AddCustomer: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['Customer']
    }),
    UpdateCustomer: builder.mutation({
      query: ({id,values}) => {
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:values
          }
        )

      },
      invalidatesTags:['Customer']
    }),
    DeleteCustomer: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['Customer']
    }),
  }),
})

export const {useAddCustomerMutation,useDeleteCustomerMutation,useUpdateCustomerMutation,useGetCustomerQuery}  = AddCustomerApi
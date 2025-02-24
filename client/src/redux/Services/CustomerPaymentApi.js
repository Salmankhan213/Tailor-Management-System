import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const CustomerPaymentApi = createApi({
  reducerPath: 'CustomerPaymentApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/customer/payment',credentials: 'include' }),
  tagTypes:['CustomerPayment'],
  endpoints: (builder) => ({
    GetCustomerPayment: builder.query({
      query: (id) => `getall/${id}`,
      providesTags:['CustomerPayment']
    }),
    AddCustomerPayment: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['CustomerPayment']
    }),
    UpdateCustomerPayment: builder.mutation({
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
      invalidatesTags:['CustomerPayment']
    }),
    DeleteCustomerPayment: builder.mutation({
      query: ({PaymentId,id}) => ({
        url:`delete/${PaymentId}/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['CustomerPayment']
    }),
    GetCustomerLedger: builder.mutation({
      query: (data) => ({
        url:`getledger`,
        method:'POST',
        body:data
      }),
    }),
  }),
})

export const {useAddCustomerPaymentMutation,useDeleteCustomerPaymentMutation,useUpdateCustomerPaymentMutation,useGetCustomerPaymentQuery,useGetCustomerLedgerMutation}  = CustomerPaymentApi
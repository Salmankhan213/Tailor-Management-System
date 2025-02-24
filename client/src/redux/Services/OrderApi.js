import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const OrderApi = createApi({
  reducerPath: 'OrderApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/customer/order/',credentials: 'include' }),
  tagTypes:['Order'],
  endpoints: (builder) => ({
    GetOrder: builder.query({
      query: () => 'getall',
      providesTags:['Order']
    }),
    GetOrderbyId: builder.query({
      query: (id) => `getbyid/${id}`,
    }),
    AddOrder: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['Order']
    }),
    UpdateOrder: builder.mutation({
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
      invalidatesTags:['Order']
    }),
    DeleteOrder: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['Order']
    }),
    StatusOrder: builder.mutation({
      query: (id) => ({
        url:`status/${id}`,
        method:'POST'
      }),
      invalidatesTags:['Order']
    }),
    ReadyOrder: builder.mutation({
      query: (id) => ({
        url:`ready/${id}`,
        method:'POST'
      }),
      invalidatesTags:['Order']
    }),
    OrderProgress: builder.mutation({
      query: (value) => ({
        url:`orderprogress`,
        method:'POST',
        body:value,
        providesTags:['Order'],
      }),
    }),
  }),
})

export const {
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useGetOrderQuery,
  useGetOrderbyIdQuery,
  useStatusOrderMutation,
  useReadyOrderMutation,
  useOrderProgressMutation
}  = OrderApi
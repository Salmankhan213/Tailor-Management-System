import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const ExpensesCategoryApi = createApi({
  reducerPath: 'ExpensesCategoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/expensescategory/',credentials: 'include' }),
  tagTypes:['ExpensesCategory'],
  endpoints: (builder) => ({
    GetExpensesCategory: builder.query({
      query: () => 'getall',
      providesTags:['ExpensesCategory']
    }),
    AddExpensesCategory: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['ExpensesCategory']
    }),
    UpdateExpensesCategory: builder.mutation({
      query: ({id,values}) => {
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:values
          }
        )

      },
      invalidatesTags:['ExpensesCategory']
    }),
    DeleteExpensesCategory: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['ExpensesCategory']
    }),
  }),
})

export const {useAddExpensesCategoryMutation,useUpdateExpensesCategoryMutation,useDeleteExpensesCategoryMutation,useGetExpensesCategoryQuery}  = ExpensesCategoryApi
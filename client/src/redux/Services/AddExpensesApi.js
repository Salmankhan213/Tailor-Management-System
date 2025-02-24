import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const AddExpensesApi = createApi({
  reducerPath: 'AddExpensesApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/addexpenses/',credentials: 'include' }),
  tagTypes:['Expenses'],
  endpoints: (builder) => ({
    GetExpenses: builder.query({
      query: () => 'getall',
      providesTags:['Expenses']
    }),
    AddExpenses: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['Expenses']
    }),
    UpdateExpenses: builder.mutation({
      query: ({id,values}) => {
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:values
          }
        )

      },
      invalidatesTags:['Expenses']
    }),
    DeleteExpenses: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['Expenses']
    }),
  }),
})

export const {useAddExpensesMutation,useDeleteExpensesMutation,useUpdateExpensesMutation,useGetExpensesQuery}  = AddExpensesApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const WorkerAccountBookApi = createApi({
  reducerPath: 'WorkerAccountBookApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/workeraccountbook/',credentials: 'include' }),
  tagTypes:['WorkerAccount'],
  endpoints: (builder) => ({
    GetWorkerAccount: builder.query({
      query: () => 'getall',
      providesTags:['WorkerAccount']
    }),
    AddWorkerAccount: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['WorkerAccount']
    }),
    DeleteWorkerAccount: builder.mutation({
      query: ({id,workerId}) => ({
        url:`delete/${id}/${workerId}`,
        method:'DELETE'
      }),
      invalidatesTags:['WorkerAccount']
    }),
  }),
})

export const {useAddWorkerAccountMutation,useDeleteWorkerAccountMutation,useGetWorkerAccountQuery}  = WorkerAccountBookApi
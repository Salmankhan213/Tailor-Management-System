import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const AddWorkerApi = createApi({
  reducerPath: 'AddWorkerApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:2000/worker/',credentials: 'include' }),
  tagTypes:['Worker'],
  endpoints: (builder) => ({
    GetWorker: builder.query({
      query: () => 'getall',
      providesTags:['Worker']
    }),
    AddWorker: builder.mutation({
      query: (values) => {
        return (
          {
            url:'new',
            method:'POST',
            body:values
          }
        )
      },
      invalidatesTags:['Worker']
    }),
    UpdateWorker: builder.mutation({
      query: ({id,values}) => {
        console.log('valesapi',values)
        return(
          {
            url:`update/${id}`,
            method:'PUT',
            body:values
          }
        )

      },
      invalidatesTags:['Worker']
    }),
    DeleteWorker: builder.mutation({
      query: (id) => ({
        url:`delete/${id}`,
        method:'DELETE'
      }),
      invalidatesTags:['Worker']
    }),
  }),
})

export const {useAddWorkerMutation,useGetWorkerQuery,useUpdateWorkerMutation,useDeleteWorkerMutation}  = AddWorkerApi
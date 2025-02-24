import {configureStore} from "@reduxjs/toolkit"
import { StitchingCategoryApi } from "./Services/StitchingCategoryApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { StitchingMeasurmentApi } from "./Services/StitchingMeasurementApi";
import { StitchingDesignApi } from "./Services/StitchingDesign";
import { AddCustomerApi } from "./Services/AddCustomerApi";
import { CustomerMeasurementApi } from "./Services/CustomerMeasurementApi.js";
import { OrderApi } from "./Services/OrderApi.js";
import { CustomerPaymentApi } from "./Services/CustomerPaymentApi.js";
import { PrintReducer } from "./Services/Features/PrintSlice.js";
import { AddWorkerApi } from "./Services/AddWorkerApi.js";
import { WorkerAccountBookApi } from "./Services/WorkerAccountBookApi.js";
import {ExpensesCategoryApi} from "./Services/ExpensesCategoryApi.js"
import { AddExpensesApi } from "./Services/AddExpensesApi.js";
import { NavReducer } from "./Services/Features/NavSlice.js";
import {AuthApi} from './Services/AuthApi.js'
import {AppsettingApi} from '../redux/Services/AppsettingApi.js'
export  const store = configureStore({
    reducer:{
          [StitchingCategoryApi.reducerPath]:StitchingCategoryApi.reducer,
          [StitchingMeasurmentApi.reducerPath]:StitchingMeasurmentApi.reducer,
          [StitchingDesignApi.reducerPath]:StitchingDesignApi.reducer,
          [AddCustomerApi.reducerPath]:AddCustomerApi.reducer,
          [CustomerMeasurementApi.reducerPath]:CustomerMeasurementApi.reducer,
          [OrderApi.reducerPath]:OrderApi.reducer,
          [CustomerPaymentApi.reducerPath]:CustomerPaymentApi.reducer,
          [AddWorkerApi.reducerPath]:AddWorkerApi.reducer,
          [WorkerAccountBookApi.reducerPath]:WorkerAccountBookApi.reducer,
          [ExpensesCategoryApi.reducerPath]:ExpensesCategoryApi.reducer,
          [AddExpensesApi.reducerPath]:AddExpensesApi.reducer,
          [AuthApi.reducerPath]:AuthApi.reducer,
          [AppsettingApi.reducerPath]:AppsettingApi.reducer,
          Print:PrintReducer,
          Navigation:NavReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(StitchingCategoryApi.middleware,
            StitchingMeasurmentApi.middleware,
            StitchingDesignApi.middleware,
            AddCustomerApi.middleware,
            CustomerMeasurementApi.middleware,
            OrderApi.middleware,
            CustomerPaymentApi.middleware,
            AddWorkerApi.middleware,
            WorkerAccountBookApi.middleware,
            ExpensesCategoryApi.middleware,
            AddExpensesApi.middleware,
            AuthApi.middleware,
            AppsettingApi.middleware,
        ),
})


setupListeners(store.dispatch)

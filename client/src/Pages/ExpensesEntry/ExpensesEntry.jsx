import React from 'react'
import Layout from '../Layout/Layout'
import * as Yup  from 'yup'
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next';
import {useAddExpensesCategoryMutation,useGetExpensesCategoryQuery,useDeleteExpensesCategoryMutation} from '../../redux/Services/ExpensesCategoryApi'
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'
import { useAddExpensesMutation,useGetExpensesQuery,useDeleteExpensesMutation } from '../../redux/Services/AddExpensesApi';

function ExpensesEntry() {
const {t} = useTranslation()

const [AddExpensesCategory] =  useAddExpensesCategoryMutation()
const [DeleteExpensesCategory] =  useDeleteExpensesCategoryMutation()
const {data:expensesCategoryData} =  useGetExpensesCategoryQuery()
const [AddExpensesData] = useAddExpensesMutation()
const {data:expensesdata} = useGetExpensesQuery()
const [DeleteExpensesData] = useDeleteExpensesMutation()

    const ExpensesSchema = Yup.object({
        Date: Yup.string().required('Date Required'),
        TypeExpenses: Yup.string().required('Type Expenses Required'),
        ExpensesAmount: Yup.number().required('Expenses Price Required'),
      });
    const ExpensesCategorySchema = Yup.object({
        ExpensesCategory: Yup.string().required('Expenses Category Required'),
      });

      const handleAddExpensesCategory = async (values,{resetForm})=>{
        try {
            const res = await AddExpensesCategory(values).unwrap()
            if(res.success){
            showSuccessAlert(res.message)
            resetForm()
            }
            else if(!res.success){
                showErrorAlert(res.message)
            }
        } catch (error) {
            showErrorAlert(error)
        }
      }
      const handleCategoryDelete = async (id)=>{
        try {
            const res = await DeleteExpensesCategory(id).unwrap()
            if(res.success){
            showSuccessAlert(res.message)
            }
            else if(!res.success){
                showErrorAlert(res.message)
            }
        } catch (error) {
            showErrorAlert(error)
        }
      }
      
      
      const handleAddExpenses= async (values,{resetForm})=>{
        try {
            const res = await AddExpensesData(values).unwrap()
            if(res.success){
            showSuccessAlert(res.message)
            resetForm()
            }
            else if(!res.success){
                showErrorAlert(res.message)
            }
        } catch (error) {
            showErrorAlert(error)
        }
      }
      const handleDeleteExpenses= async (id)=>{
        try {
            const res = await DeleteExpensesData(id).unwrap()
            if(res.success){
            showSuccessAlert(res.message)
            }
            else if(!res.success){
                showErrorAlert(res.message)
            }
        } catch (error) {
            showErrorAlert(error)
        }
      }

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <Formik
            initialValues={{
              Date: new Date().toISOString().split("T")[0],
              TypeExpenses: "",
              ExpensesAmount: 0,
              Detail: "",
            }}
            validationSchema={ExpensesSchema}
            onSubmit={handleAddExpenses}
          >
            {() => (
              <Form className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="Date" className="form-label fw-bold">
                    Date
                  </label>
                  <Field
                    name="Date"
                    type="Date"
                    className="form-control"
                    id="Date"
                  />
                  <ErrorMessage
                    name="Date"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="col-md-4 ">
                  <label htmlFor="TypeExpenses" className="form-label fw-bold">
                    Types Expenses
                  </label>
                  <div className="expenses d-flex gap-2">
                    <Field
                      name="TypeExpenses"
                      as="select"
                      className="form-control"
                      id="TypeExpenses"
                    >
                      <option value="">Select Expenses</option>
                      {expensesCategoryData?.FetchExpensesCategory.map(
                        (Category, i) => {
                          return (
                            <option value={Category.ExpensesCategory} key={i}>
                              {Category.ExpensesCategory}
                            </option>
                          );
                        }
                      )}
                    </Field>
                    <button
                      type="button"
                      className="btn btn-dark py-1 text-white fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <ErrorMessage
                    name="TypeExpenses"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="col-md-4">
                  <label
                    htmlFor="ExpensesAmount"
                    className="form-label fw-bold"
                  >
                    Expenses Amount
                  </label>
                  <Field
                    name="ExpensesAmount"
                    type="number"
                    className="form-control"
                  />

                  <ErrorMessage
                    name="ExpensesAmount"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="Detail" className="form-label fw-bold">
                    Detail
                  </label>
                  <Field
                    name="Detail"
                    as="textarea"
                    className="form-control"
                    id="Detail"
                  />
                </div>
                <div className="col-md-12 text-center my-4">
                  <button type="submit" className="btn btn-success">
                    {t("save")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        <div className="row my-5">
        <div className="col-md-12">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>{t("sNo")}</th>
              <th>Date</th>
              <th>Type Expenses</th>
              <th>Amount</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {expensesdata?.FetchExpenses.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <p className="text-danger text-center">Data Not Found</p>
                </td>
              </tr>
            ) : (
              expensesdata?.FetchExpenses?.slice()
                .reverse()
                .map((Expenses, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{Expenses.Date}</td>
                      <td>{Expenses.TypeExpenses}</td>
                      <td>{Expenses.ExpensesAmount}</td>
                    
                      <td>
                        <button
                          className="btn btn-sm btn-danger" onClick={()=>handleDeleteExpenses(Expenses._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

        </div>
      </div>


      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content px-2">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Add Expenses Type
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-4">
              <div className="row">
                <>
                  <div className="col-md-6">
                    <Formik
                      enableReinitialize
                      initialValues={{
                        ExpensesCategory: "",
                      }}
                      validationSchema={ExpensesCategorySchema}
                      onSubmit={handleAddExpensesCategory}
                    >
                      {() => (
                        <Form className="row g-3">
                          <div className="col-md-12">
                            <label
                              htmlFor="ExpensesCategory"
                              className="form-label"
                            >
                              Expenses Category
                            </label>
                            <Field
                              name="ExpensesCategory"
                              type="text"
                              className="form-control"
                              id="DesignName"
                            />
                            <ErrorMessage
                              name="ExpensesCategory"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <div className="col-md-12 text-center">
                            <button type="submit" className="btn btn-success">
                              {t("save")}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                  <div className="col-md-6">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>{t("sNo")}</th>
                          <th>Expenses Category</th>
                          <th>{t("action")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expensesCategoryData?.FetchExpensesCategory.length ==
                        0 ? (
                          <tr>
                            <td colSpan={3}>
                              <p className="text-danger text-center">
                                Data Not Found
                              </p>
                            </td>
                          </tr>
                        ) : (
                          expensesCategoryData?.FetchExpensesCategory?.slice()
                            .reverse()
                            .map((Category, i) => {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{Category.ExpensesCategory}</td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        handleCategoryDelete(Category._id)
                                      }
                                    >
                                      <i className="fa-solid fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ExpensesEntry

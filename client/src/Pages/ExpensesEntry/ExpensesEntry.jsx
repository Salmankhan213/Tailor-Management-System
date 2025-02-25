import React from 'react';
import Layout from '../Layout/Layout';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useAddExpensesCategoryMutation, useGetExpensesCategoryQuery, useDeleteExpensesCategoryMutation } from '../../redux/Services/ExpensesCategoryApi';
import { showErrorAlert, showSuccessAlert } from '../../util/SweetalertHelper';
import { useAddExpensesMutation, useGetExpensesQuery, useDeleteExpensesMutation } from '../../redux/Services/AddExpensesApi';
import Select from 'react-select';

function ExpensesEntry() {
  const [AddExpensesCategory] = useAddExpensesCategoryMutation();
  const [DeleteExpensesCategory] = useDeleteExpensesCategoryMutation();
  const { data: expensesCategoryData } = useGetExpensesCategoryQuery();
  const [AddExpensesData] = useAddExpensesMutation();
  const { data: expensesdata } = useGetExpensesQuery();
  const [DeleteExpensesData] = useDeleteExpensesMutation();


  const ExpensesSchema = Yup.object({
    Date: Yup.string().required('Date is required'),
    TypeExpenses: Yup.string().required('Type of Expenses is required'),
    ExpensesAmount: Yup.number().required('Expenses Amount is required'),
  });

  const ExpensesCategorySchema = Yup.object({
    ExpensesCategory: Yup.string().required('Expenses Category is required'),
  });

  const handleAddExpensesCategory = async (values, { resetForm }) => {
    try {
      const res = await AddExpensesCategory(values).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        resetForm();
      } else {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleCategoryDelete = async (id) => {
    try {
      const res = await DeleteExpensesCategory(id).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
      } else {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleAddExpenses = async (values, { resetForm }) => {
    try {
      const res = await AddExpensesData(values).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        resetForm();
      } else {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleDeleteExpenses = async (id) => {
    try {
      const res = await DeleteExpensesData(id).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
      } else {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const expensesCategoryOptions = expensesCategoryData?.FetchExpensesCategory.map((category) => ({
    value: category.ExpensesCategory,
    label: category.ExpensesCategory,
  }));

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <Formik
            initialValues={{
              Date: new Date().toISOString().split('T')[0],
              TypeExpenses: '',
              ExpensesAmount: 0,
              Detail: '',
            }}
            validationSchema={ExpensesSchema}
            onSubmit={handleAddExpenses}
          >
            {({ setFieldValue }) => (
              <Form className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="Date" className="form-label fw-bold">
                    Date
                  </label>
                  <Field name="Date" type="date" className="form-control" id="Date" />
                  <ErrorMessage name="Date" component="div" className="text-danger" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="TypeExpenses" className="form-label fw-bold">
                    Type of Expenses
                  </label>
                  <div className="d-flex gap-2">
                    <Select
                      name="TypeExpenses"
                      options={expensesCategoryOptions}
                      onChange={(selectedOption) => setFieldValue('TypeExpenses', selectedOption.value)}
                      className="basic-select flex-grow-1"
                      classNamePrefix="select"
                      placeholder="Select Expenses"
                    />
                    <button
                      type="button"
                      className="btn btn-dark py-1 text-white fw-bold"
                      data-bs-toggle="modal"
                      data-bs-target="#addExpenseTypeModal"
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  <ErrorMessage name="TypeExpenses" component="div" className="text-danger" />
                </div>
                <div className="col-md-4">
                  <label htmlFor="ExpensesAmount" className="form-label fw-bold">
                    Expenses Amount
                  </label>
                  <Field name="ExpensesAmount" type="number" className="form-control" />
                  <ErrorMessage name="ExpensesAmount" component="div" className="text-danger" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="Detail" className="form-label fw-bold">
                    Detail
                  </label>
                  <Field name="Detail" as="textarea" className="form-control" id="Detail" />
                </div>
                <div className="col-md-12 text-center my-4">
                  <button type="submit" className="btn btn-success">
                    Save
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
                  <th>S.No</th>
                  <th>Date</th>
                  <th>Type of Expenses</th>
                  <th>Amount</th>
                  <th>Action</th>
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
                    .map((Expenses, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{Expenses.Date}</td>
                        <td>{Expenses.TypeExpenses}</td>
                        <td>{Expenses.ExpensesAmount}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDeleteExpenses(Expenses._id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for Adding Expense Type */}
      <div className="modal fade" id="addExpenseTypeModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="addExpenseTypeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addExpenseTypeModalLabel">
                Add Expense Type
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
      
              <Formik
                initialValues={{
                  ExpensesCategory: '',
                }}
                validationSchema={ExpensesCategorySchema}
                onSubmit={handleAddExpensesCategory}
              >
                {() => (
                  <Form>
                    <div className="mb-3 col-12">
                      <label htmlFor="ExpensesCategory" className="form-label">
                        Expense Category
                      </label>
                      <Field name="ExpensesCategory" type="text" className="form-control" id="ExpensesCategory" />
                      <ErrorMessage name="ExpensesCategory" component="div" className="text-danger" />
                    </div>
                    <div className='text-center'>
                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
              <div className="col-12">
                <table className='table table-striped'>
                  <thead>
                    <tr>
                      <th>S.NO</th>
                      <th>Expenses Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expensesCategoryData?.FetchExpensesCategory.length === 0 ?(
                      <tr>
                        <td colSpan={2}>
                          <h6>no data available in the table</h6>
                        </td>
                      </tr>
                    ):(
                    expensesCategoryData?.FetchExpensesCategory?.map((cat,i)=>{
                      return (
                        <tr key={i}>
                          <td>{i+1}</td>
                          <td>{cat.ExpensesCategory}</td>
                          <td>
                            <button className='btn btn-danger btn-sm' onClick={()=> handleCategoryDelete(cat._id)}>
                              <i className='fa fa-trash'></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })
                    )
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ExpensesEntry;
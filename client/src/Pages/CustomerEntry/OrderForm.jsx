import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { useGetStitchingDesignQuery } from '../../redux/Services/StitchingDesign';
import { useGetStitchingCategoryQuery } from '../../redux/Services/StitchingCategoryApi';
import { useAddOrderMutation } from '../../redux/Services/OrderApi';
import { showErrorAlert, showSuccessAlert } from '../../util/SweetalertHelper';
import { useGetCustomerQuery } from '../../redux/Services/AddCustomerApi';
import Layout from '../Layout/Layout';

const validationSchema = Yup.object().shape({
  orderDate: Yup.string().required('Order date is required'),
  deliveryDate: Yup.string().required('Delivery date is required'),
  designCode: Yup.string().required('Design code is required'),
  typeStitching: Yup.string().required('Stitching type is required'),
  stitching: Yup.string().required('Stitching is required'),
  stitchingPrice: Yup.number().required('Stitching price is required').min(1, 'Price must be greater than 0'),
  quantity: Yup.number().required('Quantity is required').min(1, 'Quantity must be at least 1'),
  AdvancePrice: Yup.number().required('Advance price is required').min(0, 'Advance price cannot be negative'),
});

const OrderForm = () => {
  const { id, ind } = useParams();
  const { data: Designdata } = useGetStitchingDesignQuery();
  const { data: StitchingTypeData } = useGetStitchingCategoryQuery();
  const selectedItemsRef = useRef([]);
  const [selectedStitching, setSelectedStitching] = useState(null);
  const [totalItems, setTotalItems] = useState([]);
  const [customerDetail, setCustomerDetail] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [AddOrderData] = useAddOrderMutation();
  const { refetch: refetchCustomer } = useGetCustomerQuery();

  // Fetch customer details
  useEffect(() => {
    const getAllCustomer = async () => {
      const res = await axios.get("http://localhost:2000/customer/getall");
      const data = await res.data.FetchCustomer;
      const { CustomerName, PhoneNo } = data.find((item) => item._id === id);
      setCustomerDetail({ CustomerName, PhoneNo });
    };
    getAllCustomer();
  }, [id]);

  // Handle stitching type change
  const handleTypeStitchingChange = useCallback((selectedOption, setFieldValue,values) => {
    const value = selectedOption.value;
    const foundCategory = StitchingTypeData?.FetchCategory?.find(
      (item) => item.TypeStitchingName.trim().toLowerCase() === value.trim().toLowerCase()
    );
    if (foundCategory) {
      setSelectedStitching(foundCategory);
     if(values.stitching === 'DoubleStitching'){
       const findPrice = foundCategory.DoubleStitching
       setFieldValue('stitchingPrice',findPrice)
     }
     if(values.stitching === 'SingleStitching'){
      const findPrice = foundCategory.SingleStitching
      setFieldValue('stitchingPrice',findPrice)
     }
    }

    setFieldValue('typeStitching', value);
    setFieldValue('quantity', value !== '' ? 1 : 0);
  }, [StitchingTypeData]);

  // Handle stitching change
  const handleStitchingChange = useCallback((selectedOption, setFieldValue) => {
    const value = selectedOption.value;

    if (value === 'SingleStitching') {
      setFieldValue('stitchingPrice', selectedStitching?.SingleStitching || 0);
    } else if (value === 'DoubleStitching') {
      setFieldValue('stitchingPrice', selectedStitching?.DoubleStitching || 0);
    }

    setFieldValue('stitching', value);
  }, [selectedStitching]);

  // Handle checkbox change for details
  const handleCheckboxChange = useCallback((e, setFieldValue) => {
    const { value, checked } = e.target;
    let updatedSelectedItems = selectedItemsRef.current;

    if (checked) {
      updatedSelectedItems = [...updatedSelectedItems, value];
    } else {
      updatedSelectedItems = updatedSelectedItems.filter((item) => item !== value);
    }

    selectedItemsRef.current = updatedSelectedItems;
    setFieldValue('details', updatedSelectedItems.join(', '));
  }, []);

  // Calculate total price
  const calculateTotalPriceOrder = (updatedItems, values, setFieldValue) => {
    const total = updatedItems.reduce((sum, item) => sum + item.TotalPriceOrder, 0);
    setTotalPrice(total);
    setFieldValue('TotalPriceOrder', total);
    const RemainingPrice = total - values.AdvancePrice;
    setFieldValue('RemainingPrice', RemainingPrice);
  };

  // Handle advance price change
  const handleAdvance = (e, setFieldValue, totalPrice) => {
    const value = Number(e.target.value);
    setFieldValue('AdvancePrice', value);
    const newRemaining = totalPrice - value;
    setFieldValue('RemainingPrice', newRemaining);
  };

  // Add items to the order
  const handleAddItems = (values, setFieldValue) => {
    const totalPrice = values.stitchingPrice * values.quantity;

    const newItem = {
      typeStitching: values.typeStitching,
      stitching: values.stitching,
      designCode: values.designCode,
      stitchingPrice: values.stitchingPrice,
      quantity: values.quantity,
      TotalPriceOrder: totalPrice,
      details: values.details,
      orderDate: values.orderDate,
      deliveryDate: values.deliveryDate,
    };

    if (
      values.typeStitching &&
      values.designCode &&
      values.stitchingPrice &&
      values.quantity &&
      values.details &&
      values.orderDate &&
      values.deliveryDate
    ) {
      const updatedItems = [...totalItems, newItem];
      setTotalItems(updatedItems);
      calculateTotalPriceOrder(updatedItems, values, setFieldValue);
    }
  };

  // Delete item from the order
  const handleDeleteItem = (index, values, setFieldValue) => {
    const filtered = totalItems.filter((_, i) => i !== index);
    setTotalItems(filtered);
    calculateTotalPriceOrder(filtered, values, setFieldValue);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      const orderData = {
        CustomerId: id,
        totalItems: totalItems,
        TotalPriceOrder: totalPrice,
        advancePrice: values.AdvancePrice,
        remainingPrice: values.RemainingPrice,
      };

      const res = await AddOrderData(orderData).unwrap();

      if (res.success) {
        showSuccessAlert(res.message);
        setTotalItems([]);
        setTotalPrice(0);
        resetForm();
        refetchCustomer();
      } else{
        showErrorAlert(res.message);
        res.missingMeasurements.forEach((element) => {
          showErrorAlert(element);
        });
      }
    } catch (error) {
      showErrorAlert(error);

      if (error.data?.missingMeasurements) {
        error.data.missingMeasurements.forEach((element) => {
          showErrorAlert(element);
        });
      }
    }
  };

  // Options for react-select
  const designOptions = Designdata?.FetchDesign?.map((design) => ({
    value: design.DesignName,
    label: design.DesignName,
  })) || [];

  const stitchingTypeOptions = StitchingTypeData?.FetchCategory?.map((type) => ({
    value: type.TypeStitchingName,
    label: type.TypeStitchingName,
  })) || [];

  const stitchingOptions = [
    { value: 'SingleStitching', label: 'Single Stitching' },
    { value: 'DoubleStitching', label: 'Double Stitching' },
  ];

  return (
    <Layout>
      <div className="container mt-4">
        <h3 className="text-center mb-4">Order Entry</h3>
        <Formik
          initialValues={{
            orderDate: new Date().toISOString().slice(0, 10),
            deliveryDate: "",
            designCode: "",
            typeStitching: "",
            stitching: "",
            stitchingPrice: 0,
            quantity: 0,
            details: selectedItemsRef.current.join(", "),
            TotalPriceOrder: 0,
            AdvancePrice: 0,
            RemainingPrice: 0,
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={(values=> console.log(values))}
        >
          {({ values, setFieldValue }) => (
            <Form>
              {/* Form fields */}
              <div className="row">
                <div className="col-md-4 col-lg-1">
                  <div className="form-group mb-3">
                    <label>Order_No</label>
                    <Field
                      name="orderNumber"
                      type="number"
                      value={ind}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Client_Name</label>
                    <Field
                      name="clientName"
                      type="text"
                      value={customerDetail?.CustomerName || ""}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label>Phone No</label>
                    <Field
                      name="mobileNumber"
                      type="number"
                      value={customerDetail?.PhoneNo}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Order Date</label>
                    <Field
                      name="orderDate"
                      type="date"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="orderDate"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Delivery Date</label>
                    <Field
                      name="deliveryDate"
                      type="date"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="deliveryDate"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
              </div>

              {/* Design Code */}
              <div className="row">
                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Design Code</label>
                    <Select
                      name="designCode"
                      options={designOptions}
                      onChange={(selectedOption) => setFieldValue('designCode', selectedOption.value)}
                      className="basic-single"
                      classNamePrefix="select"
                    />
                    <ErrorMessage
                      name="designCode"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Type Stitching */}
                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Type Stitching</label>
                    <Select
                      name="typeStitching"
                      options={stitchingTypeOptions}
                      onChange={(selectedOption) => handleTypeStitchingChange(selectedOption, setFieldValue,values)}
                      className="basic-single"
                      classNamePrefix="select"
                    />
                    <ErrorMessage
                      name="typeStitching"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Stitching */}
                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Stitching</label>
                    <Select
                      name="stitching"
                      options={stitchingOptions}
                      onChange={(selectedOption) => handleStitchingChange(selectedOption, setFieldValue)}
                      className="basic-single"
                      classNamePrefix="select"
                    />
                    <ErrorMessage
                      name="stitching"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Stitching Price */}
                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>Stitching Price</label>
                    <Field
                      name="stitchingPrice"
                      type="number"
                      className="form-control"
                      disabled
                    />
                    <ErrorMessage
                      name="stitchingPrice"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-md-4 col-lg-1">
                  <div className="form-group mb-3">
                    <label>Quantity</label>
                    <Field
                      name="quantity"
                      type="number"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="quantity"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
              </div>

              {/* Details and Checkboxes */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>Details</label>
                    <Field
                      name="details"
                      as="textarea"
                      className="form-control"
                      readOnly
                    />
                    <ErrorMessage
                      name="details"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="col-md-5 mx-4 p-4" style={{ backgroundColor: "#efefef" }}>
                  {[
                    { id: 'item2', label: 'Gold Button' },
                    { id: 'item3', label: 'Round Button' },
                    { id: 'item4', label: 'Front Pocket' },
                    { id: 'item5', label: 'Side Pocket' },
                  ].map((item) => (
                    <div className="form-check my-2" key={item.id}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={item.label}
                        id={item.id}
                        onChange={(e) => handleCheckboxChange(e, setFieldValue)}
                        checked={selectedItemsRef.current.includes(item.label)}
                      />
                      <label className="form-check-label" htmlFor={item.id}>
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Item Button */}
              <button
                type="button"
                className="btn btn-success mx-4"
                onClick={() => handleAddItems(values, setFieldValue)}
              >
                Add Item
              </button>

              {/* Total Price, Advance Price, Remaining Price */}
              <div className="row mt-4">
                <div className="col-md-12 col-lg-6">
                  <div className="col-md-6 col-lg-6">
                    <label htmlFor="TotalPriceOrder">Total Price</label>
                    <Field
                      className="form-control w-100"
                      name="TotalPriceOrder"
                      value={totalPrice}
                      type="number"
                      disabled
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label htmlFor="AdvancePrice">Advance Price</label>
                    <Field
                      className="form-control"
                      name="AdvancePrice"
                      type="number"
                      onChange={(e) => handleAdvance(e, setFieldValue, totalPrice)}
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label htmlFor="RemainingPrice">Remaining Price</label>
                    <Field
                      className="form-control"
                      name="RemainingPrice"
                      type="number"
                      disabled
                    />
                  </div>
                </div>

                {/* Order Items Table */}
                <div className="col-md-12 col-lg-6">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Type Stitching</th>
                        <th>Design Code</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total Price</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {totalItems.length > 0 ? (
                        totalItems.map((item, i) => (
                          <tr key={i}>
                            <td>{item.typeStitching}</td>
                            <td>{item.designCode}</td>
                            <td>{item.stitchingPrice}</td>
                            <td>{item.quantity}</td>
                            <td>{item.TotalPriceOrder}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteItem(i, values, setFieldValue)}
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <h6 className="text-danger text-center">No Data available in the table</h6>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-center my-4">
                <button className="btn btn-danger px-5" type="submit" onClick={()=>handleSubmit(values)}>  
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default OrderForm;
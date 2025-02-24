import React, { useEffect, useState,useRef,useCallback} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { useGetStitchingDesignQuery } from '../../redux/Services/StitchingDesign';
import { useGetStitchingCategoryQuery} from '../../redux/Services/StitchingCategoryApi';
import { useAddOrderMutation } from '../../redux/Services/OrderApi';
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'
import { useGetCustomerQuery } from '../../redux/Services/AddCustomerApi';
import Layout from '../Layout/Layout'

const OrderForm = () => {

  const {id,ind} = useParams()
  const {data:Designdata} = useGetStitchingDesignQuery()
  const {data:StitchingTypeData} = useGetStitchingCategoryQuery()
  const selectedItemsRef = useRef([]);
  const [selectedStitcing, setSelectedStitcing] = useState(null);
  const [totalItems,setTotalitems] = useState([])
  const [customerDeial,setCustomerDetial] = useState(null)
  const [totalPrice,setTotalPrice] = useState(0)
 const [AddOrderData] =  useAddOrderMutation()
 const {refetch: refetchCustomer} = useGetCustomerQuery()
 
 
  const { t,i18n } = useTranslation();

  useEffect(() => {
    const getAllcustomer = async () => {
      const res = await axios.get(
        "http://localhost:2000/customer/getall"
      );
      const data = await res.data.FetchCustomer;
      const { CustomerName, PhoneNo } = data.find(
        (item) => item._id == id
      );
      setCustomerDetial({CustomerName,PhoneNo})
    };
    getAllcustomer();
  }, [id]);

  const handleTypeStitchingChange = useCallback((e, setFieldValue) => {
    const value = e.target.value;
    const foundCategory = StitchingTypeData?.FetchCategory?.find(
      (item) => item.TypeStitchingName.trim().toLowerCase() === value.trim().toLowerCase()
    );
    
    if (foundCategory) {
      setSelectedStitcing(foundCategory);
    }
  
    setFieldValue('typeStitching', value);
    setFieldValue('quantity', value !== '' ? 1 : 0);
  }, [StitchingTypeData]);

  const handleStitchingChange = useCallback((e, setFieldValue) => {
    const value = e.target.value;
    
    if (value === 'SingleStitching') {
      setFieldValue('stitchingPrice', selectedStitcing?.SingleStitching || 0);
    } else if (value === 'DoubleStitching') {
      setFieldValue('stitchingPrice', selectedStitcing?.DoubleStitching || 0);
    }
    
    setFieldValue('stitching', value);
  }, [selectedStitcing]);

  useEffect(()=>{
    document.documentElement.dir = i18n.language === "ur" ? 'rtl':"ltr"
  },[i18n.language])

  const items = [
    { id: 'item2', label: t('goldButton') },
    { id: 'item3', label: t('roundButton') },
    { id: 'item4', label: t('frontPocket') },
    { id: 'item5', label: t('sidePocket') },
    ];
  const handleCheckboxChange = useCallback(
    (e, setFieldValue) => {
      const { value, checked } = e.target;
      let updatedSelectedItems = selectedItemsRef.current;

      if (checked) {
        updatedSelectedItems = [...updatedSelectedItems, value];
      } else {
        updatedSelectedItems = updatedSelectedItems.filter((item) => item !== value);
      }

      selectedItemsRef.current = updatedSelectedItems;
      setFieldValue('details', updatedSelectedItems.join(', '));
    },
    []
  );


const calculateTotalPriceOrder = (updatedItems) => {
    const total = updatedItems.reduce((sum, item) => sum + item.TotalPriceOrder, 0);
    setTotalPrice(total)
}
const handleAdvance = (e,setFieldValue,totalPrice)=>{
   const value = e.target.value
   setFieldValue('AdvancePrice',value)

   const NewRemaining = totalPrice - value
   setFieldValue('RemainingPrice',NewRemaining)
}
const HandleAddItems = (values,setFieldValue,)=>{
  const totalprice = values.stitchingPrice * values.quantity
  const newItem = {
    typeStitching: values.typeStitching,
    stitching: values.stitching,
    designCode: values.designCode,
    stitchingPrice: values.stitchingPrice,
    quantity: values.quantity,
    TotalPriceOrder: totalprice,
    details:values.details,
    orderDate: values.orderDate, 
    deliveryDate: values.deliveryDate, 
  };
  if(values.typeStitching && values.designCode && values.stitchingPrice
    && values.quantity && values.details && values.orderDate && values.deliveryDate
  ){
    const updatedItems = [...totalItems, newItem];
    setTotalitems(updatedItems);
    calculateTotalPriceOrder(updatedItems);
  }
}

const handleDeleteItem = (index)=>{
  const filtered = totalItems.filter((_,i)=> i !== index)
  setTotalitems(filtered)
}
const HandleSubmit = async (values, resetForm) => {
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
      showSuccessAlert('Order Added!');
      setTotalitems([]);
      setTotalPrice(0);
      resetForm();
      refetchCustomer();
    } 
    else {
      showErrorAlert(res.message);
      res.missingMeasurements.forEach(element => {
        showErrorAlert(element);
      });
    }
  } catch (error) {
    const errorMessage = 'An unknown error occurred';
    showErrorAlert(errorMessage);

    if (error.data?.missingMeasurements) {
      error.data.missingMeasurements.forEach(element => {
        showErrorAlert(element);
      });
    }
  }
};

  return (
    <Layout>
    <div
      className="container mt-4"
      dir={i18n.language === "ur" ? "rtl" : "ltr"}
    >
      <h3 className="text-center mb-4">{t("orderEntry")}</h3>{" "}
      {/* Translate the title */}
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
        validationSchema={null}
        onSubmit={(values,{resetForm}) => HandleSubmit(values,resetForm)}
      >
        {({ values, setFieldValue }) => {
          return (
            <Form>
              <div className="row">
                <div className="col-md-4 col-lg-1">
                  <div className="form-group mb-3">
                    <label>0rder_No</label>
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
                      value={customerDeial?.CustomerName}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group mb-3">
                    <label>{t("mobileNumber")}</label>
                    <Field
                      name="mobileNumber"
                      type="number"
                      value={customerDeial?.PhoneNo}
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("orderDate")}</label>
                    <Field
                      name="orderDate"
                      type="date"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-6 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("deliveryDate")}</label>
                    <Field
                      name="deliveryDate"
                      type="date"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("designCode")}</label>
                    <Field
                      name="designCode"
                      as="select"
                      className="form-control"
                    >
                      <option value="">{t("selectDesign")}</option>
                      {Designdata &&
                        Designdata?.FetchDesign?.map((design, i) => (
                          <option value={design.DesignName} key={i}>
                            {design.DesignName}
                          </option>
                        ))}
                    </Field>
                  </div>
                </div>

                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("typeStitching")}</label>
                    <Field
                      name="typeStitching"
                      as="select"
                      className="form-control"
                      onChange={(e) =>
                        handleTypeStitchingChange(e, setFieldValue)
                      }
                    >
                      <option value="">{t("selectTypeStitching")}</option>
                      {StitchingTypeData &&
                        StitchingTypeData?.FetchCategory?.map((type, i) => (
                          <option value={type.TypeStitchingName} key={i}>
                            {type.TypeStitchingName}{" "}
                          </option>
                        ))}
                    </Field>
                  </div>
                </div>

                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("stitching")}</label>
                    <Field
                      name="stitching"
                      as="select"
                      className="form-control"
                      onChange={(e) =>
                        handleStitchingChange(e, setFieldValue)
                      }
                    >
                      (
                      <>
                        <option value="">{t("selectStitching")}</option>
                        <option value={"SingleStitching"}>
                          {t("singleStitching")}
                        </option>
                        <option value={"DoubleStitching"}>
                          {t("doubleStitching")}
                        </option>
                      </>
                      )
                    </Field>
                  </div>
                </div>

                <div className="col-md-4 col-lg-2">
                  <div className="form-group mb-3">
                    <label>{t("stitchingPrice")}</label>
                    <Field
                      name="stitchingPrice"
                      type="number"
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>

                <div className="col-md-4 col-lg-1">
                  <div className="form-group mb-3">
                    <label>{t("quantity")}</label>
                    <Field
                      name="quantity"
                      type="number"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label>{t("details")}</label>
                    <Field
                      name="details"
                      as="textarea"
                      className="form-control"
                      readOnly
                    />
                  </div>
                </div>

                <div
                  className="col-md-5 mx-4 p-4"
                  style={{ backgroundColor: "#efefef" }}
                >
                  {items.map((item) => (
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

              <button
                type="button"
                className="btn btn-success mx-4"
                onClick={() => HandleAddItems(values,setFieldValue)}
              >
                {t("addItem")}
              </button>

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
                    <label htmlFor="AdvancePrice">Advance Price </label>
                    <Field
                      className="form-control"
                      name="AdvancePrice"
                      type="number"
                      onChange = {(e)=>handleAdvance(e,setFieldValue,totalPrice)}
                    />
                  </div>
                  <div className="col-md-6 col-lg-6">
                    <label htmlFor="RemainingPrice">Remaining Price </label>
                    <Field
                      className="form-control"
                      name="RemainingPrice"
                      type="number"
                      disabled
                    />
                  </div>
                </div>

                <div className=" col-md-12 col-lg-6">
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
                        totalItems?.map((item, i) => {
                          return (
                            <tr key={i}>
                              <td>{item.typeStitching}</td>
                              <td>{item.designCode}</td>
                              <td>{item.stitchingPrice}</td>
                              <td>{item.quantity}</td>
                              <td>{item.TotalPriceOrder}</td>
                              <td>
                                <button className="btn btn-sm btn-danger" onClick={()=> handleDeleteItem(i)}>
                                  <i class="fa-solid fa-trash"></i>
                                </button>
                              </td>
                              {/* <td>{item.stitchingPrice}</td> */}
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6}>
                            <h6 className='text-danger text-center'> No Data Found</h6>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='d-flex justify-content-center my-4'>
                <button className='btn btn-danger px-5' type='submit' >Save</button>
                </div>
            </Form>
          );
        }}
      </Formik>
 
    </div>
    </Layout>
  );
};

export default OrderForm;

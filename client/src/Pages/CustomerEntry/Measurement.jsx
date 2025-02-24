import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetStitchingMeasurementQuery } from '../../redux/Services/StitchingMeasurementApi';
import axios from 'axios'
import { useAddCustMeasurementMutation ,useGetCustMeasurementQuery} from '../../redux/Services/CustomerMeasurementApi';
import { showSuccessAlert,showErrorAlert } from '../../util/SweetalertHelper';

function Measurement() {
  const { t, i18n } = useTranslation();
  const  {id,ind} = useParams()
  const navigate = useNavigate()
const [AddCustMeasurement] = useAddCustMeasurementMutation()
const {data:CustMeasurement,refetch,} = useGetCustMeasurementQuery()
const [filterdata,setFilterdata] = useState([])
const [selectStitching,setSelectStitching] = useState(t("selectCategory"))

 const HandleSubmit = async(values,{resetForm})=>{
  const newval = {CustomerId:id, ...values}
  try {
   const response = await AddCustMeasurement(newval).unwrap()
   console.log(response);
   if(response.success){
    showSuccessAlert(response.message)
    resetForm()
   }
   if(!response.success){
    showErrorAlert(response.message)
   }

  } catch (error) {
    showErrorAlert(error)
  }
 }
 
  const { data: Measurementdata } = useGetStitchingMeasurementQuery();
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  useEffect(() => {
    // Set the direction based on the current language
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  const handleStitchingChange = (event, setFieldValue) => {
    const selectedType = event.target.value;
    const [Measurement_name, Measurement_id] = selectedType.split(" ");
    setSelectStitching(Measurement_name);
    setFieldValue("TypeStitchingName", Measurement_name); // Ensure this is set in the form state

    if (Measurement_id) {
      const filtered = Measurementdata?.FetchMeasurement?.filter(
        (item) => item._id === Measurement_id
      );
      setFilteredMeasurements(filtered || []);
      if (filtered && filtered[0]) {
        const ExitsCustomer = CustMeasurement?.FetchCustomerMeasurement?.filter(
          (custMes) => custMes.CustomerId._id === id
        );
        if (ExitsCustomer && ExitsCustomer.length > 0) {
          const exitName = ExitsCustomer.find(
            (StitName) => StitName.TypeStitchingName === Measurement_name
          );
          setFilterdata(exitName ? [exitName] : []);
        } else {
          setFilterdata([]);
        }
      }
    } else {
      setFilteredMeasurements([]);
      setFilterdata([]);
    }
  };
  

  const handlePrint = ()=>{
    navigate(`/customerentry/printmeasurement`,{
      state:{filterdata}
    })
  }

  const DesignSchema = Yup.object({
    TypeStitchingName: Yup.string().required(t('TypesStitching Required')),
    Date: Yup.string().required(t('Date Required')),
    Measurement: Yup.array().of(
      Yup.object({
        value: Yup.number().required(t('Measurement Required')).typeError(t('Must be a number')),
        detail: Yup.string().required(t('Detail is required')),
      })
    ),
  });

  return (
    <div className="container" dir={i18n.language === "ur" ? "rtl" : "ltr"}>
      <div className="row my-3">
        <div className="col-md-12">
          <h5 className="fw-bold text-center">
            {t("Completion of customer measurement entry")}
          </h5>
        </div>
      </div>

      <div className="row my-3">
        <Formik
          enableReinitialize={true}
          initialValues={{
            TypeStitchingName: selectStitching,
            Date: new Date().toISOString().slice(0, 10),
            Measurement: filteredMeasurements[0]
              ? filteredMeasurements[0].StitchingDetial.map((detail) => ({
                  detail: detail,
                  value: "",
                }))
              : [],
          }}
          validationSchema={DesignSchema}
          onSubmit={HandleSubmit}
        >
          {({ setFieldValue, values }) => {
            useEffect(() => {
              const getallCustomer = async () => {
                const response = await axios.get(
                  "http://localhost:2000/customer/getall"
                );

                const data = await response.data.FetchCustomer;
                const FindCustomemr = data.find((item) => item._id == id);
                const { CustomerName, PhoneNo } = FindCustomemr;
                setFieldValue("CustomerName", CustomerName);
                setFieldValue("PhoneNo", PhoneNo);
              };
              getallCustomer();
            }, [setFieldValue]);
            return (
              <Form>
                <div className="row g-3">
                  <div className="col-md-2">
                    <label htmlFor="SerialNo" className="form-label fw-bold">
                      {t("Serial No")}
                    </label>
                    <input
                      name="SerialNo"
                      type="text"
                      className="form-control"
                      id="SerialNo"
                      value={ind}
                      disabled
                    />
                  </div>
                  <div className="col-md-2">
                    <label htmlFor="Date" className="form-label fw-bold">
                      {t("Date")}
                    </label>
                    <Field
                      name="Date"
                      type="date"
                      className="form-control"
                      id="Date"
                    />
                    <ErrorMessage
                      name="Date"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="col-md-2">
                    <label
                      htmlFor="TypeStitchingName"
                      className="form-label fw-bold"
                    >
                      {t("Types of stitching")}
                    </label>
                    <Field
                      as="select"
                      name="TypeStitchingName"
                      className="form-control"
                      id="TypeStitchingName"
                      onChange={(event) =>
                        handleStitchingChange(event, setFieldValue)
                      }
                    >
                      <option value={selectStitching}>
                      {selectStitching}
                      </option>
                      {Measurementdata &&
                        Measurementdata.FetchMeasurement?.map((measurement) => (
                          <option
                            key={measurement._id}
                            value={`${measurement.TypeStitchingId.TypeStitchingName} ${measurement._id}`}
                          >
                            {measurement.TypeStitchingId.TypeStitchingName}
                          </option>
                        ))}
                    </Field>
                    <ErrorMessage
                      name="TypeStitchingName"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-8">
                        <label
                          htmlFor="CustomerName"
                          className="form-label fw-bold"
                        >
                          {t("CustomerName")}
                        </label>
                        <Field
                          name="CustomerName"
                          type="text"
                          className="form-control"
                          id="CustomerName"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-8">
                        <label htmlFor="PhoneNo" className="form-label fw-bold">
                          {t("PhoneNo")}
                        </label>
                        <Field
                          name="PhoneNo"
                          type="number"
                          className="form-control"
                          id="PhoneNo"
                          disabled
                        />
                      </div>
                    </div>
                    <div className="col-md-12 text-center my-4">
                      <button type="submit" className="btn btn-success">
                        {t("Save")}
                      </button>
                    </div>
                    <div className="col-md-12 text-center">
                      <Link to={"/customerentry"} className="btn btn-success">
                        {t("Close")}
                      </Link>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>{t("SNo")}</th>
                          <th>{t("Measurement Detail")}</th>
                          <th>{t("Measurement")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {values.Measurement.length > 0 &&
                          values.Measurement.map((measurement, i) => (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{measurement.detail}</td>
                              <td>
                                <Field
                                  name={`Measurement[${i}].value`}
                                  type="number"
                                  className="form-control"
                                  placeholder={t("Enter value")}
                                />
                                <ErrorMessage
                                  name={`Measurement[${i}].value`}
                                  component="div"
                                  className="text-danger"
                                />
                                <Field
                                  name={`Measurement[${i}].detail`}
                                  type="hidden"
                                  value={measurement.detail}
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>

      <h3 className="text-center">Measurements Data</h3>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type of Stitching</th>
              <th>Measurements</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filterdata?.length > 0 ? (
              filterdata?.map((measurement, index) => (
                <tr key={index}>
                  <td>{new Date(measurement.Date).toLocaleDateString()}</td>
                  <td>{measurement.TypeStitchingName}</td>
                  <td>
                    <div className="row">
                      {measurement.Measurement?.map((m, i) => (
                        <div className="col-12 col-md-3" key={i}>
                          {m.detail}: {m.value}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className='d-flex gap-2'>
                    <Link
                      to={`/customerentry/measurement/update/${measurement._id}/${id}`} // Edit route with ID
                      className="btn btn-success"
                    >
                      <i className="fa-solid fa-pen"></i>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handlePrint}
                    >
                      <i className="fa-solid fa-print"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Measurement;

import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetStitchingMeasurementQuery } from '../../redux/Services/StitchingMeasurementApi';
import { useUpdateCustMeasurementMutation, useGetCustMeasurementQuery } from '../../redux/Services/CustomerMeasurementApi';
import { showSuccessAlert, showErrorAlert } from '../../util/SweetalertHelper';
import axios from 'axios'

function UpdateMeasurement() {
 const navigate =  useNavigate()
  const { t, i18n } = useTranslation();
  const { id,custId } = useParams();
  const [UpdateCustMeasurement] = useUpdateCustMeasurementMutation();
  const { data: CustMeasurement, refetch } = useGetCustMeasurementQuery();
  const { data: Measurementdata } = useGetStitchingMeasurementQuery();
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [selectStitching, setSelectStitching] = useState(t("selectCategory"));
  const [disableFields, setDisableFields] = useState(true);

  // Update direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // Handle stitching type change and filter measurements
  const handleStitchingChange = (event, setFieldValue) => {
    const selectedType = event.target.value;
    const [Measurement_name, Measurement_id] = selectedType.split(" ");
    setSelectStitching(Measurement_name);

    if (!Measurement_id) {
      setFilteredMeasurements([]);
      setFieldValue("TypeStitchingName", "");
    } else {
      setFieldValue("TypeStitchingName", Measurement_name);
      const filtered = Measurementdata?.FetchMeasurement?.filter(item => item._id === Measurement_id);
      setFilteredMeasurements(filtered || []);
    }
  };

  // Define validation schema using Yup
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

  // Handle form submission
  const HandleSubmit = async (values, { resetForm }) => {
    const newval = { CustomerId:custId,...values };
    try {
     const res =  await UpdateCustMeasurement({id,newval}).unwrap()
     if(res.success){
      showSuccessAlert('Updated!')
      resetForm()
      navigate(`/customerentry`)

     }
     if(!res.success){
      showErrorAlert(res.message)
     
     }
    } catch (error) {
      showErrorAlert(error)
    }
  };

  // Set initial form values from fetched customer measurement data
  const initialValues = {
    TypeStitchingName: selectStitching || "",
    Date:  "",
    Measurement: filteredMeasurements[0]
      ? filteredMeasurements[0].StitchingDetial.map(detail => ({
          detail: detail,
          value: CustMeasurement?.FetchCustomerMeasurement.Measurement?.find(m => m.detail === detail)?.value || ""
        }))
      : [],
  };

  return (
    <div className="container" dir={i18n.language === "ur" ? "rtl" : "ltr"}>
      <div className="row my-3">
        <div className="col-md-12">
          <h5 className="fw-bold text-center">{t("Completion of customer measurement entry")}</h5>
        </div>
      </div>

      <div className="row my-3">
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={DesignSchema}
          onSubmit={HandleSubmit}
        >
          {({ setFieldValue, values }) => {

            useEffect(()=>{
              const fetchCustMeasurement = async()=>{
                try {
                  const response = await axios.get('http://localhost:2000/customer/measurement/getall')
                  const data =  await response.data
                  if(data.success){
                   const {Date,Measurement,TypeStitchingName} = data?.FetchCustomerMeasurement?.find((item)=> item._id == id)
                  //  setDisableFields(false); 
                  setFieldValue('TypeStitchingName', TypeStitchingName);
                  setFieldValue('Measurement', Measurement);
                  setFieldValue('Date', Date);

                  }
                } catch (error) {
                  console.log(error);
                }
              }
              fetchCustMeasurement()
            },[id,Measurementdata])
            return(
              <Form>
                <div className="row g-3">
                  <div className="col-md-2">
                    <label htmlFor="Date" className="form-label fw-bold">{t("Date")}</label>
                    <Field name="Date" type="date" className="form-control" id="Date"  disabled={disableFields}/>
                    <ErrorMessage name="Date" component="div" className="text-danger" />
                  </div>
  
                  <div className="col-md-2">
                    <label htmlFor="TypeStitchingName" className="form-label fw-bold">{t("Types of stitching")}</label>
                    <Field
                      as="select"
                      name="TypeStitchingName"
                      className="form-control"
                      id="TypeStitchingName"
                      disabled={disableFields}
                      onChange={(event) => handleStitchingChange(event, setFieldValue)}
                    >
                      <option value={selectStitching ? selectStitching : ""}>{selectStitching}</option>
                      {Measurementdata && Measurementdata.FetchMeasurement?.map(measurement => (
                        <option key={measurement._id} value={`${measurement.TypeStitchingId.TypeStitchingName} ${measurement._id}`}>
                          {measurement.TypeStitchingId.TypeStitchingName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="TypeStitchingName" component="div" className="text-danger" />
                  </div>
                </div>
  
                <div className="row">
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
                                <ErrorMessage name={`Measurement[${i}].value`} component="div" className="text-danger" />
                                <Field name={`Measurement[${i}].detail`} type="hidden" value={measurement.detail} />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
  
                  <div className="col-md-12 text-center my-4">
                    <button type="submit" className="btn btn-success">{t("Save")}</button>
                    <Link to={"/customerentry"} className="btn btn-success">{t("Close")}</Link>
                  </div>
                </div>
              </Form>
            )
          }}
        </Formik>
      </div>
    </div>
  );
}

export default UpdateMeasurement;

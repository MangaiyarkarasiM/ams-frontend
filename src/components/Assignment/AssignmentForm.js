import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const AssignmentForm = (props) => {

  const initVal = {
    userName: props.user.userName ? props.user.userName : "",
    location: props.user.location ? props.user.location.join(':'): "",
    asset: props.user.asset ? props.user.asset.join(':') : "",
  }
  
  const assignmentFormValidation = Yup.object().shape({
    userName: Yup.string().required("User Name"),
    location: Yup.string().required("Please select location"),
    asset: Yup.string().required("Please select asset"),
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initVal,
      validationSchema: assignmentFormValidation,
      enableReinitialize: true,
      onSubmit: (values) => {
        props.onUpdateAssetLocation(values);
      },
    });

  return (
    <>
      <form onSubmit={handleSubmit} className="ml-2">
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">User Name</label>
            <input
              name="userName"
              type="text"
              value={values?.userName}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
              disabled={true}
            />
          </div>
          {errors.userName && touched.userName && (
            <small className="text-danger">{errors.userName}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Asset</label>
            <select
              name="asset"
              value={values?.asset}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={props.user.asset[1]?'true':null}
              className="form-control w-75 mr-4"
            >
              <option value="" label="Select an asset for user">
                Select an asset for user{" "}
              </option>
              {props.assets?.map((ast) => {
                let asset= `${ast._id}:${ast.serialNumber}`
                return (
                  <option key={ast._id} value={asset} label={ast.serialNumber}>
                    {ast.serialNumber}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.asset && touched.asset && (
            <small className="text-danger">{errors.asset}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Location</label>
            <select
              name="location"
              value={values?.location}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            >
              <option value="" label="Select a location for user">
                Select a location for user{" "}
              </option>
              {props.locations?.map((loc) => {
                let lo = `${loc.addressLine1}, ${loc.city}, ${loc.state}, ${loc.pincode}`;
                let l = `${loc._id}:${lo}`
                return (
                  <option key={loc._id} value={l} label={lo}>
                    {lo}{" "}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.location && touched.location && (
            <small className="text-danger">{errors.location}</small>
          )}
        </div>
        {props.message && <div className="mb-4"><small className="text-danger">{props.message}</small></div>}
        <div className="d-flex justify-content-start align-items-center mb-3">
          <button
            type="button"
            className="btn btn-secondary px-3 mr-4"
            onClick={() => {
              props.onClose();
            }}
          >
            Back
          </button>
          <button type="submit" className="btn btn-warning px-3 ">
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default AssignmentForm;

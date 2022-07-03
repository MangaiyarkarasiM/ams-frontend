import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const locationFormValidation = Yup.object().shape({
    addressLine1: Yup.string().required("Enter address"),
    addressLine2: Yup.string(),
    city: Yup.string().required("Enter city"),
    state: Yup.string().required("Enter state"),
    pincode: Yup.string().required("Enter pincode").max(6).min(6),
    country: Yup.string().required("Enter country"),
  });

const LocationForm = (props) => {

    const initVal = props.location
    ? {
        addressLine1: props.location.addressLine1?props.location.addressLine1:'',
        addressLine2: props.location.addressLine2?props.location.addressLine2:'',
        city: props.location.city?props.location.city:'',
        state: props.location.state?props.location.state:'',
        pincode: props.location.pincode?props.location.pincode:'',
        country: props.location.country?props.location.country:'',
      }
    : {};
    //const isDisabled = props.location ? "true" : null;
    
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initVal,
      validationSchema: locationFormValidation,
      enableReinitialize: true,
      onSubmit: (values) => {
        if (props.location) {
          props.onEditLocation(values);
        } else {
          props.onAddLocation(values);
        }
      },
    });
    
    return (
        <>
      <form onSubmit={handleSubmit} className="ml-2">
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Address Line 1</label>
            <input
              name="addressLine1"
              type="text"
              value={values?.addressLine1}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.addressLine1 && touched.addressLine1 && (
            <small className="text-danger">{errors.addressLine1}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Address Line 2</label>
            <input
              name="addressLine2"
              type="text"
              value={values?.addressLine2}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.addressLine2 && touched.addressLine2 && (
            <small className="text-danger">{errors.addressLine2}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">City</label>
            <input
              name="city"
              type="text"
              value={values?.city}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.city && touched.city && (
            <small className="text-danger">{errors.city}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">State</label>
            <input
              name="state"
              type="text"
              value={values?.state}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.state && touched.state && (
            <small className="text-danger">{errors.state}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Pincode</label>
            <input
              name="pincode"
              type="text"
              value={values?.pincode}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.pincode && touched.pincode && (
            <small className="text-danger">{errors.pincode}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Country</label>
            <input
              name="country"
              type="text"
              value={values?.country}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.country && touched.country && (
            <small className="text-danger">{errors.country}</small>
          )}
        </div>
        {props.message && <small className="text-danger mb-4">{props.message}</small>}
        {props.location ? (
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
        ) : (
          <>
            <div className="border-top mb-2"></div>
            <div className="d-flex justify-content-start align-items-center">
              <button
                type="button"
                className="btn btn-secondary px-3 mr-4"
                onClick={() => {
                  props.setShowModal(false);
                }}
              >
                Close
              </button>
              <button type="submit" className="btn btn-warning px-3">
                Save
              </button>
            </div>
          </>
        )}
      </form>
    </>
    );
};

export default LocationForm;
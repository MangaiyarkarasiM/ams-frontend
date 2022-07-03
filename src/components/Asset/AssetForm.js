import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const assetFormValidation = Yup.object().shape({
  serialNumber: Yup.string().required("Enter asset serial number"),
  assetName: Yup.string().required("Enter asset name"),
  assetDesc: Yup.string().required("Enter asset desc").min(5),
  assetType: Yup.string().required("Select asset type"),
  brand: Yup.string().required("Enter asset brand"),
  location: Yup.string(),
});

const AssetForm = (props) => {
  const initVal = props.asset
    ? {
        serialNumber: props.asset.serialNumber ? props.asset.serialNumber : "",
        assetName: props.asset.assetName ? props.asset.assetName : "",
        assetDesc: props.asset.assetDesc ? props.asset.assetDesc : "",
        assetType: props.asset.assetType ? props.asset.assetType : "",
        location: props.asset.location ? props.asset.location : "",
        brand: props.asset.brand ? props.asset.brand : "",
      }
    : {};

  const isDisabled = props.asset ? "true" : null;

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initVal,
      validationSchema: assetFormValidation,
      enableReinitialize: true,
      onSubmit: (values) => {
        if (props.asset) {
          props.onEditAsset(values, props.asset);
        } else {
          props.onAddAsset(values);
        }
      },
    });

  return (
    <>
      <form onSubmit={handleSubmit} className="ml-2">
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Serial Number</label>
            <input
              name="serialNumber"
              type="text"
              value={values?.serialNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
              disabled={isDisabled}
            />
          </div>
          {errors.serialNumber && touched.serialNumber && (
            <small className="text-danger">{errors.serialNumber}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Asset Name</label>
            <input
              name="assetName"
              type="text"
              value={values?.assetName}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.assetName && touched.assetName && (
            <small className="text-danger">{errors.assetName}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Asset Description</label>
            <input
              name="assetDesc"
              type="text"
              value={values?.assetDesc}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.assetDesc && touched.assetDesc && (
            <small className="text-danger">{errors.assetDesc}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Asset Type</label>
            <select
              name="assetType"
              value={values?.assetType}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            >
              <option value="" label="Select an asset type">
                Select an asset type{" "}
              </option>
              <option value="Electronic item" label="Electronic item">
                Electronic item{" "}
              </option>
              <option value="Furniture" label="Furniture">
                Furniture{" "}
              </option>
              <option value="Other" label="Other">
                Other{" "}
              </option>
            </select>
          </div>
          {errors.assetType && touched.assetType && (
            <small className="text-danger">{errors.assetType}</small>
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
              <option value="" label="Select a location for the asset">
                Select a location for the asset{" "}
              </option>
              {props.locations?.map((loc) => {
                let lo = `${loc.addressLine1}, ${loc.city}, ${loc.state}, ${loc.pincode}`;
                return (
                  <option key={loc._id} value={loc._id} label={lo}>
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
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Brand</label>
            <input
              name="brand"
              type="text"
              value={values?.brand}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.brand && touched.brand && (
            <small className="text-danger">{errors.brand}</small>
          )}
        </div>
        {props.message && (
          <div className="mb-4">
            <small className="text-danger">{props.message}</small>
          </div>
        )}
        {props.asset ? (
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

export default AssetForm;

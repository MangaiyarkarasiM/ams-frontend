import React, { useState, useEffect, useContext } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import fetchApi from "../../utils/fetchApi";
import { GlobalContext } from "../../context/globalContext";

const maintenanceFormValidation = Yup.object().shape({
  assetSerialNumber: Yup.string().required("Select asset serial number"),
  comment: Yup.string(),
});

const MaintenanceForm = (props) => {
  const { onAuthFail } = useContext(GlobalContext);
  const [assets, setAssets] = useState([]);

  async function getAllAssets() {
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`/assets/getAllAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      let assets = res.data.assets.filter((a) => {
        return a.status === "Available";
      });
      setAssets(assets);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAllAssets();
  }, []);

  const initVal = props.maintenance
    ? {
        assetSerialNumber: props.maintenance.assetSerialNumber
          ? props.maintenance.assetSerialNumber
          : "",
        comment: props.maintenance.comment ? props.maintenance.comment : "",
      }
    : {};

  const isDisabled = props.maintenance ? "true" : null;

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initVal,
      validationSchema: maintenanceFormValidation,
      enableReinitialize: true,
      onSubmit: (values) => {
        props.onAddMaintenance(values);
      },
    });

  return (
    <>
      <form onSubmit={handleSubmit} className="ml-2">
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Asset Serial Number</label>
            <select
              name="assetSerialNumber"
              value={values?.serialNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
              disabled={isDisabled}
            >
              <option value="" label="Select an asset">
                Select an asset{" "}
              </option>
              {assets?.map((asset) => {
                return (
                  <option key={asset._id} value={asset.serialNumber} label={asset.serialNumber}>
                    {" "}
                    {asset.serialNumber}
                  </option>
                );
              })}
            </select>
          </div>
          {errors.assetSerialNumber && touched.assetSerialNumber && (
            <small className="text-danger">{errors.assetSerialNumber}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Comment</label>
            <input
              name="comment"
              type="text"
              value={values?.comment}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.comment && touched.comment && (
            <small className="text-danger">{errors.comment}</small>
          )}
        </div>
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
      </form>
    </>
  );
};

export default MaintenanceForm;

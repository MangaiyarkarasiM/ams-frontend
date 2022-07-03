import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const profileFormValidation = Yup.object().shape({
  userName: Yup.string().required("Enter user name"),
  firstName: Yup.string().required("Enter first name"),
  lastName: Yup.string(),
  email: Yup.string().email("Enter valid email").required("Enter email"),
  mobile: Yup.string(),
  organizationName: Yup.string().required("Enter organization name"),
});

const ProfileForm = (props) => {
  const initVal = {
    userName: props.user.userName ? props.user.userName : "",
    firstName: props.user.firstName ? props.user.firstName : "",
    lastName: props.user.lastName ? props.user.lastName : "",
    email: props.user.email ? props.user.email : "",
    mobile: props.user.mobile ? props.user.mobile : "",
    organizationName: props.user.organizationName
      ? props.user.organizationName
      : "",
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      initialValues: initVal,
      validationSchema: profileFormValidation,
      enableReinitialize: true,
      onSubmit: (values) => {
        props.onEditProfile(values);
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
              disabled={true}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.userName && touched.userName && (
            <small className="text-danger">{errors.userName}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">First Name</label>
            <input
              name="firstName"
              type="text"
              value={values?.firstName}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.firstName && touched.firstName && (
            <small className="text-danger">{errors.firstName}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Last Name</label>
            <input
              name="lastName"
              type="text"
              value={values?.lastName}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.lastName && touched.lastName && (
            <small className="text-danger">{errors.lastName}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Email</label>
            <input
              name="email"
              type="email"
              value={values?.email}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.email && touched.email && (
            <small className="text-danger">{errors.email}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Mobile</label>
            <input
              name="mobile"
              type="text"
              value={values?.mobile}
              onBlur={handleBlur}
              onChange={handleChange}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.mobile && touched.mobile && (
            <small className="text-danger">{errors.mobile}</small>
          )}
        </div>
        <div className="mb-4">
          <div className="forminput d-flex">
            <label className="w-25">Organization Name</label>
            <input
              name="organizationName"
              type="text"
              value={values?.organizationName}
              onBlur={handleBlur}
              onChange={handleChange}
              disabled={true}
              className="form-control w-75 mr-4"
            />
          </div>
          {errors.organizationName && touched.organizationName && (
            <small className="text-danger">{errors.organizationName}</small>
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
            Update
          </button>
        </div>
      </form>
    </>
  );
};

export default ProfileForm;

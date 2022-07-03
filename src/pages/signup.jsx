import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import fetchApi from "../utils/fetchApi";

const signupFormValidation = Yup.object().shape({
  userName: Yup.string().required("Enter user name"),
  firstName: Yup.string().required("Enter first name"),
  lastName: Yup.string(),
  email: Yup.string().email("Enter valid email").required("Enter email"),
  password: Yup.string().required("Enter password").min(8),
  mobile: Yup.string(),
  organizationName: Yup.string().required("Enter organization name")
});

function SignupPage(props) {
  let [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSignup = async (value) => {
    let res = await fetchApi.post("/users/register", value);
    console.log(res);
    if (res.data.statusCode === 200) {
      navigate("/login");
    } else {
      setMessage(res.data.message);
    }
  };

  return (
    <div className="my-5 d-flex flex-column">
      <h3 className="text-dark text-center"><span className="text-warning">assetRef</span> - Create new user</h3>
      <div
        className="mt-3 logincard shadow"
        style={{ width: "50vw", margin: "auto", padding: "0 0 14px 0" }}
      >
        <Formik
          initialValues={{firstName:'',lastName:'', email:'', mobile:'', password:''}}
          onSubmit={onSignup}
          validateOnBlur= {true}
          validationSchema={signupFormValidation}
        >
          {() => {
            return (
              <Form className="d-flex flex-column px-5 justify-content-center">
                <div className="mb-4 mt-3">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">User Name</label>
                  <Field
                    name="userName"
                    type="text"
                    className="d-block rounded formcontrol"
                    placeholder="Enter user name"
                  />
                  </div>
                  <ErrorMessage
                    name="userName"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">First Name</label>
                  <Field
                    name="firstName"
                    type="text"
                    className="d-block rounded formcontrol"
                    placeholder="Enter your first name"
                  />
                  </div>
                  <ErrorMessage
                    name="firstName"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">Last Name</label>
                  <Field
                    name="lastName"
                    type="text"
                    className="d-block rounded formcontrol"
                    placeholder="Enter your last name"
                  />
                  </div>
                  <ErrorMessage
                    name="lastName"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">Email</label>
                  <Field
                    name="email"
                    type="email"
                    className="d-block rounded formcontrol"
                    placeholder="Enter your email"
                  />
                  </div>
                  <ErrorMessage
                    name="email"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="d-block rounded formcontrol"
                    placeholder="Password"
                  />
                  </div>
                  <ErrorMessage
                    name="password"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">Mobile</label>
                  <Field
                    name="mobile"
                    type="text"
                    className="d-block rounded formcontrol"
                    placeholder="Enter your mobile"
                  />
                  </div>
                  <ErrorMessage
                    name="mobile"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex">
                  <label className="d-block font-weight-bold text-secondary w-25">Organization Name</label>
                  <Field
                    name="organizationName"
                    type="text"
                    className="d-block rounded formcontrol"
                    placeholder="Enter your organization name"
                  />
                  </div>
                  <ErrorMessage
                    name="organizationName"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-secondary text-warning d-block rounded mb-3"
                >
                  Sign up
                </button>
              </Form>
            );
          }}
        </Formik>
        {message ? (
          <>
            <div className="d-block text-center text-success mb-4">
              {message}
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="text-center">
          <p>
            Already have an account?{" "}
            <Link className="font-italic" to="/login">
              Login
            </Link>{" "}
            here
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

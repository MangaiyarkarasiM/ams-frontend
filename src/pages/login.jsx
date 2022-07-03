import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { GlobalContext } from "../context/globalContext";

const loginFormValidation = Yup.object().shape({
  userName: Yup.string().required("Enter user name"),
  password: Yup.string().required("Enter password"),
});

function LoginPage(props) {
  const {onLogin,message} = useContext(GlobalContext);

  return (
    <div className="my-5 d-flex flex-column">
      <h3 className="text-dark text-center"><span className="text-warning">assetRef</span> - Login page</h3>
      <div
        className="mt-4 logincard shadow"
        style={{ width: "40vw", margin: "auto", padding: "0 0 14px 0" }}
      >
        <Formik
          initialValues={{userName:'',password:''}}
          onSubmit={onLogin}
          validateOnBlur= {true}
          validationSchema={loginFormValidation}
          className="d-inline-block mt-2"
        >
          {() => {
            return (
              <Form className="d-flex flex-column px-5 justify-content-center border-info rounded">
                <div className="mb-4">
                  <label className="d-block mt-3 font-weight-bold text-secondary">User Name</label>
                  <Field
                    name="userName"
                    type="text"
                    className="d-block rounded form-control"
                    placeholder="Enter user name"
                  />
                  <ErrorMessage
                    name="userName"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>
                <div className="mb-4">
                  <label className="d-block font-weight-bold text-secondary">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="d-block rounded form-control"
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    render={(msg) => (
                      <small className="d-block text-danger">{msg}</small>
                    )}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-secondary text-warning rounded mb-4"
                >
                  Log in
                </button>
              </Form>
            );
          }}
        </Formik>
        {message ? (
          <>
            <div className="d-block text-center text-danger mb-4">
              {message}
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="text-center">
          <p>
            New user?{" "}
            <Link className="font-italic" to="/signup">
              Sign up
            </Link>{" "}
            here
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

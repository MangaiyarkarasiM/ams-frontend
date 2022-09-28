import React, { useEffect, useState, useContext } from "react";
import fetchApi from "../utils/fetchApi";
import { useParams, useNavigate } from "react-router-dom";
import LocationForm from "../components/Location/LocationForm";
import { GlobalContext } from "../context/globalContext";

const LocationEditPage = () => {
  const { userName, onAuthFail } = useContext(GlobalContext);
  let { id } = useParams();
  let [location, setLocation] = useState({});
  const navigate = useNavigate();

  async function getLocationWithID(id) {
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`sites/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      setLocation(res.data.site);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getLocationWithID(id);
  }, [id]);

  const onEditLocation = async (values) => {
    let loc = { ...values, changedBy: userName };
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.put(`sites/${location._id}`, loc, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      alert(res.data.message);
      navigate("/locations");
    } else {
      console.log(res.data);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <p className="">
            Update the details of location with address{" "}
            <span className="font-weight-bold font-italic">
              {location.addressLine1}
            </span>
          </p>
          <LocationForm
            location={location}
            onEditLocation={onEditLocation}
            onClose={() => {
              navigate(-1);
            }}
            className="my-2"
          ></LocationForm>
        </div>
      </div>
    </div>
  );
};

export default LocationEditPage;

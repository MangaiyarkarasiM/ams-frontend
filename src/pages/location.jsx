import React, { useState, useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import Modal from "../components/Modal/Modal";
import fetchApi from "../utils/fetchApi";
import LocationForm from "../components/Location/LocationForm";
import { GlobalContext } from "../context/globalContext";

const LocationPage = () => {
  const { userName, locations, getAllLocations, showModal, setShowModal, onAddLocation, onDeleteLocation } = useContext(GlobalContext);
  const [message, setMessage] = useState("");
  let n = 1;

  useEffect(() => {
    getAllLocations();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <button
              className="btn btn-success"
              onClick={() => {
                setShowModal(true);
              }}
            >
              Add location
            </button>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive border m-2">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Address Line 1</th>
                  <th scope="col">Address Line 2</th>
                  <th scope="col">City</th>
                  <th scope="col">State</th>
                  <th scope="col">Pincode</th>
                  <th scope="col">Country</th>
                  <th scope="col">Changed by</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {locations?.map((location) => {
                  let style = n % 2 === 1 ? "table-secondary" : null;
                  return (
                    <tr className={style} key={location._id}>
                      <td>{n++}</td>
                      <td>
                        <NavLink
                          className="tablelink text-dark"
                          to={`/locations/${location._id}`}
                        >
                          {location.addressLine1}
                        </NavLink>
                      </td>
                      <td>{location.addressLine2}</td>
                      <td>{location.city}</td>
                      <td>{location.state}</td>
                      <td>{location.pincode}</td>
                      <td>{location.country}</td>
                      <td>{location.changedBy}</td>
                      <td>
                        <button
                          className="btn btn-danger p-0 px-2"
                          onClick={() => {
                            onDeleteLocation(
                              location._id,
                              location.addressLine1
                            );
                          }}
                        >
                          &times;
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal
        open={showModal}
        title="Add Location"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <LocationForm
          message={message}
          setShowModal={setShowModal}
          onAddLocation={onAddLocation}
        ></LocationForm>
      </Modal>
    </>
  );
};

export default LocationPage;

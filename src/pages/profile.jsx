import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import fetchApi from "../utils/fetchApi";
import ProfileForm from "../components/Profile/ProfileForm";
import Modal from "../components/Modal/Modal";

const ProfilePage = () => {
  let { id } = useParams();
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  async function getUserById() {
    let res = await fetchApi.get(`/users/${id}`);
    //console.log(res.data);
    if (res.data.statusCode === 200) {
      setUser(res.data.user);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getUserById();
  }, [id]);

  const onEditProfile = async (value) => {
    //console.log(value);
    let res = await fetchApi.put(`/users/${user._id}`, value);
    if (res.data.statusCode === 200) {
      setMessage("");
      setShowModal(false);
      getUserById();
    } else {
      setMessage(res.data.message);
      console.log(res.data);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div className="d-flex justify-content-between align-items-center">
              <p>Hello {id}</p>
              <button
                className="btn btn-warning"
                onClick={() => {
                  setShowModal(true);
                }}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
        <div className="row my-5">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="card shadow profile-card px-5 pt-4 pb-3">
              <div className="mb-3">
                <div className="d-flex flex-direction-column justify-content-between">
                  <h5>Personal details</h5>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">User Name </div>
                <div className="ml-5">{user.userName?.toUpperCase()}</div>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">First Name </div>
                <div className="ml-5">{user.firstName}</div>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">Last Name </div>
                <div className="ml-5">{user.lastName}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row my-5">
          <div className="col-sm-12 col-md-12 col-lg-12">
            <div className="card shadow profile-card px-5 pt-4 pb-3">
              <div className="mb-3">
                <h5>Account details</h5>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">Email </div>
                <div className="ml-5">{user.email}</div>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">Mobile</div>
                <div className="ml-5">{user.mobile}</div>
              </div>
              <div className="d-flex mb-3">
                <div className="w-25">Organization Name</div>
                <div className="ml-5">{user.organizationName}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={showModal}
        title="Edit Profile"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <ProfileForm
          user={user}
          setShowModal={setShowModal}
          onEditProfile={onEditProfile}
        ></ProfileForm>
      </Modal>
    </>
  );
};

export default ProfilePage;

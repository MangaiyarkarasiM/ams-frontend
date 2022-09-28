import React, { useState, useEffect, useContext } from "react";
import AssignmentForm from "../components/Assignment/AssignmentForm";
import Modal from "../components/Modal/Modal";
import fetchApi from "../utils/fetchApi";
import { GlobalContext } from "../context/globalContext";

const AssignmentPage = () => {
  const { userName, getAllLocations, locations, onAuthFail } =
    useContext(GlobalContext);
  const [message, setMessage] = useState("");
  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [showModal, setShowModal] = useState(false);
  let n = 1;

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
        return a.status === "Available" && a.assetType === "Electronic item";
      });
      setAssets(assets);
    } else {
      console.log(res.data);
    }
  }

  async function getAllUsers() {
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`/users/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      setUsers(res.data.users);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAllUsers();
    getAllAssets();
    getAllLocations();
  }, []);

  const onUpdateAssetLocation = async (value) => {
    //console.log(value);
    let ast = value.asset.split(":");
    let [asset] = assets?.filter((a) => {
      return a._id === ast[0] && a.status === "Available";
    });
    let loc = value.location.split(":");
    if (asset.location === loc[0]) {
      setMessage("");
      let updatedUser = { ...user, location: loc, asset: ast };
      let token = sessionStorage.getItem("token");
      let resUser = await fetchApi.put(`/users/${user._id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (resUser.data.statusCode === 401) {
        onAuthFail();
      } else if (resUser.data.statusCode === 200) {
        asset.status = "Assigned";
        asset.assignedUser = value.userName;
        let resAsset = await fetchApi.put(`/assets/${asset._id}`, asset, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (resAsset.data.statusCode === 401) {
          onAuthFail();
        } else if (resAsset.data.statusCode === 200) {
          setShowModal(false);
          getAllUsers();
          setUser({});
          alert("Asset and location update successful.");
        } else {
          let r = await fetchApi.put(`/users/${user._id}`, user, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log(resUser.data.error);
          alert("Update has been failed. Please try again later");
        }
      } else {
        console.log(resUser.data.error);
        alert("Update has been failed. Please try again later");
      }
    } else {
      setMessage(
        `Please select the asset whose location is same as the user location. Please verify the asset location in Assets page`
      );
    }
  };

  const onUpdate = (user) => {
    setUser(user);
    setShowModal(true);
  };

  const onUnassign = async (user) => {
    let u = { ...user };
    let assetId = user.asset[0];
    user.asset = [];
    //console.log(u,assetId)
    let token = sessionStorage.getItem("token");
    let resUser = await fetchApi.put(`/users/${user._id}`, user, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (resUser.data.statusCode === 401) {
      onAuthFail();
    } else if (resUser.data.statusCode === 200) {
      let res = await fetchApi.get(`/assets/id/${assetId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.data.statusCode === 401) {
        onAuthFail();
      } else if (res.data.statusCode === 200) {
        let asset = res.data.asset;
        asset.status = "Available";
        asset.assignedUser = "";
        let resAsset = await fetchApi.put(`/assets/${asset._id}`, asset, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (resAsset.data.statusCode === 401) {
          onAuthFail();
        } else if (resAsset.data.statusCode === 200) {
          getAllUsers();
          getAllAssets();
          getAllLocations();
          alert("Asset has been unassigned from the user");
        } else {
          let resUser = await fetchApi.put(`/users/${user._id}`, u, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          console.log(resAsset.data);
          alert("Update failed. Please try again later");
        }
      } else {
        let resUser = await fetchApi.put(`/users/${user._id}`, u, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log(res.data);
        alert("Update failed. Please try again later");
      }
    } else {
      console.log(resUser.data);
      alert("Update failed. Please try again later");
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-12">Assign the asset for the user</div>
        </div>
        <div className="row">
          <div className="table-responsive border m-2">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">User Name</th>
                  <th scope="col">First name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Location</th>
                  <th scope="col">Asset</th>
                  <th scope="col">Asset/Location update</th>
                  <th scope="col">Unassign Asset</th>
                </tr>
              </thead>
              <tbody>
                {users
                  ?.filter((u) => {
                    return u.userName !== userName;
                  })
                  .map((user) => {
                    let style = n % 2 === 1 ? "table-secondary" : null;
                    return (
                      <tr className={style} key={user._id}>
                        <td>{n++}</td>
                        <td>{user.userName}</td>
                        <td>{user.firstName}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td>{user.location[1]}</td>
                        <td>{user.asset[1]}</td>
                        <td>
                          <button
                            className="btn btn-warning p-0 px-2"
                            onClick={() => {
                              onUpdate(user);
                            }}
                          >
                            Update
                          </button>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger p-0 px-2"
                            onClick={() => {
                              onUnassign(user);
                            }}
                            disabled={user.asset?.length === 0 ? true : ''}
                          >
                            Unassign
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
        title="Update asset/location for user"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <AssignmentForm
          message={message}
          user={user}
          assets={assets}
          locations={locations}
          onUpdateAssetLocation={onUpdateAssetLocation}
          onClose={() => {
            setShowModal(false);
          }}
        ></AssignmentForm>
      </Modal>
    </>
  );
};

export default AssignmentPage;

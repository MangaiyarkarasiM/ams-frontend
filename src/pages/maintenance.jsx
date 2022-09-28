import React, { useState, useEffect, useContext } from "react";
import MaintenanceForm from "../components/Maintenance/MaintenanceForm";
import Modal from "../components/Modal/Modal";
import fetchApi from "../utils/fetchApi";
import { GlobalContext } from "../context/globalContext";

const MaintenancePage = () => {
  const { userName, onAuthFail } = useContext(GlobalContext);
  const [maintenances, setMaintenances] = useState([]);
  const [showModal, setShowModal] = useState(false);
  let n = 1;

  async function getAllMaintenances() {
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`/maintenances/getAllMaintenanceDetails`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      let main = res.data.maintenances;
      setMaintenances(main);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAllMaintenances();
  }, []);

  const onAddMaintenance = async (value) => {
    let main = { ...value, status: "In progress", changedBy: userName };
    let token = sessionStorage.getItem("token");
    let resMain = await fetchApi.post(`/maintenances/create`, main, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (resMain.data.statusCode === 401) {
      onAuthFail();
    } else if (resMain.data.statusCode === 200) {
      setShowModal(false);
      //after adding the maintenance for an asset, need to update the asset status to Under Maintenance
      let resAsset = await fetchApi.get(`/assets/${value.assetSerialNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (resAsset.data.statusCode === 401) {
        onAuthFail();
      } else if (resAsset.data.statusCode === 200) {
        let asset = resAsset.data.asset;
        if (asset) {
          asset.status = "Under Maintenance";
          let resAssetUpdate = await fetchApi.put(
            `/assets/${asset._id}`,
            asset,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (resAssetUpdate.data.statusCode === 401) {
            onAuthFail();
          } else if (resAssetUpdate.data.statusCode === 200) {
            alert("Maintenance successfully added");
          } else {
            let res = await fetchApi.delete(
              `/maintenances/${resMain.data.details._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            alert(
              "Failed to add maintenance. Please try again after some time"
            );
            console.log(resAssetUpdate.data);
          }
        }
        getAllMaintenances();
      } else {
        let res = await fetchApi.delete(
          `/maintenances/${resMain.data.details._id}`
        );
        alert("Failed to add maintenance. Please try again after some time");
        console.log(resAsset.data);
      }
    } else {
      console.log(resMain.data);
    }
  };

  const onCompleteMaintenance = async (id, assetSerialNumber) => {
    let conf = window.confirm(
      `Are you sure to complete the maintenance for ${assetSerialNumber}`
    );
    if (conf) {
      let [main] = maintenances.filter((ma) => {
        return ma._id === id;
      });
      main.endTimeStamp = String(Date.now());
      main.status = "Complete";
      //console.log(main);
      let token = sessionStorage.getItem("token");
      let resMain = await fetchApi.put(`/maintenances/${id}`, main, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (resMain.data.statusCode === 401) {
        onAuthFail();
      } else if (resMain.data.statusCode === 200) {
        let resAsset = await fetchApi.get(`/assets/${assetSerialNumber}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (resAsset.data.statusCode === 401) {
          onAuthFail();
        } else if (resAsset.data.statusCode === 200) {
          let asset = resAsset.data.asset;
          if (asset) {
            asset.status = "Available";
            let resAssetUpdate = await fetchApi.put(
              `/assets/${asset._id}`,
              asset,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (resAssetUpdate.data.statusCode === 401) {
              onAuthFail();
            } else if (resAssetUpdate.data.statusCode === 200) {
              alert("Maintenance successfully updated");
            } else {
              main.endTimeStamp = "";
              main.status = "In Progress";
              let resMain = await fetchApi.put(`/maintenances/${id}`, main, {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              });
              alert(
                "Failed to update the maintenance. Please try again after some time"
              );
              console.log(resAssetUpdate.data);
            }
          }
          getAllMaintenances();
        } else {
          main.endTimeStamp = "";
          main.status = "In progress";
          let resMain = await fetchApi.put(`/maintenances/${id}`, main);
          alert(
            "Failed to update the maintenance. Please try again after some time"
          );
          console.log(resAsset.data);
        }
      } else {
        console.log(resMain.data);
      }
    }
  };

  const convertDate = (value) => {
    if (value) {
      var tzoffset = new Date(value).getTimezoneOffset() * 60000; //offset in milliseconds
      var date = new Date(value - tzoffset).toISOString().slice(0, -1);
      return String(date).replace("T", " ");
    } else {
      return null;
    }
  };

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
              Add maintenance
            </button>
          </div>
        </div>
        <div className="row">
          <div className="table-responsive border m-2">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Serial Number</th>
                  <th scope="col">Start Date</th>
                  <th scope="col">End Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Comment</th>
                  <th scope="col">Changed by</th>
                  <th scope="col">Mark as complete</th>
                </tr>
              </thead>
              <tbody>
                {maintenances?.map((main) => {
                  let style = n % 2 === 1 ? "table-secondary" : null;
                  let disabled = main.status === "Complete" ? true : null;
                  return (
                    <tr className={style} key={main._id}>
                      <td>{n++}</td>
                      <td>{main.assetSerialNumber}</td>
                      <td>{convertDate(+main.startTimeStamp)}</td>
                      <td>{convertDate(+main.endTimeStamp)}</td>
                      <td>{main.status}</td>
                      <td>{main.comment}</td>
                      <td>{main.changedBy}</td>
                      <td>
                        <button
                          className="btn"
                          disabled={disabled}
                          onClick={() =>
                            onCompleteMaintenance(
                              main._id,
                              main.assetSerialNumber
                            )
                          }
                        >
                          ✅
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
        title="Add Maintenance"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <MaintenanceForm
          setShowModal={setShowModal}
          onAddMaintenance={onAddMaintenance}
        ></MaintenanceForm>
      </Modal>
    </>
  );
};

export default MaintenancePage;

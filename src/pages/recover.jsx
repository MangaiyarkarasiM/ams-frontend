import React, { useState, useEffect, useContext } from "react";
import fetchApi from "../utils/fetchApi";
import { GlobalContext } from "../context/globalContext";

const RecoverPage = () => {
  const { userName, onAuthFail } = useContext(GlobalContext);
  const [disposedAssets, setDisposedAssets] = useState([]);
  let n = 1;

  async function getAllAssets() {
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`/assets/getAllAssets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(res.data);
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      let disposedAssets = res.data.assets.filter((a) => {
        return a.status === "Disposed";
      });
      setDisposedAssets(disposedAssets);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAllAssets();
  }, []);

  const onRecoverAsset = async (id, serialNumber) => {
    let conf = window.confirm(
      `Are you sure to recover the asset ${serialNumber}?`
    );
    if (conf) {
      let [asset] = disposedAssets.filter((a) => {
        return a._id === id;
      });
      asset.status = "Available";
      asset.lastUpdatedBy = userName;
      let token = sessionStorage.getItem("token");
      let res = await fetchApi.put(`assets/${id}`, asset, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      //console.log(res.data);
      if (res.data.statusCode === 401) {
        onAuthFail();
      } else if (res.data.statusCode === 200) {
        alert("Asset successfully recovered");
        getAllAssets();
      } else {
        console.log(res.data);
      }
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <h5 className="ml-2">Assets disposed</h5>
          <div className="table-responsive border m-2">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Serial Number</th>
                  <th scope="col">Asset Name</th>
                  <th scope="col">Asset Description</th>
                  <th scope="col">Asset Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Location</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Changed by</th>
                  <th scope="col">Recover</th>
                </tr>
              </thead>
              <tbody>
                {disposedAssets?.map((asset) => {
                  let style = n % 2 === 1 ? "table-secondary" : null;
                  return (
                    <tr className={style} key={asset._id}>
                      <td>{n++}</td>
                      <td>{asset.serialNumber}</td>
                      <td>{asset.assetName}</td>
                      <td>{asset.assetDesc}</td>
                      <td>{asset.assetType}</td>
                      <td>{asset.status}</td>
                      <td>{asset.siteId}</td>
                      <td>{asset.brand}</td>
                      <td>{asset.lastUpdatedBy}</td>
                      <td>
                        <button
                          className="btn btn-danger p-0 px-2"
                          onClick={() => {
                            onRecoverAsset(asset._id, asset.serialNumber);
                          }}
                        >
                        📥
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
    </>
  );
};

export default RecoverPage;

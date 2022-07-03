import React, { useState, useEffect, useContext } from "react";
import fetchApi from "../utils/fetchApi";
import { GlobalContext } from "../context/globalContext";

const DisposePage = () => {
  const { userName } = useContext(GlobalContext);
  const [unDisposedAssets, setUnDisposedAssets] = useState([]);
  let n = 1;

  async function getAllAssets() {
    let res = await fetchApi.get(`/assets/getAllAssets`);
    //console.log(res.data);
    if (res.data.statusCode === 200) {
      let unDisposedAssets = res.data.assets.filter((a) => {
        return a.status !== "Disposed";
      });
      setUnDisposedAssets(unDisposedAssets);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAllAssets();
  }, []);

  const onDisposeAsset = async (id, serialNumber) => {
    let conf = window.confirm(
      `Are you sure to dispose the asset ${serialNumber}?`
    );
    if (conf) {
      let [asset] = unDisposedAssets.filter((a) => {
        return a._id === id;
      });
      asset.status = "Disposed";
      asset.lastUpdatedBy = userName;
      let res = await fetchApi.put(`assets/${id}`, asset);
      //console.log(values);
      if (res.data.statusCode === 200) {
        alert("Asset successfully disposed");
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
          <h5 className="ml-2">Assets currently available</h5>
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
                  <th scope="col">Dispose</th>
                </tr>
              </thead>
              <tbody>
                {unDisposedAssets?.map((asset) => {
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
                            onDisposeAsset(asset._id, asset.serialNumber);
                          }}
                        >
                          <i className="fa fa-trash m-0" aria-hidden="true"></i>
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

export default DisposePage;

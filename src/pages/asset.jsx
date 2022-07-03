import React, {useEffect, useContext } from "react";
import { NavLink } from "react-router-dom";
import AssetForm from "../components/Asset/AssetForm";
import Modal from "../components/Modal/Modal";
import { GlobalContext } from "../context/globalContext";

const AssetPage = () => {
  const { assets, locations, onAddAsset, showModal, setShowModal, message, getAllLocations, getAllAssets } =
    useContext(GlobalContext);
  let n = 1;

  useEffect(()=>{
    getAllLocations();
    getAllAssets();
  },[]);
  
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
              Add asset
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
                  <th scope="col">Asset Name</th>
                  <th scope="col">Asset Description</th>
                  <th scope="col">Asset Type</th>
                  <th scope="col">Status</th>
                  <th scope="col">Location</th>
                  <th scope="col">Brand</th>
                  <th scope="col">Changed by</th>
                </tr>
              </thead>
              <tbody>
                {assets?.map((asset) => {
                  let style = n % 2 === 1 ? "table-secondary" : null;
                  let [loc] = locations.filter((l) => {
                    return l._id === asset.location;
                  });
                  return (
                    <tr className={style} key={asset._id}>
                      <td>{n++}</td>
                      <td>
                        <NavLink
                          className="tablelink text-dark"
                          to={`/assets/${asset.serialNumber}`}
                        >
                          {asset.serialNumber}
                        </NavLink>
                      </td>
                      <td>{asset.assetName}</td>
                      <td>{asset.assetDesc}</td>
                      <td>{asset.assetType}</td>
                      <td>{asset.status}</td>
                      <td>
                        {`${loc?.addressLine1}, ${loc?.city}, ${loc?.state}, ${loc?.pincode}`}
                      </td>
                      <td>{asset.brand}</td>
                      <td>{asset.lastUpdatedBy}</td>
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
        title="Add Asset"
        onClose={() => {
          setShowModal(false);
        }}
      >
        <AssetForm
          message={message}
          setShowModal={setShowModal}
          onAddAsset={onAddAsset}
          locations={locations}
        ></AssetForm>
      </Modal>
    </>
  );
};

export default AssetPage;

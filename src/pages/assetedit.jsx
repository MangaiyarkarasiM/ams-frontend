import React, { useEffect, useState, useContext } from "react";
import fetchApi from "../utils/fetchApi";
import { useParams, useNavigate } from "react-router-dom";
import AssetForm from "../components/Asset/AssetForm";
import { GlobalContext } from "../context/globalContext";

const AssetEditPage = () => {
  const { onEditAsset, locations } = useContext(GlobalContext);
  let { serialNumber } = useParams();
  let [asset, setAsset] = useState({});
  const navigate = useNavigate();

  async function getAssetWithSerialNumber(serialNumber) {
    //console.log(serialNumber);
    let res = await fetchApi.get(`assets/${serialNumber}`);
    if (res.data.statusCode === 200) {
      setAsset(res.data.asset);
    } else {
      console.log(res.data);
    }
  }

  useEffect(() => {
    getAssetWithSerialNumber(serialNumber);
  }, [serialNumber]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12 col-md-12 col-lg-12">
          <p className="">
            Update the details of asset with serial number
            <span className="font-weight-bold font-italic">
              {" "}
              {serialNumber}
            </span>
          </p>
          <AssetForm
            locations={locations}
            asset={asset}
            onEditAsset={onEditAsset}
            onClose={() => {
              navigate(-1);
            }}
            className="my-2"
          ></AssetForm>
        </div>
      </div>
    </div>
  );
};

export default AssetEditPage;

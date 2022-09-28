import React, { useState, useEffect, useContext } from "react";
import Card from "../components/Card/Card";
import fetchApi from "../utils/fetchApi";
import { GlobalContext } from "../context/globalContext";
import { Line } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const DashboardPage = () => {
  const { onAuthFail } = useContext(GlobalContext);
  const [assets, setAssets] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  let available = 0, assigned = 0, maintenance = 0, disposed = 0;

  const barchartdata = {
    labels: months,
    datasets: [
      {
        data: barData,
        label: "Assets added",
        backgroundColor: [
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
          "'rgba(201, 203, 207, 0.2)'",
        ],
        borderColor: "#6c757d",
        borderWidth: 1,
      },
    ],
  };

  const linechartdata = {
    labels: months,
    datasets: [
      {
        data: lineData,
        label: "Assets repaired",
        borderColor: "#ffc107",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const barchartoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Assets Added Per Month',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 10
      },
    },
  };

  const linechartoptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Assets Repaired Per Month',
      },
    },
    scales:{
      y: {
        beginAtZero: true,
        suggestedMax: 10
      },
    },
    elements: {
      point: {
        backgroundColor: "#6c757d",
      },
    },
  };

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
      setAssets(res.data.assets);
      calculateData(res.data.assets, false);
    } else {
      console.log(res.data);
    }
  }

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
      calculateData(
        res.data.maintenances.filter((m) => {
          return m.status === "Complete";
        }),
        true
      );
    } else {
      console.log(res.data);
    }
  }

  const convertDate = (value) => {
    if (value) {
      var tzoffset = new Date(value).getTimezoneOffset() * 60000;
      var date = new Date(value - tzoffset)
        .toISOString()
        .slice(0, -1)
        .slice(5, 7);
      return date;
    } else {
      return null;
    }
  };

  function calculateData(data, indicator) {
    let mainData = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
    };
    data?.map((d) => {
      let m = indicator
        ? convertDate(+d.endTimeStamp)
        : String(d.createdAt).slice(5, 7);
      let mon = m[0] === "0" ? m[1] : m;
      if (!mainData[mon]) {
        mainData[mon] = 1;
      } else {
        mainData[mon]++;
      }
      return;
    });
    indicator
      ? setLineData(Object.values(mainData))
      : setBarData(Object.values(mainData));
  }

  useEffect(() => {
    getAllAssets();
    getAllMaintenances();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          {assets?.map((ast) => {
            if (ast.status === "Available") {
              available++;
            } else if (ast.status === "Assigned") {
              assigned++;
            } else if (ast.status === "Under Maintenance") {
              maintenance++;
            } else {
              disposed++;
            }
          })}
          <Card
            primaryClassName=" col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            value={available}
            className="success"
            icon={<i className="fa fa-laptop fa-2x" aria-hidden="true"></i>}
          >
            Available assets
          </Card>
          <Card
            primaryClassName=" col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            value={assigned}
            className="secondary"
            icon={<i className="fa fa-tasks fa-2x" aria-hidden="true"></i>}
          >
            Assigned assets
          </Card>
          <Card
            primaryClassName=" col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            value={maintenance}
            className="info"
            icon={<i className="fa fa-wrench fa-2x" aria-hidden="true"></i>}
          >
            Under Maintenance
          </Card>
          <Card
            primaryClassName=" col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4"
            value={disposed}
            className="warning"
            icon={<i className="fa fa-trash-o fa-2x" aria-hidden="true"></i>}
          >
            Disposed assets
          </Card>
        </div>
        <div className="row my-4">
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <Bar
              className=""
              options={barchartoptions}
              data={barchartdata}
            ></Bar>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
            <Line
              className=""
              options={linechartoptions}
              data={linechartdata}
            ></Line>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;

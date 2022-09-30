import "./App.css";
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  NavLink,
  useNavigate,
} from "react-router-dom";
import LoginPage from "./pages/login";
import SignupPage from "./pages/signup";
import DashboardPage from "./pages/dashboard";
import Header from "./components/Header/Header";
import AssetPage from "./pages/asset";
import ProfilePage from "./pages/profile";
import LocationPage from "./pages/location";
import AssignmentPage from "./pages/assignment";
import DisposePage from "./pages/dispose";
import MaintenancePage from "./pages/maintenance";
import Footer from "./components/Footer/Footer";
import { GlobalProvider } from "./context/globalContext";
import AssetEditPage from "./pages/assetedit";
import LocationEditPage from "./pages/locationedit";
import RecoverPage from "./pages/recover";
import fetchApi from "./utils/fetchApi";

const exclusionArray = ["/login", "/signup", "/"];

function App() {
  const [spin, setSpin] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [locations, setLocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let user = sessionStorage.getItem("userName");
    let token = sessionStorage.getItem("token");
    if (user === null || token === null) {
      navigate("/login");
    } else {
      setUserName(user);
      getAllAssets();
      getAllLocations();
    }
  }, []);

  const onLogin = async (value) => {
    let res = await fetchApi.post("/users/login", { ...value });
    if (res.data.statusCode === 200) {
      sessionStorage.setItem("userName", res.data.userName);
      sessionStorage.setItem("token", res.data.token);
      setUserName(res.data.userName);
      setMessage("");
      setSpin(false);
      navigate("/dashboard");
    } else {
      setMessage(res.data.message);
    }
  };

  const onAuthFail = () => {
    window.alert("Your session has ended. Please login again to authenticate");
    navigate("/login");
  };

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
      let assets = res.data.assets.filter((a) => {
        return a.status !== "Disposed";
      });
      setAssets(assets);
    } else {
      console.log(res.data);
    }
  }

  async function getAllLocations() {
    //console.log(res.data);
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.get(`/sites/getAllSites`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(res.data);
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      setLocations(res.data.sites);
    } else {
      console.log(res.data);
    }
  }

  const onAddAsset = async (value) => {
    let asset = { ...value, lastUpdatedBy: userName };
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.post(`/assets/create`, asset, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(res.data);
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      setShowModal(false);
      setMessage("");
      getAllAssets();
    } else {
      setMessage(res.data.message);
      console.log(res.data);
    }
  };

  const onEditAsset = async (values, asset) => {
    let ast = { ...values, lastUpdatedBy: userName };
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.put(`assets/${asset._id}`, ast, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(res.data);
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      alert(res.data.message);
      navigate("/assets");
    } else {
      console.log(res.data);
    }
  };

  const onAddLocation = async (value) => {
    let location = { ...value, changedBy: userName };
    let token = sessionStorage.getItem("token");
    let res = await fetchApi.post(`/sites/create`, location, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    //console.log(res.data);
    if (res.data.statusCode === 401) {
      onAuthFail();
    } else if (res.data.statusCode === 200) {
      setShowModal(false);
      getAllLocations();
    } else {
      setMessage(res.data.statusCode + " " + res.data.message);
      console.log(res.data);
    }
  };

  const onDeleteLocation = async (id, address) => {
    let conf = window.confirm(
      `Please make sure no users and assets are assigned to this location.
      \nPress ok to proceed with the deletion of ${address}.\nPress cancel to revisit the assets and users.`
    );
    if (conf) {
      let token = sessionStorage.getItem("token");
      let res = await fetchApi.delete(`sites/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      //console.log(res.data);
      if (res.data.statusCode === 401) {
        onAuthFail();
      } else if (res.data.statusCode === 200) {
        alert(res.data.message);
        getAllLocations();
      } else {
        console.log(res.data);
      }
    }
  };

  return (
    <GlobalProvider
      value={{
        onLogin,
        message,
        userName,
        assets,
        locations,
        onAddAsset,
        showModal,
        setShowModal,
        getAllAssets,
        getAllLocations,
        onEditAsset,
        onAddLocation,
        onDeleteLocation,
        onAuthFail,
        spin,
        setSpin
      }}
    >
      <div className="d-flex flex-row">
        {exclusionArray.indexOf(location.pathname) < 0 && <Header />}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {exclusionArray.indexOf(location.pathname) < 0 && (
              <nav className="navbar navbar-expand navbar-light bg-secondary my-0 mb-4">
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                  <div className="d-flex align-items-center justify-content-center">
                    <button
                      className="navbtn btn btn-link rounded-circle mr-3"
                      type="button"
                      data-toggle="collapse"
                      data-target="#sideBar"
                      aria-controls="navbarSupportedContent"
                      aria-expanded="false"
                      aria-label="Toggle navigation"
                    >
                      <span className="navbar-toggler-icon"></span>
                    </button>
                  </div>
                  <a
                    className="dropdown text-white p-0 mr-3"
                    data-toggle="dropdown"
                    href="#"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    to="#"
                  >
                    <i
                      className="fa fa-user-circle-o fa-2x text-warning"
                      aria-hidden="true"
                    ></i>
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right"
                    style={{ width: "0px" }}
                  >
                    <NavLink
                      to={`/users/profile/${userName}`}
                      className="text-dark bg-white dropdown-item"
                    >
                      Profile
                    </NavLink>
                    <button
                      className="text-dark bg-white dropdown-item"
                      onClick={() => {
                        sessionStorage.clear();
                        navigate("/login");
                      }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </nav>
            )}
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/dashboard" element={<DashboardPage />}></Route>
              <Route path="/assets" element={<AssetPage />}></Route>
              <Route
                path="/assets/:serialNumber"
                element={<AssetEditPage />}
              ></Route>
              <Route path="/locations" element={<LocationPage />}></Route>
              <Route
                path="/locations/:id"
                element={<LocationEditPage />}
              ></Route>
              <Route path="/assignment" element={<AssignmentPage />}></Route>
              <Route path="/dispose" element={<DisposePage />}></Route>
              <Route path="/recover" element={<RecoverPage />}></Route>
              <Route path="/maintenance" element={<MaintenancePage />}></Route>
              <Route
                path="/users/profile/:id"
                element={<ProfilePage />}
              ></Route>
              <Route path="/" element={<LoginPage />}></Route>
            </Routes>
          </div>
        </div>
      </div>
      <div className="w-100">
        <Footer />
      </div>
    </GlobalProvider>
  );
}

export default App;

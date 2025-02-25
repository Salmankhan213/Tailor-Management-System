import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setActiveNav } from "../redux/Services/Features/NavSlice";
import { showSuccessAlert } from "../util/SweetalertHelper";
import { HidePrint } from "../redux/Services/Features/PrintSlice";
import Cookies from "js-cookie";
import { useGetShopInfoQuery } from "../redux/Services/AppsettingApi";

function Navbar() {
  const navigate = useNavigate();
  const isActive = useSelector((state) => state.Navigation.IsActive);
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const { data: shopdata } = useGetShopInfoQuery();

  const HandleNavActive = (index) => {
    dispatch(setActiveNav(index));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("username");
    showSuccessAlert("Logout Successfully");
    setTimeout(() => {
      dispatch(HidePrint(true));
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const Name = Cookies.get("username");
    setUsername(Name);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar d-flex flex-wrap justify-content-between align-items-center p-2 shadow-sm">
        <div className="shop-info d-flex align-items-center">
          <img src="/public/images/setting.png" className="shop-icon" alt="Setting" />
          <small>{shopdata?.data?.shopOwnerName}</small>
        </div>
        <div className="contact-info">
          <a href={`tel:${shopdata?.data?.contactNumber}`} className="text-dark text-decoration-none">
            📞 {shopdata?.data?.contactNumber}
          </a>
        </div>
        <div className="shop-name text-center">
          <h6 className="mb-0">{shopdata?.data?.shopName}</h6>
          <small>{shopdata?.data?.city}</small>
        </div>
        <div className="brand-logo">
          <img src="/public/images/Logo.jpg" className="rounded-circle" width="50" height="50" alt="Logo" />
        </div>
      </div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
        <div className="container-fluid">
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="user-info d-flex gap-4">
            <div className="user-avatar text-center">
              <img src="/public/images/Avatar.jpg" width="50" height="50" className="rounded-circle" alt="Avatar" />
              <p className="mb-0">{username}</p>
            </div>
            <div className="auth-buttons">
              <button className="btn btn-sm btn-danger" onClick={handleLogout}>Logout</button>
              <Link to="/login" className="btn btn-sm btn-success ms-2">Login</Link>
            </div>
          </div>

          <div className="collapse navbar-collapse justify-content-center mt-2 mt-lg-0" id="navbarText">
            <ul className="navbar-nav d-flex flex-wrap justify-content-center">
              {[
                { path: "/", label: "Home", img: "home.png", index: 7 },
                { path: "/clothentry", label: "Cloths", img: "cloth.png", index: 6 },
                { path: "/customerentry", label: "Customers", img: "multiUser.jpeg", index: 5 },
                { path: "/workerentry", label: "Workers", img: "tailorUser.png", index: 4 },
                { path: "/expensesentry", label: "Expenses", img: "Ledger.png", index: 3 },
                { path: "/orderprogress", label: "Order Progress", img: "tialorIcon.jpeg", index: 2 },
                { path: "/reports", label: "Reports", img: "report.png", index: 8 },
                { path: "/setting/appsetting", label: "Settings", img: "settingIcon.png", index: 1 },
              ].map(({ path, label, img, index }) => (
                <li key={index} className={`nav-item ${isActive === index ? "active" : ""}`} onClick={() => HandleNavActive(index)}>
                  <Link to={path} className="nav-link text-center">
                    <img src={`/public/images/${img}`} width="40" height="40" alt={label} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

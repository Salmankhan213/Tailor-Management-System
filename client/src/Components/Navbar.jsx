import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveNav } from '../redux/Services/Features/NavSlice';
import {showErrorAlert, showSuccessAlert} from '../util/SweetalertHelper'
import {HidePrint} from '../redux/Services/Features/PrintSlice'
import Cookies from 'js-cookie'
import {useGetShopInfoQuery} from '../redux/Services/AppsettingApi'

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const isActive = useSelector((state) => state.Navigation.IsActive);
  const dispatch = useDispatch();
  const [username,setUsername] = useState('')
  const {data:shopdata} = useGetShopInfoQuery()

  const HandleNavActive = (index) => {
    dispatch(setActiveNav(index));
  };
  const handleLogout = ()=>{
        Cookies.remove('token')
        Cookies.remove('username')
        showSuccessAlert('Logout Successfully')
        setTimeout(() => {
          dispatch(HidePrint(true)) 
          navigate('/login')
        },1000);
  }

  useEffect(()=>{
   const Name =  Cookies.get('username')
    setUsername(Name)
  },[])
  return (
    <>
      <div className="row align-items-center">
        <div className="col-6 col-md-3 text-center text-md-start mb-2 mb-md-0">
          <a className="nav-link text-dark d-flex flex-column align-items-center" aria-current="page" href="#">
            <img
              src="/public/images/setting.png"
              className="rounded-5 img-fluid"
              alt={t('settings')}
              width="40"
              height="40"
            />
            <small className="d-none d-md-block">{shopdata?.data?.shopOwnerName}</small>
          </a>
        </div>
        <div className="col-6 col-md-3 text-center mb-2 mb-md-0">
          <a className="nav-link d-flex flex-column align-items-center fw-bold text-dark" href={`tel:${shopdata?.data?.contactNumber}`}>
            <h6 className="mb-0">Phone No</h6>
            <small className="d-none d-md-block">{shopdata?.data?.contactNumber}</small>
          </a>
        </div>

        <div className="col-6 col-md-3 text-center mb-2 mb-md-0">
          <a className="nav-link d-flex flex-column align-items-center fw-bold text-dark" href="#">
            <h6 className="mb-0">& {shopdata?.data?.shopName}</h6>
            <small className="d-none d-md-block">{shopdata?.data?.city}</small>
          </a>
        </div>
      

        <div className="col-6 col-md-3 text-center text-md-end">
          <a className="nav-link" href="#">
            <img
              src="/public/images/Logo.jpg"
              className="rounded-5 img-fluid"
              alt={t('logo')}
              width="50"
              height="50"
            />
          </a>
        </div>
      </div>

      <nav className="navbar navbar-expand-lg navbar-light bg-light mt-3 shadow">
        <div className="container-fluid d-flex justify-content-lg-between">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarText"
            aria-controls="navbarText"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="d-flex gap-3 gap-md-5 justify-content-lg-center justify-content-evenly mt-3 mt-lg-0">
              <div className="user d-flex flex-column justify-content-center align-items-center">
                <img src="public/images/Avatar.jpg" width="50px" height="50px" className="rounded-5" alt="" />
                <p className="mb-0">{username}</p>
              </div>
              <div className='mt-3'>
              <button className="btn btn-sm btn-danger px-2 mx-2" onClick={handleLogout}>Log out</button>
              <Link  to={'/login'} className="btn btn-sm btn-success px-3" >Login</Link>
              </div>
            </div>
          <div className="collapse navbar-collapse justify-content-lg-end align-items-center" id="navbarText">
            <ul className="navbar-nav d-flex flex-wrap">
              <Link
                to="/setting/appsetting"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 1 ? 'active' : ''}`}
                onClick={() => HandleNavActive(1)}
              >
                <img src="/public/images/settingIcon.png" width="40" height="40" alt={t('settings')} />
                <span className="nav-link text-center">{t('settings')}</span>
              </Link>
              <Link
                to="/reports"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 8 ? 'active' : ''}`}
                onClick={() => HandleNavActive(8)}
              >
                <img src="/public/images/report.png" width="40" height="40" alt={t('report')} />
                <span className="nav-link text-center">{t('report')}</span>
              </Link>
              <Link
                to="/orderprogress"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 2 ? 'active' : ''}`}
                onClick={() => HandleNavActive(2)}
              >
                <img src="/public/images/tialorIcon.jpeg" width="40" height="40" alt={t('order')} />
                <span className="nav-link text-center">Order Progress</span>
              </Link>
              <Link
                to="/expensesentry"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 3 ? 'active' : ''}`}
                onClick={() => HandleNavActive(3)}
              >
                <img src="/public/images/Ledger.png" width="40" height="40" alt={t('expensesEntry')} />
                <span className="nav-link text-center">Expenses</span>
              </Link>
              <Link
                to="/workerentry"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 4 ? 'active' : ''}`}
                onClick={() => HandleNavActive(4)}
              >
                <img src="/public/images/tailorUser.png" width="40" height="40" alt={t('workerEntry')} />
                <span className="nav-link text-center">Workers</span>
              </Link>
              <Link
                to="/customerentry"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 5 ? 'active' : ''}`}
                onClick={() => HandleNavActive(5)}
              >
                <img src="/public/images/multiUser.jpeg" width="40" height="40" alt={t('customerEntry')} />
                <span className="nav-link text-center">Customers</span>
              </Link>
              <Link
                to="/clothentry"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 6 ? 'active' : ''}`}
                onClick={() => HandleNavActive(6)}
              >
                <img src="/public/images/cloth.png" width="40" height="40" alt={t('clothEntry')} />
                <span className="nav-link text-center">Cloths</span>
              </Link>
              <Link
                to="/"
                className={`nav-item d-flex flex-column align-items-center ${isActive === 7 ? 'active' : ''}`}
                onClick={() => HandleNavActive(7)}
              >
                <img src="/public/images/home.png" width="40" height="40" alt={t('firstPage')} />
                <span className="nav-link text-center">Home</span>
              </Link>
            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;

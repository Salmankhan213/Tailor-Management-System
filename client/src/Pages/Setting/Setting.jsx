import React, { useState ,useEffect} from 'react';
import { Outlet, Link } from 'react-router-dom';
import Layout from '../Layout/Layout';
import { useTranslation } from 'react-i18next';

function Setting() {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(1);

  const handleChange = (val) => {
    setIsActive(val);
  };

  return (
    <>
      <Layout>
        <div className="container mb-5" >
          <div className="row bg-white py-3 mb-2">
            <div className="col-12">
              <h5 className="text-center" >{t('appSetting')}</h5>
            </div>
          </div>
          <div className="row bg-white d-flex py-2">
            <div className="col-md-2">
              <Link
                to={'/setting/appsetting'}
                type="button"
                className={isActive === 1 ? 'isactive btn outline-0 border-0' : 'btn outline-0 border-0'}
                onClick={() => handleChange(1)}
              >
                {t('shopInformation')}
              </Link>
            </div>
            <div className="col-md-2">
              <Link
                to={'/setting/operatorinformation'}
                type="button"
                className={isActive === 2 ? 'isactive btn outline-0 border-0' : 'btn outline-0 border-0'}
                onClick={() => handleChange(2)}
              >
                {t('operatorInformation')}
              </Link>
            </div>
          </div>
          <div className="row my-3 d-flex ">
              <Outlet />
          </div>
        </div>
      </Layout>
    </>
  );
}

export default Setting;

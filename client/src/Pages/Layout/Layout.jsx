import React,{useEffect} from 'react'
import Navbar  from '../../Components/Navbar'
import { useTranslation } from 'react-i18next';

function Layout({children}) {
  const { t , i18n} = useTranslation();
  useEffect(() => {
    // Set the direction based on the current language
    document.documentElement.dir = i18n.language === 'ur' ? 'ltr' : 'rtl';
  }, [i18n.language]);

  return (
 
    <div className="container-fluid  bg-light shadow py-2 h-100" dir={i18n.language === 'ur' ? 'ltr' : 'rtl'}>
                <Navbar/>
        <div className="row mt-2" dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
            <div className="col-12 ">
                {children}
            </div>
        </div>
    </div>

  )
}

export default Layout

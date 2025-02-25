import React from 'react'
import Navbar  from '../../Components/Navbar'

function Layout({children}) {


  return (
 
    <div className="container-fluid  bg-light shadow py-2 h-100">
                <Navbar/>
        <div className="row mt-2" >
            <div className="col-12 ">
                {children}
            </div>
        </div>
    </div>

  )
}

export default Layout

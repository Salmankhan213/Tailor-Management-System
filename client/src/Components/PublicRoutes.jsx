import React from 'react'
import { Navigate } from 'react-router-dom'
import Cookies from 'js-cookie'

function PublicRoutes({children}) {
    const token = Cookies.get('token')
  return !token ? children : <Navigate to='/' />
}

export default PublicRoutes
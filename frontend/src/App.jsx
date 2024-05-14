
import {Route, Routes, useNavigate} from 'react-router-dom';
import Layout from './components/Layout';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css'
import ForgotPassword from './components/ForgotPassword';
import UserDashboard from './components/UserDashboard';
import PageNotFound from './components/PageNotFound';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from './redux/Slice/authSlice';
import ProtectedRoute from './utils/ProtectedRoute';
import Header from './components/Header';


function App() {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.currentUser)

  useEffect(() => {
    let isLogged = localStorage.getItem('isLogin')
    if(isLogged && currentUser){
      dispatch(login())
      navigate('/dashboard')
    }else{
      dispatch(logout())
    }
  }, [])

  return (
    <>
      <div className="min-h-screen flex flex-wrap pb-2" >
        <Header />
        <Routes>
          <Route path='/' element={<Layout />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/resetpassword' element={<ForgotPassword />} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  )
}

export default App

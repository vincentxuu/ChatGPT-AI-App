import React, { useContext } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import AuthRoute from './components/AuthRoute';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Switch from '@mui/material/Switch';
import { useState } from 'react';


const SwitchStyle = {
  position: 'absolute',
  right: '10%',
  top: '13px',
  zIndex: '10',
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'black',
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'black',
  },
}


const App = () => {
  const [mode, setMode] = useState('light');
  const theme = createTheme({
    palette: { mode: mode ? 'light' : 'dark' }
  })


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position='bottom-left'
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnHover
      />
      <Switch defaultChecked onClick={() => setMode(!mode)} sx={SwitchStyle} />
      <BrowserRouter>
        <Routes>
          <Route path='/'
            element={
              <ProtectedRoute >
                <HomePage />
              </ProtectedRoute>
            } />
          <Route path='/signin'
            element={
              <AuthRoute>
                <SignInPage />
              </AuthRoute>
            } />
          <Route path='/signup'
            element={
              <AuthRoute>
                <SignUpPage />
              </AuthRoute>
            } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
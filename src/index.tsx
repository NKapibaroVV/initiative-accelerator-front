import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import MainPage from './Pages/index';
import CabinetPage from './Pages/cabinet';
import "./index.css";
import { GlobalUserStateContextProvider } from './Modules/User/User';
import LoginPage from './Pages/login';
import VKAuthPage from './Pages/vkauth';
import AddInitiativePage from './Pages/addInitiative';
import Header from './Modules/header';
import ViewInitiativesPage from './Pages/viewInitiatives';
import CheckInitiative from './Pages/checkInitiative';
import Footer from './Modules/footer';
import RatingPage from "./Pages/rating";

function Index() {

  return <>

    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
          <Routes>
            <Route path='/' element={<MainPage />}></Route>
            {/*<Route path='/login' element={<LoginPage />}></Route>*/}
            <Route path='/vkauth' element={<VKAuthPage />}></Route>
            <Route path='/cab' element={<CabinetPage />}></Route>
            <Route path='/rating' element={<RatingPage />}></Route>
            <Route path='/addInitiative' element={<AddInitiativePage />}></Route>
            <Route path='/viewInitiatives' element={<ViewInitiativesPage />}></Route>
            <Route path='/check_i/:initiativeObj' element={<CheckInitiative />}></Route>
          </Routes>
        </div>
        <Footer/>
      </GlobalUserStateContextProvider>
    </BrowserRouter>

  </>
}

ReactDOM.render(<Index />, document.getElementById('root'));

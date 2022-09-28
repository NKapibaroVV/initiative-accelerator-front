import React from 'react';
import {createRoot} from "react-dom/client"
import "./normalize.css";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import MainPage from './Pages/index';
import CabinetPage from './Pages/cabinet';
import "./index.css";
import { GlobalUserStateContextProvider } from './Modules/User/User';
import AddInitiativePage from './Pages/addInitiative';
import Header from './Modules/header';
import ViewInitiativesPage from './Pages/viewInitiatives';
import CheckInitiative from './Pages/checkInitiative';
import Footer from './Modules/footer';
import RatingPage from "./Pages/rating";
import AuthPage from './Pages/auth';
import RegPage from './Pages/register';

function Index() {

  return <>

    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
          <Routes>
            <Route path='/' element={<MainPage />}></Route>
            <Route path='/auth' element={<AuthPage />}></Route>
            <Route path='/register' element={<RegPage />}></Route>
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

let rootElement = createRoot(document.getElementById('root')!);

rootElement.render(<Index />);

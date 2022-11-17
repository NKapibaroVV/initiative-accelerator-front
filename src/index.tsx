import React from 'react';
import { createRoot } from "react-dom/client"
import "./normalize.css";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import MainPage from './Pages/index';
import CabinetPage from './Pages/cabinet';
import "./index.css";
import { GlobalUserStateContextProvider } from './Modules/User/User';
import AddPrivateInitiativePage from "./Pages/addPrivateInitiative";
import Header from './Modules/header';
import Footer from './Modules/footer';
import RatingPage from "./Pages/rating";
import AuthPage from './Pages/auth';
import RegPage from './Pages/register';
import ListInitiativesResultsPage from './Pages/listInitiativesResults';
import CheckInitiativePage from './Pages/checkInitiative';
import AddPublicInitiativePage from './Pages/addPublicInitiative';
import AddShopItemPage from './Pages/addShopItemPage';
import ShopPage from './Pages/shopPage';
import MyShopLogsPage from './Pages/myShopLogsPage';
import EditInitiativePage from './Pages/editInitiative';
import ListOfAllInitiativesPage from './Pages/listOfAllInitiatives';
import ShopItemsListPage from './Pages/shopItemsList';
import EditShopItemPage from './Pages/editShopItemPage';
import ProfilePage from './Pages/profile';
import ListOfUsersPage from './Pages/listOfUsers';
import EditUserPage from './Pages/editUserPage';
import InitiativeStatPage from './Pages/initiativeStat';
import CheckUserInfoPage from './Pages/checkUserInfo';
import ShopItemStatPage from './Pages/shopItemStatPage';
import { globalAny } from './Modules/globalAny';

function Index() {

  globalAny.ym(90968310, 'hit', document.location.href);

  return <>

    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
          <Routes>
            <Route path='/' element={<MainPage />}></Route>
          </Routes>
        </div>
        <Footer />
      </GlobalUserStateContextProvider>
    </BrowserRouter>

  </>
}

let rootElement = createRoot(document.getElementById('root')!);

rootElement.render(<Index />);

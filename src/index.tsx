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
import SiteClosed from './Modules/SiteClosed';
import { siteStates } from './Modules/SiteClosed';


function Index() {

  globalAny.ym(90968310, 'hit', document.location.href);

  return<SiteClosed>


    <BrowserRouter>
      <GlobalUserStateContextProvider>
        <Header />
        <div className='container'>
          <Routes>
            <Route path='/' element={<MainPage />}></Route>
            <Route path='/auth' element={<AuthPage />}></Route>
            <Route path='/register' element={<RegPage />}></Route>
            <Route path='/cab' element={<CabinetPage />}></Route>
            <Route path='/profile' element={<ProfilePage />}></Route>
            <Route path='/rating' element={<RatingPage />}></Route>
            <Route path='/users' element={<ListOfUsersPage />}></Route>
            <Route path='/users/check/:user_id' element={<CheckUserInfoPage />}></Route>
            <Route path='/users/edit/:user_id' element={<EditUserPage />}></Route>
            <Route path='/shop' element={<ShopPage />}></Route>
            <Route path='/shop/story' element={<MyShopLogsPage />}></Route>
            <Route path='/shop/edit/:item_id' element={<EditShopItemPage />}></Route>
            <Route path='/shop/stat/:item_id' element={<ShopItemStatPage />}></Route>
            <Route path='/shop/edit' element={<ShopItemsListPage />}></Route>
            <Route path='/shop/add' element={<AddShopItemPage />}></Route>
            <Route path='/initiatives/edit' element={<ListOfAllInitiativesPage />}></Route>
            <Route path='/initiatives/results' element={<ListInitiativesResultsPage />}></Route>
            <Route path='/initiatives/stat/:initiative_id' element={<InitiativeStatPage />}></Route>
            <Route path='/initiatives/edit/:initiative_id' element={<EditInitiativePage />}></Route>
            <Route path='/initiatives/check/:initiative_id' element={<CheckInitiativePage />}></Route>
            <Route path='/addPrivateInitiative' element={<AddPrivateInitiativePage />}></Route>
            <Route path='/addPublicInitiative' element={<AddPublicInitiativePage />}></Route>
          </Routes>
        </div>
        <Footer />
      </GlobalUserStateContextProvider>
    </BrowserRouter>  
</SiteClosed>
}

let rootElement = createRoot(document.getElementById('root')!);

rootElement.render(<Index />);

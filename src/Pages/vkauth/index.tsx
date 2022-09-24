import React, { createRef, useEffect, useRef, useState } from "react";
import { IUser, useGlobalUserState } from "../../Modules/User/User";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'


function VKAuthPage() {

    const userState = useGlobalUserState();
    
    let appId = '51433761'

    let preloaderTextRef = createRef<HTMLDivElement>();
    let preloaderSpinnerRef = createRef<HTMLDivElement>();

    let globalAny: any = global;
    if (document.location.href.includes("cotinue_auth")) {
        let token = document.location.href.split("access_token=")[1].split("&")[0];
        let email = document.location.href.split("email=")[1].split("&")[0];
        let userId = document.location.href.split("user_id=")[1].split("&")[0];
        
    } else {

        let redirectUri = document.location.href;
        let url = 'https://oauth.vk.com/authorize?client_id=' + appId + '&display=mobile&redirect_uri=' + redirectUri + '&response_type=token&scope=email&state=cotinue_auth'
        window.location.assign(url);
    }

    return <>
        <div className="py-4">
            <div className="mx-auto fs-3" style={{ width: "fit-content" }}>
                <div className="spinner-border text-info" role="status" ref={preloaderSpinnerRef}>
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            <div className="mx-auto fs-5" style={{ width: "fit-content" }} ref={preloaderTextRef}>
                Открытие окна авторизации
            </div>
            <p>Ваш браузер может блокировать открытие диалоговых окон, если это произошло, то для успешной регистрации/авторизации необходимо разрешить и открыть <a href="/vkauth">эту страницу</a>.</p>
        </div>
    </>
}
export default VKAuthPage;
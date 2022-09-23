import React, { createRef, useEffect, useRef, useState } from "react";
import { IUser, useGlobalUserState } from "../../Modules/User/User";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'


function VKAuthPage() {

    const userState = useGlobalUserState();
    
    let appId = '51429194'

    let preloaderTextRef = createRef<HTMLDivElement>();
    let preloaderSpinnerRef = createRef<HTMLDivElement>();

    let globalAny: any = global;
    if (document.location.href.includes("code")) {
        let token = document.location.href.split("access_token=")[1].split("&")[0];
        let email = document.location.href.split("email=")[1].split("&")[0];
        let userId = document.location.href.split("user_id=")[1].split("&")[0];
        setTimeout(() => {
            globalAny.VK.init({
                apiId: appId
            });
        }, 1000)

        setTimeout(() => {
            globalAny.VK.Auth.login(function (response: any) {
                if (response.session) {
                    let user = response.session.user;
                    let firstName = user["first_name"];
                    let secondName = user["last_name"];
                    let login = user["id"];
                    fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/reg`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "first_name": firstName, "second_name": secondName, "login": login, "email": email })
                    }).then((resp) => resp.json()).then((jsonResponse) => {
                        try {
                            let userParams: IUser = jsonResponse[0];
                            
                            userState.UpdateUser(userParams)
                            
                            setCookie("userData", JSON.stringify(userParams),{expires:new Date(new Date().getTime()+60*60000)});
                            window.location.assign("/cab");
                        } catch (error: any) {
                            console.log(error.message)
                        }
                    })
                } else {
                    /* Пользователь нажал кнопку Отмена в окне авторизации */
                }
            });
        }, 2000)
    } else {

        let redirectUri = document.location.href;
        let url = 'https://oauth.vk.com/authorize?client_id=' + appId + '&display=popup&redirect_uri=' + redirectUri + '&response_type=token&scope=email'
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
        </div>
    </>
}
export default VKAuthPage;
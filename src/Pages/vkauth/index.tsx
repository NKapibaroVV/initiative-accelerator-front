import React, { createRef, useEffect, useRef, useState } from "react";
import { IUser, useGlobalUserState } from "../../Modules/User/User";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie';



function VKAuthPage() {

    const userState = useGlobalUserState();

    let appId = '51435759'

    let [timeCounter, setTimeCounter] = useState(300);

    let preloaderTextRef = createRef<HTMLDivElement>();
    let preloaderSpinnerRef = createRef<HTMLDivElement>();

    useEffect(() => {
        setInterval(() => {
            setTimeCounter((prev: number) => {
                if (prev < 0) {
                    preloaderTextRef.current!.innerHTML = `<div class="text-danger fs-4">Проверьте Ваше интернет-соединение!<br/>Слишком низкая скорость!</div>`
                    return prev
                } else {
                    return prev - 1
                }

            })
        }, 1000);


        let globalAny: any = global;
        if (document.location.href.includes("cotinue_auth")) {
            let email = document.location.href.split("email=")[1].split("&")[0];
            let userId = document.location.href.split("user_id=")[1].split("&")[0];

            globalAny.VK.init({
                apiId: appId
            });

            globalAny.VK.Auth.login((response: any) => {

                console.log(response)
                if (response.status == "connected") {

                    
                    let session = response.session;
                    if (!email) {
                        email = `emailAccessDenied-${session.user.id}`
                    }
                    const firstName = session.user["first_name"];
                    let surname = session.user["last_name"];
                    fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/reg`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ "first_name": firstName, "second_name": surname, "login": userId, "email": email })
                    }).then((resp) => resp.json()).then((jsonResponse) => {
                        try {
                            console.log({ "jsonResponse": jsonResponse })
                            let userParams: IUser = jsonResponse[0];


                            setCookie("userData", JSON.stringify(userParams));
                            if (!!getCookie("userData")) {
                                userState.UpdateUser(userParams)
                                window.location.assign("/cab");
                            } else {
                                preloaderTextRef.current!.innerHTML = `<div class="fs-4 text-danger">Ваш браузер не поддерживает cookie</div>`
                            }

                        } catch (error: any) {
                            console.log(error.message)
                        }
                    })
                } else if (response.status=="unknown"){
                    preloaderTextRef.current!.innerHTML = `<div class="fs-4 text-danger">Ошибка! Не используйте режим инкогнито!</div>`
                }


            }, 4194304)

        } else {

            let redirectUri = document.location.href;
            let url = 'https://oauth.vk.com/authorize?client_id=' + appId + '&display=mobile&redirect_uri=' + redirectUri + '&response_type=token&scope=4194304&response_type=token&state=cotinue_auth'
            window.location.assign(url);
        }

    }, [])


    return <>
        <div className="py-4">
            <div className="mx-auto fs-3" style={{ width: "fit-content" }}>
                <div className="spinner-border text-info" role="status" ref={preloaderSpinnerRef}>
                    <span className="visually-hidden"></span>
                </div>
            </div>
            <div className="mx-auto fs-5" style={{ width: "fit-content" }}>
                Не закрывайте это окно!
            </div>
            <div className="mx-auto fs-6" style={{ width: "fit-content", color: "#dce1e6" }} ref={preloaderTextRef}>
                Загрузка может занять {timeCounter} сек
            </div>
            <p className="text-center pt-4">Ваш браузер может блокировать открытие диалоговых окон, если это произошло, то для успешной регистрации/авторизации необходимо разрешить и открыть <a href="/vkauth">эту страницу</a>.</p>
        </div>
    </>
}
export default VKAuthPage;
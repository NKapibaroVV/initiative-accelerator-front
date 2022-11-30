import { Button } from "@mui/material";
import React, { useEffect } from "react";
import {SHA512} from "crypto-js";
import { globalAny } from "../../Modules/globalAny";
import IUser from "../../interfaces/user";

function AuthPage() {

    const loginFieldRef = React.createRef<HTMLInputElement>();
    const passwordFieldRef = React.createRef<HTMLInputElement>();

    function authorize() {
        console.log(SHA512(passwordFieldRef.current!.value).toString())
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/auth/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ "email": loginFieldRef.current!.value, "password": passwordFieldRef.current!.value })
        }).then(resp => resp.json()).then((userData) => {
            let user: IUser = userData[0];
            if (!!user && !!user.id && !!user.role && user.role != "default") {
                localStorage.setItem("userData", JSON.stringify(user));
                globalAny.ym(90968310, 'reachGoal', 'AUTENTIFICATED SUCCESSFULLY');
                document.location.assign("/cab")
            } else {
                globalAny.ym(90968310, 'reachGoal', 'AUTENTIFICATED WITH ERROR');
                alert("Неверный логин или пароль");
            }

        })
    }

    return <>
        <div className="">
            <h4 className="text-center px-2 mb-3 pb-2">Авторизация</h4>
            <div className="row justify-content-center gy-4 gx-2">
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="login_name" ref={loginFieldRef} placeholder="Email" />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="login_name" ref={passwordFieldRef} placeholder="Пароль" />
                </div>
                <div className="col-md-7 col-10">
                    <div className="row">
                        <div className="col-6">
                            <Button variant="contained" type="button" className="w-100" onClick={(event) => {
                                authorize();
                            }}>Войти</Button>
                        </div>
                        <div className="col-6">
                            <Button variant="outlined" className="w-100" href="/register">Регистрация</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AuthPage;
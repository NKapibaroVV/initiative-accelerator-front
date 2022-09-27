import React, { useEffect } from "react";

function AuthPage() {

    const loginFieldRef = React.createRef<HTMLInputElement>();

    return <>
        <div className="">
            <h4 className="text-center px-2 mb-3 pb-2">Авторизация</h4>
            <div className="row justify-content-center gy-4 gx-2">
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="login_name" ref={loginFieldRef} placeholder="Email" />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="login_name" ref={loginFieldRef} placeholder="Пароль" />
                </div>
                <div className="col-md-7 col-10">
                    <div className="row">
                        <div className="col-6">
                            <input type="button" className="form-control btn btn-outline-info" value="Войти" />
                        </div>
                        <div className="col-6">
                            <a className="form-control btn btn-outline-info" href="/register">Регистрация</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default AuthPage;
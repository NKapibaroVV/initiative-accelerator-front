import React, {useRef, useContext} from "react";
import crypto from "crypto-js";
import { IUser, useGlobalUserState } from "../../Modules/User/User";
import { getCookie, setCookie } from 'typescript-cookie'

function LoginPage() {
    const user = useGlobalUserState();

    let loginRef = React.createRef<HTMLInputElement>();
    let passwordRef = React.createRef<HTMLInputElement>();

    function authorize(){
        let login:string = loginRef.current!.value;
        let password:string = crypto.SHA3(passwordRef.current!.value,{outputLength: 256}).toString(crypto.enc.Hex)
        fetch("/api/get_me",{
            headers: {
                'Content-Type': 'application/json'
              },
              method: "POST",
              body: JSON.stringify({"login":login, "password":password})
        }).then((result)=>result.json()).then((jsonResult:IUser)=>{
            user.UpdateUser(jsonResult);
            setCookie("userData",JSON.stringify(jsonResult));
            window.location.assign("/cab");
        });
    }


    return <div>
        <h3 className="text-white pt-4 pb-2 mt-4 border-bottom border-3 border-white">Форма авторизации</h3>
        <div className="row pt-3 mb-4 mt-2">
            <div className="col-12 col-md-6 form-floating">
                <div className="form-floating mb-3">
                    <input type="email" ref={loginRef} className="form-control border bg-dark border-white text-white pb-3 border-3 rounded-4" id="loginInput" placeholder="email" />
                    <label htmlFor="loginInput" className="text-white">Ваш email</label>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="form-floating mb-3">
                    <input type="password" ref={passwordRef} className="form-control border bg-dark border-white text-white pb-3 border-3 rounded-4" id="passwordInput" placeholder="Пароль" />
                    <label htmlFor="passwordInput" className="text-white">Ваш пароль</label>
                </div>
            </div>
        </div>
        <div className="row justify-content-end">
            <div className="col-12 col-sm-6 col-md-3">
                <a href="/vkauth"><img src={`${process.env.PUBLIC_URL}/images/logos/vk-white.svg`} alt="vk icon" className="w-25 m-auto" style={{height:"38px"}}/></a>
                <button type="button" className="btn btn-info w-75 fw-bold" onClick={authorize}>Войти</button>
            </div>
        </div>
    </div>
}

export default LoginPage;
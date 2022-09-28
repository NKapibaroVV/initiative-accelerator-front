import { createRef } from "react";
import { setCookie } from "typescript-cookie";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

function RegPage() {

    let firstNameRef = createRef<HTMLInputElement>();
    let secondNameRef= createRef<HTMLInputElement>();
    let emailRef = createRef<HTMLInputElement>();
    let birthRef = createRef<HTMLInputElement>();
    let passwordRef = createRef<HTMLInputElement>();
    let passwordRepeatedRef = createRef<HTMLInputElement>();

    let userObject = useGlobalUserState();

    function regAccount(){
        if (passwordRef.current!.value!==passwordRepeatedRef.current!.value) {
            alert("Пароли не совпадают!")
        }else if(emailRef.current!.value.indexOf("@")<1||emailRef.current!.value.indexOf("@")>emailRef.current!.value.lastIndexOf(".")){

        }else{
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/reg`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                
                body: JSON.stringify({"first_name":firstNameRef.current!.value, "second_name":secondNameRef.current!.value, "email":emailRef.current!.value, "birth":birthRef.current!.value, "password":passwordRef.current!.value})
            }).then(resp=>resp.json()).then((userData)=>{
                let user:IUser = userData[0];

                if(!!user&&!!user.id&&!!user.role&&user.role!="default"){
                    setCookie("userData", JSON.stringify(user));
                    document.location.assign("/cab")
                }else{
                    alert("Такой пользователь уже зарегистрирован, попробуйте еще раз или выполните вход")
                }
            })
        }
    }

    return <>
        <div className="">
            <h4 className="text-center px-2 mb-3 pb-2">Регистрация</h4>
            <div className="row justify-content-center gy-4 gx-2">
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="surname" placeholder="Имя" ref={firstNameRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="name" placeholder="Фамилия" ref={secondNameRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="email" placeholder="Email" ref={emailRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="date" name="birth" ref={birthRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="password" placeholder="Пароль" ref={passwordRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="repeatPassword" placeholder="Повтор пароля" ref={passwordRepeatedRef}/>
                </div>
                <div className="col-md-7 col-10">
                    <div className="form-control btn btn-info" onClick={(event) => {
                        event.currentTarget.innerHTML = `<div class="spinner-border text-light" role="status"/>`;
                        regAccount();
                    }}>Зарегистрироваться</div>
                </div>
                <div className="col-md-7 col-10">
                    <a className="form-control btn btn-outline-info" href="/auth">Войти</a>
                </div>

            </div>
        </div>
    </>
}
export default RegPage;
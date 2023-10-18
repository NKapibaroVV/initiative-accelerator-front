import { Button } from "@mui/material";
import { createRef } from "react";
import IUser from "../../interfaces/user";
import { globalAny } from "../../Modules/globalAny";
import { useGlobalUserState } from "../../Modules/User/User";

function RegPage() {

    let firstNameRef = createRef<HTMLInputElement>();
    let secondNameRef = createRef<HTMLInputElement>();
    let emailRef = createRef<HTMLInputElement>();
    let birthRef = createRef<HTMLInputElement>();
    let passwordRef = createRef<HTMLInputElement>();
    let passwordRepeatedRef = createRef<HTMLInputElement>();

    let userObject = useGlobalUserState();

    function regAccount() {
        if (passwordRef.current!.value !== passwordRepeatedRef.current!.value) {
            alert("Пароли не совпадают!")
            globalAny.ym(90968310, 'reachGoal', 'REGISTERED WITH ERROR');
        } else if (emailRef.current!.value.indexOf("@") < 1 || emailRef.current!.value.indexOf("@") > emailRef.current!.value.lastIndexOf(".")) {
            alert("Не все поля заполнены корректно!")
            globalAny.ym(90968310, 'reachGoal', 'REGISTERED WITH ERROR');
        } else {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/reg/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify({ "first_name": firstNameRef.current!.value.trim(), "second_name": secondNameRef.current!.value.trim(), "email": emailRef.current!.value.trim(), "birth": birthRef.current!.value, "password": passwordRef.current!.value })
            }).then(resp => resp.json()).then((userData) => {
                let user: IUser = userData[0];

                if (!!user && !!user.id && !!user.role && user.role != "default") {
                    localStorage.setItem("userData", JSON.stringify(user));
                    globalAny.ym(90968310, 'reachGoal', 'REGISTERED SUCCESSFULLY');
                    alert(`Ссылка для подтверждения почты отправлена на email (${emailRef.current!.value.trim()}). Вы не сможете начать выполнять задания до подтверждения.`)
                    document.location.assign("/cab")
                } else {
                    globalAny.ym(90968310, 'reachGoal', 'REGISTERED WITH ERROR');
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
                    <input className="form-control" type="text" name="surname" placeholder="Имя" ref={firstNameRef} />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="name" placeholder="Фамилия" ref={secondNameRef} />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="text" name="email" placeholder="Email" ref={emailRef} />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="date" name="birth" ref={birthRef} />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="password" placeholder="Пароль" ref={passwordRef} />
                </div>
                <div className="col-md-7 col-10">
                    <input className="form-control" type="password" name="repeatPassword" placeholder="Повтор пароля" ref={passwordRepeatedRef} />
                </div>
                <div className="col-md-7 col-10">
                    <Button variant="contained" className="w-100" onClick={(event) => {
                        regAccount();
                    }}>Зарегистрироваться</Button>
                </div>
                <div className="col-md-7 col-10">
                    <Button variant="outlined" className="w-100" href="/auth">Войти</Button>
                </div>
                <div className="text-dark text-center mt-5" style={{ fontSize: "12px" }}>
                    Регистируясь, Вы даёте своё <a href="/presonal.txt">согласие</a> на обработку персональных данных.
                </div>

            </div>
        </div>
    </>
}
export default RegPage;

import { Button } from "@mui/material";
import { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { userRoles } from "../../enums/userRoles";
import IUser from "../../interfaces/user";
import CheckAdmin from "../../Modules/Check/CheckAdmin";
import preloader from "../../Modules/preloader";
import {useGlobalUserState } from "../../Modules/User/User";

export default function EditUserPage() {
    const { user_id } = useParams();
    const currentUser = useGlobalUserState();
    const [passwordText, setPasswordText] = useState(<></>)

    let firstNameRef = createRef<HTMLInputElement>();
    let secondNameRef = createRef<HTMLInputElement>();
    let emailRef = createRef<HTMLInputElement>();
    let groupRef = createRef<HTMLInputElement>();
    let birthRef = createRef<HTMLInputElement>();
    let roleRef = createRef<HTMLSelectElement>();

    let costDeltaRef = createRef<HTMLInputElement>();
    let costDeltaCommentRef = createRef<HTMLTextAreaElement>();

    
    let updScoreAddBtnRef = createRef<HTMLButtonElement>();
    let updScoreRemoveBtnRef = createRef<HTMLButtonElement>();

    function updUserScore(action: "add" | "remove") {
        updScoreAddBtnRef.current?.setAttribute("disabled", "true")
        updScoreRemoveBtnRef.current?.setAttribute("disabled", "true");
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/editScoreByDeltaScore/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                token: currentUser.userParams.token,
                user_id: user_id,
                cost_delta: costDeltaRef.current?.value,
                cost_delta_comment: costDeltaCommentRef.current?.value,
                action:action
            })
        }).then(res=>res.json().then(response=>{
            alert(`Баллы успешно ${action=="add"?"добавлены":"сняты"}!`);
            document.location.reload();
        }))
    }

    function resetPassword() {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/reset_user_password/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({
                token: currentUser.userParams.token,
                user_id: user_id
            })
        }).then(res => res.json().then(response => {
            alert("Пароль успешно сброшен! Вам нужно передать пароль пользователю, он указан ниже!")
            setPasswordText(<div className="rounded p-2 m-2 w-100 bg-white text-dark text-center">
                {response.newPassword}
            </div>)
        }))
    }

    function updateAccount() {
        let reqBody: any = {
            token: currentUser.userParams.token,
            name: firstNameRef.current!.value,
            surname: secondNameRef.current!.value,
            email: emailRef.current!.value,
            edu_group: groupRef.current!.value,
            birth: birthRef.current!.value,
            user_id: user_id,
            role: roleRef.current!.value,
        }


        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/update_user/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify(reqBody)
        }).then(resp => resp.json().then((response) => {
            alert("Профиль обновлен!");
            document.location.reload();
        }))
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_user/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token, user_id: user_id })
        }).then(res => res.json().then(
            (response: IUser[]) => {
                let userObject = response[0];
                firstNameRef.current!.value = userObject.name;
                secondNameRef.current!.value = userObject.surname;
                emailRef.current!.value = userObject.email;
                birthRef.current!.value = `${new Date(userObject.birth).toLocaleDateString().split(".")[2]}-${new Date(userObject.birth).toLocaleDateString().split(".")[1]}-${new Date(userObject.birth).toLocaleDateString().split(".")[0]}`
                groupRef.current!.value = `${!!userObject.edu_group ? userObject.edu_group : ""}`;
                roleRef.current!.value = userObject.role;
            }))
    }, [])

    return <CheckAdmin>
        <>
            <div className="py-3">
                <h4 className="text-center px-2 mb-3 pb-2">Изменение профиля</h4>
                <p className="text-center px-2 mb-3 pb-2">(Вводите значения только в те поля, которые хотите изменить!)</p>
                <div className="row justify-content-center gy-4 gx-2">
                    <div className="col-md-7 col-10">
                        <label>Имя</label>
                        <input className="form-control" type="text" name="surname" placeholder="Имя" ref={firstNameRef} />
                    </div>
                    <div className="col-md-7 col-10">
                        <label>Фамилия</label>
                        <input className="form-control" type="text" name="name" placeholder="Фамилия" ref={secondNameRef} />
                    </div>
                    <div className="col-md-7 col-10">
                        <label>Учебная группа</label>
                        <input className="form-control" type="text" name="group" placeholder="Учебная группа" ref={groupRef} />
                    </div>
                    <div className="col-md-7 col-10">
                        <label>Email</label>
                        <input className="form-control" type="text" name="email" placeholder="Email" ref={emailRef} />
                    </div>
                    <div className="col-md-7 col-10">
                        <label>Дата рождения</label>
                        <input className="form-control" type="date" name="birth" ref={birthRef} />
                    </div>
                    <div className="col-md-7 col-10">
                        <label>Роль</label>
                        <select name="role" className="form-select" ref={roleRef}>
                            <option value="Администратор">Администратор</option>
                            <option value="Модератор">Модератор</option>
                            <option value="Студент">Студент</option>
                        </select>
                    </div>


                    <div className="col-md-7 col-10">
                        <Button variant="contained" className="w-100" onClick={(event) => {
                            event.currentTarget.innerHTML = `<div class="spinner-border text-light" role="status"/>`;
                            updateAccount();
                        }}>
                            Применить
                        </Button>
                    </div>
                    {passwordText}
                    <div className="col-md-7 col-10" onClick={resetPassword}>
                        <Button variant="outlined" className="w-100">
                            Cбросить пароль
                        </Button>
                    </div>
                    <div className="col-md-7 col-10">
                        <Button variant="outlined" className={`w-100 ${currentUser.userParams.role != userRoles.Администратор ? "d-none" : ""}`} data-bs-toggle="offcanvas" data-bs-target="#offcanvasScore" aria-controls="offcanvasScore">
                            Изменить баллы
                        </Button>

                        <div className="offcanvas offcanvas-top" tabIndex={-1} id="offcanvasScore" aria-labelledby="offcanvasScoreLabel" style={{ height: "80%" }}>
                            <div className="offcanvas-header">
                                <h5 className="offcanvas-title" id="offcanvasScoreLabel">Изменить количество баллов</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <div className="row g-2">
                                    <div className="col-md-6 col-12">
                                        <input className="form-control" type="number" name="scoreDelta" placeholder="Количество баллов" ref={costDeltaRef} />
                                        <textarea className="form-control" name="scoreDeltaComment" placeholder="Коментарий" rows={10} style={{ marginTop: "10px" }} ref={costDeltaCommentRef} />
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <h3 className="text-center">Выберите действие</h3>
                                        <Button variant="contained" className="w-100" color="success" onClick={()=>{updUserScore("add")}} ref={updScoreAddBtnRef}>
                                            Добавить баллы
                                        </Button>
                                        <Button variant="contained" className="w-100" color="error" style={{ marginTop: "10px" }} onClick={()=>{updUserScore("remove")}} ref={updScoreRemoveBtnRef}>
                                            Снять баллы
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    </CheckAdmin>
}
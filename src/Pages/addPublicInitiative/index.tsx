import { Button } from "@mui/material";
import React, { useState } from "react";
import CheckModerator from "../../Modules/Check/CheckModerator";

import { useGlobalUserState } from "../../Modules/User/User";

export default function AddPublicInitiativePage() {
    const user = useGlobalUserState();

    const [btnDisabled, setBtnDisabled] = useState(false);

    let titleRef = React.createRef<HTMLInputElement>();
    let incomeRef = React.createRef<HTMLInputElement>();
    let usersCountRef = React.createRef<HTMLInputElement>();
    let contentRef = React.createRef<HTMLTextAreaElement>();

    let takeDayRef = React.createRef<HTMLInputElement>();
    let takeTimeRef = React.createRef<HTMLInputElement>();
    let completeDayRef = React.createRef<HTMLInputElement>();
    let completeTimeRef = React.createRef<HTMLInputElement>();

    let categoryRef = React.createRef<HTMLSelectElement>();

    function createInitiative() {
        const bodyObject = {
            token: user.userParams.token,
            title: titleRef.current?.value,
            income: incomeRef.current?.value,
            take_deadline: new Date(`${takeDayRef.current?.value} ${takeTimeRef.current?.value}`).getTime(),
            complete_deadline: new Date(`${completeDayRef.current?.value} ${completeTimeRef.current?.value}`).getTime(),
            content: contentRef.current?.value,
            category: categoryRef.current?.value,
            isPrivate: false,
            users_limit: usersCountRef.current?.value == "" || usersCountRef.current?.value == "0" ? null : usersCountRef.current?.value
        }
        if (!!bodyObject.title && !!bodyObject.take_deadline && !!bodyObject.complete_deadline && !!bodyObject.content && !!bodyObject.income) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/add_initiative/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify(bodyObject)
            }).then(res => res.json().then((response: any) => {
                console.log(response)
                alert("Создано!");
                document.location.reload();
            }))
        } else {
            alert("Проверьте правильность заполнения полей!");
            setBtnDisabled(false)
        }
    }

    return <>
        <CheckModerator>
            <div className="py-3">
                <div className="row g-2">

                    <div className="col-md-6 col-12">
                        <div className="row g-2">

                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Заголовок" ref={titleRef} />
                                    <label htmlFor="floatingInput">Заголовок</label>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="number" className="form-control" id="floatingInput" placeholder="Баллов за выполнение" ref={incomeRef} />
                                    <label htmlFor="floatingInput">Баллов за выполнение</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="inputDate">Можно взять до:</label>
                                    <input type="date" className="form-control my-2" ref={takeDayRef} />
                                    <input type="time" className="form-control my-2" ref={takeTimeRef} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="inputDate">Нужно выполнить до:</label>
                                    <input type="date" className="form-control my-2" ref={completeDayRef} />
                                    <input type="time" className="form-control my-2" ref={completeTimeRef} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="number" className="form-control" id="floatingInput" placeholder="Баллов за выполнение" ref={usersCountRef} />
                                    <label htmlFor="floatingInput">Ограничение по кол-ву пользователей</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <label>Категория:</label>
                                <select className="form-select" aria-label="" ref={categoryRef}>
                                    <option value="Ответственность" selected>Ответственность</option>
                                    <option value="Целеустремлённость">Целеустремлённость</option>
                                    <option value="Конкурентоспособность">Конкурентоспособность</option>
                                    <option value="Грамотность">Грамотность</option>
                                    <option value="Инициативность">Инициативность</option>
                                    <option value="Креативность">Креативность</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-floating text-dark">
                            <textarea className="form-control" placeholder="Описание" id="floatingTextarea2" style={{ height: "490px" }} ref={contentRef}></textarea>
                            <label htmlFor="floatingTextarea2">Описание</label>
                        </div>
                    </div>
                    <div className="col-12 fs-6">
                        *Укажите ограничение по кол-ву пользователей = 0 для снятия ограничения.
                    </div>
                    <div className="col-12">
                        <Button variant="outlined" className="w-100" disabled={btnDisabled} onClick={(clickedElement) => { setBtnDisabled(true); createInitiative() }}>Создать</Button>
                    </div>

                </div>
            </div>
        </CheckModerator>
    </>
}
import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Iinitiative, { initiativeCategory } from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";

export default function EditInitiativePage() {
    const { initiative_id } = useParams();

    let titleRef = React.createRef<HTMLInputElement>();
    let incomeRef = React.createRef<HTMLInputElement>();
    let usersCountRef = React.createRef<HTMLInputElement>();
    let contentRef = React.createRef<HTMLTextAreaElement>();

    let takeDayRef = React.createRef<HTMLInputElement>();
    let takeTimeRef = React.createRef<HTMLInputElement>();
    let completeDayRef = React.createRef<HTMLInputElement>();
    let completeTimeRef = React.createRef<HTMLInputElement>();

    let categoryRef = React.createRef<HTMLSelectElement>();

    const user = useGlobalUserState();

    function updateInitiative() {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/update_initiative/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({
                initiative_id: initiative_id,
                token: user.userParams.token,
                title: titleRef.current?.value,
                income: incomeRef.current?.value,
                take_deadline: new Date(`${takeDayRef.current?.value} ${takeTimeRef.current?.value}`).getTime(),
                complete_deadline: new Date(`${completeDayRef.current?.value} ${completeTimeRef.current?.value}`).getTime(),
                content: contentRef.current?.value,
                category: categoryRef.current?.value,
                users_limit: usersCountRef.current?.value == "" || usersCountRef.current?.value == "0" ? null : usersCountRef.current?.value
            })
        }).then(res => res.json().then((response: any) => {
            console.log(response)
            alert("Изменено!");
            document.location.assign("/initiatives/edit");
        }))
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiative_params/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token, initiative_id: initiative_id })
        }).then(resp => resp.json().then((response: Iinitiative[]) => {

            let initiative = response[0];

            titleRef.current!.value = initiative.title;
            incomeRef.current!.value = initiative.income.toString();
            takeDayRef.current!.value = `${new Date(initiative.deadline_take).toLocaleDateString().split(".")[2]}-${new Date(initiative?.deadline_take).toLocaleDateString().split(".")[1]}-${new Date(initiative?.deadline_take).toLocaleDateString().split(".")[0]}`
            takeTimeRef.current!.value = new Date(initiative.deadline_take).toLocaleTimeString();
            completeDayRef.current!.value = `${new Date(initiative.deadline_complete).toLocaleDateString().split(".")[2]}-${new Date(initiative.deadline_complete).toLocaleDateString().split(".")[1]}-${new Date(initiative.deadline_complete).toLocaleDateString().split(".")[0]}`
            completeTimeRef.current!.value = new Date(initiative.deadline_complete).toLocaleTimeString();
            usersCountRef.current!.value = !!initiative.users_limit ? initiative.users_limit.toString() : "0";
            categoryRef.current!.value = initiative.category;
            contentRef.current!.value = initiative.content;
        }))
    }, [])

    return <CheckModerator>
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
                    <div className="btn btn-outline-info rounded-4 p-2 w-100" onClick={(clickedElement) => { clickedElement.currentTarget.classList.add("disabled"); updateInitiative() }}>
                        Обновить до текущих значений
                    </div>
                </div>

            </div>
        </div>
    </CheckModerator>
}
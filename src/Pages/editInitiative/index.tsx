import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Iinitiative, { initiativeCategory } from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

export default function EditInitiativePage() {
    const { initiative_id } = useParams();

    const [deleteDialogShown, setDeleteDialogShown] = useState(false);

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

    let deleteInitiative = () => { } //изменяется ниже в эффекте

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

            deleteInitiative = () => {
                fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/completely_delete_initiative/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",

                    body: JSON.stringify({ token: user.userParams.token, initiative_id: initiative_id })
                }).then(resp=>resp.json().then(
                    (response)=>{
                        alert("Удалено!");
                    }
                ))
            };
        }))
    }, [])

    return <CheckModerator><>

        <div className="py-3">
            <div className="fs-4 text-center mb-3 mt-0">
                Редактирование задания
            </div>
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
                    <Button variant="outlined" className="w-100" onClick={(clickedElement) => { clickedElement.currentTarget.classList.add("disabled"); updateInitiative() }}>
                        Обновить до текущих значений
                    </Button>
                    <Button variant="outlined" className="w-100 mt-3" onClick={(clickedElement) => { setDeleteDialogShown(true) }} color="error">
                        УДАЛИТЬ
                    </Button>
                </div>

            </div>
        </div>

        <Dialog
            open={deleteDialogShown}
            onClose={() => { setDeleteDialogShown(false) }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Вы действительно хотите удалить это задание?"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    После удаления этого задания оно перестанет отображать у любых
                    пользователей в любых списках (ВКЛЮЧАЯ ВАС!), а баллы, полученные ранее пользователями за это задание, останутся у них.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { alert("Удаление в разработке"); setDeleteDialogShown(false) }} color="error">
                    Удалить!
                </Button>
                <Button onClick={() => { setDeleteDialogShown(false) }} autoFocus color="success" variant="contained">НЕТ! Не нужно удалять!</Button>
            </DialogActions>
        </Dialog>
    </>
    </CheckModerator>
}
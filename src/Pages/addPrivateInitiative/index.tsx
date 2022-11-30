import { Button } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import Select from 'react-select';
import { json } from "stream/consumers";
import IUser from "../../interfaces/user";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";
function AddPrivateInitiativePage() {
    const currentUser = useGlobalUserState();

    const [btnDisabled, setBtnDisabled] = useState(false);

    const [countOfUsers, setCountOfUsers] = useState(0)
    let usersSelectsRefs: any = useRef([]);
    usersSelectsRefs.current = [];

    const addToSelectsRefs = (el: any) => {
        if (el != null) {
            usersSelectsRefs.current.push(el)
        }
        console.log(usersSelectsRefs.current)
    }

    let titleRef = React.createRef<HTMLInputElement>();
    let incomeRef = React.createRef<HTMLInputElement>();
    let contentRef = React.createRef<HTMLTextAreaElement>();

    let completeDayRef = React.createRef<HTMLInputElement>();
    let completeTimeRef = React.createRef<HTMLInputElement>();

    let categoryRef = React.createRef<HTMLSelectElement>();
    let selectedUsers: IUser[] | null = null;

    const [users, setUsers] = useState([{ label: "", value: "" }])
    const [usersSelects, setUsersSelects] = useState([<select key={"index"} className="form-select" aria-label="" />])

    function createInitiative() {
        selectedUsers = []
        usersSelectsRefs.current.forEach((el: any) => {
            if (el.props.value && !!el.props.value.value) {
                selectedUsers?.push(JSON.parse(el.props.value.value));
            }

        })
        console.log(selectedUsers)

        if (titleRef.current!.value.length > 0 && !!selectedUsers[0] && !!selectedUsers[0].token && selectedUsers[0].token.length > 1) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/add_initiative/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify({
                    token: currentUser.userParams.token,
                    title: titleRef.current?.value,
                    income: incomeRef.current?.value,
                    take_deadline: new Date().getTime() - 1000,
                    complete_deadline: new Date(`${completeDayRef.current?.value} ${completeTimeRef.current?.value}`).getTime(),
                    content: contentRef.current?.value,
                    category: categoryRef.current?.value,
                    isPrivate: true,
                    users_limit: Object.keys(selectedUsers!).length
                })
            }).then(res => res.json().then((response: any) => {

                new Promise((resolve: any, reject: any) => {
                    let count = 0;
                    selectedUsers?.forEach((selectedUser: IUser) => {
                        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/start_initiative/`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: "POST",

                            body: JSON.stringify({ token: selectedUser!.token, initiative_id: response[0].id })
                        }).then(() => {
                            count += 1;
                            if (count == Object.keys(selectedUsers!).length) {
                                resolve();
                            }
                        })
                    })

                }).then(() => {
                    alert("Создано и назначено пользователям!");
                    document.location.reload();
                })

            }))
        } else {
            alert("Не выполнено, проверьте корректность заполнения полей!");
            setBtnDisabled(false);
        }

    }



    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_users/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token })
        }).then(res => res.json().then(
            (response: IUser[]) => {
                setUsers([]);
                response.forEach((user: IUser) => {
                    setUsers((prev) => [...prev, { label: `${user.name} ${user.surname} (${user.email})`, value: JSON.stringify(user) }])
                })
                setCountOfUsers(1);
            }
        ))
    }, [])

    useEffect(() => {
        setUsersSelects([]);
        for (let index = 0; index < countOfUsers; index++) {
            let element = <Select key={index} options={users} className="form-select" aria-label="" ref={addToSelectsRefs} />
            setUsersSelects((prev) => [...prev, element])
        }
    }, [countOfUsers])

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
                                    <label htmlFor="inputDate">Нужно выполнить до:</label>
                                    <input type="date" className="form-control my-2" ref={completeDayRef} />
                                    <input type="time" className="form-control my-2" ref={completeTimeRef} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="number" value={countOfUsers} className="form-control" id="floatingInput" placeholder="Баллов за выполнение" />
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
                            <div className="col-12">
                                <label>Пользователь:</label>
                                {usersSelects}
                            </div>
                            <div className="col-6">
                                <div className="btn btn-outline-info rounded-4 p-2 w-100" onClick={() => { setCountOfUsers(prev => prev + 1) }}>Добавить</div>
                            </div>
                            <div className="col-6">
                                <div className="btn btn-outline-info rounded-4 p-2 w-100" onClick={() => { setCountOfUsers(prev => prev < 2 ? 1 : prev - 1) }}>Убрать</div>
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
export default AddPrivateInitiativePage;
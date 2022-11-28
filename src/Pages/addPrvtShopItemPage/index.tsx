import { Button } from "@mui/material";
import Select from 'react-select';
import React, { useEffect, useRef, useState } from "react";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function AddPrvtShopItemPage() {

    const [users, setUsers] = useState([{ label: "", value: "" }])
    const [countOfUsers, setCountOfUsers] = useState(0)
    const [usersSelects, setUsersSelects] = useState([<select key={"index"} className="form-select" aria-label="" />])
    const [btnDisabled, setBtnDisabled] = useState(false);
    const currentUser = useGlobalUserState();
    let costRef = React.createRef<HTMLInputElement>();
    let titleRef = React.createRef<HTMLInputElement>();
    let descriptionRef = React.createRef<HTMLInputElement>();
    let deadlineTakeDateRef = React.createRef<HTMLInputElement>();
    let deadlineTakeTimeRef = React.createRef<HTMLInputElement>();
    let usersLimitRef = React.createRef<HTMLInputElement>();
    let usersSelectsRefs: any = useRef([]);
    usersSelectsRefs.current = [];


    const addToSelectsRefs = (el: any) => {
        if (el != null) {
            usersSelectsRefs.current.push(el)
        }
        console.log(usersSelectsRefs.current)
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
                console.log({ users })
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

    function addNewShopItem() {
        let selectedUsers: any[] = []
        usersSelectsRefs.current.forEach((el: any) => {
            if (el.props.value && !!el.props.value.value) {
                selectedUsers?.push(JSON.parse(el.props.value.value));
            }
        })
        console.log({ selectedUsers })

        let reqBody: any = { token: currentUser.userParams.token }
        reqBody["cost"] = costRef.current!.value;
        reqBody["title"] = titleRef.current!.value;
        reqBody["description"] = descriptionRef.current!.value;
        console.log({ 0: deadlineTakeDateRef.current!.value.length > 1, 1: deadlineTakeTimeRef.current!.value.length > 1 })
        if (deadlineTakeDateRef.current!.value.length > 1 && deadlineTakeTimeRef.current!.value.length > 1) {
            reqBody["deadline_take"] = new Date(`${deadlineTakeDateRef.current!.value} ${deadlineTakeTimeRef.current!.value}`).getTime()
        }
        !!usersLimitRef.current!.value ? reqBody["users_limit"] = usersLimitRef.current!.value : console.log("users_limit is null");
        if (costRef.current!.value.length > 0 && titleRef.current!.value.length > 0 && descriptionRef.current!.value.length > 0) {

            let countToSend: number = 0;
            selectedUsers?.forEach((selectedUser: IUser) => {
                reqBody["user_id"] = selectedUser.id;
                fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/add_shop_item/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",

                    body: JSON.stringify(reqBody)
                }).then(resp => resp.json().then((response) => {
                    countToSend += 1;
                    if (countToSend >= Object.keys(selectedUsers).length) {
                        alert("Добавлено!");
                        document.location.reload();
                    }
                }))
            })

        } else {
            setBtnDisabled(false);
            alert("Не выполнено! Проверьте правильность заполнения полей!");

        }

    }

    return <CheckModerator><div>
        <h3>Создание новой приватной траты баллов</h3>
        <div className="row g-2">
            <div className="col-12">
                <label>Заголовок</label>
                <input name="title" type="text" className="w-100 p-2" placeholder="Заголовок" ref={titleRef}></input>
            </div>
            <div className="col-12">
                <label>Описание</label>
                <input name="description" type="text" className="w-100 p-2" placeholder="Описание" ref={descriptionRef}></input>
            </div>
            <div className="col-12">
                <label>Цена</label>
                <input name="cost" type="number" className="w-100 p-2" placeholder="Цена" ref={costRef}></input>
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Можно купить до:</label>
                <input type="date" className="form-control my-2" ref={deadlineTakeDateRef} />
                <input type="time" className="form-control my-2" ref={deadlineTakeTimeRef} />
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Ограничение по кол-ву покупок:</label>
                <input type="number" className="form-control my-2" value={countOfUsers} disabled={true} ref={usersLimitRef}/>
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
            <div className="fs-6">
                *Поля "Можно купить до:" и "Ограничение по кол-ву покупок:" оставьте пустыми для снятия ограничений
            </div>
            <div className="col-12">
                <Button variant="contained" className="w-100" disabled={btnDisabled} onClick={() => { setBtnDisabled(true); addNewShopItem(); }}>
                    Создать
                </Button>
            </div>
        </div>
    </div></CheckModerator>
}
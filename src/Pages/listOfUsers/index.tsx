import { useEffect, useState } from "react";
import CheckAdmin from "../../Modules/Check/CheckAdmin";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function ListOfUsersPage() {
    const currentUser = useGlobalUserState();
    const [users, setUsers] = useState([preloader])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_users/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token })
        }).then(res => res.json().then(
            (response: IUser[]) => {
                let counter: number = 0;
                setUsers([])
                response.forEach((user: IUser) => {
                    setUsers((prev) => {
                        counter += 1;
                        return [...prev,
                        <tr key={`0${user.email}-row`}>
                            <th scope="row">{counter}</th>
                            <td>{user.name}</td>
                            <td>{user.surname}</td>
                            <td>{!!user.edu_group && user.edu_group?.length > 1 ? user.edu_group : "Не указано"}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <a className="btn btn-outline-info" href={`/users/edit/${user.id}`}>Редактировать</a>
                                <a className="btn btn-outline-info" href={`/users/check/${user.id}`}>Инфо</a>
                            </td>
                        </tr>
                        ]
                    })
                })
            }
        ))
    }, [])

    return <CheckAdmin>
        <>
            <div className="m-2 p-2 fs-3">
                Редактирование пользователей
            </div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Имя</th>
                        <th scope="col">Фамилия</th>
                        <th scope="col">Группа</th>
                        <th scope="col">Почта</th>
                        <th scope="col">Роль</th>
                        <th scope="col">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {users}
                </tbody>
            </table>
        </>
    </CheckAdmin>
}
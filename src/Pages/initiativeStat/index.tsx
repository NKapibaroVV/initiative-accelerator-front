import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Iinitiative from "../../interfaces/initiative";
import preloader from "../../Modules/preloader";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function InitiativeStatPage() {
    const currentUser = useGlobalUserState();

    const { initiative_id } = useParams();

    const [members, setMembers] = useState([preloader])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiative_members/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token, initiative_id: initiative_id })
        }).then(res => res.json().then(response => {
            console.log(response);
            setMembers([]);
            let counter: number = 0;
            response.forEach((initiativeParams: Iinitiative & IUser) => {
                setMembers((prev) => {
                    counter += 1;
                    return [...prev,
                    <tr key={`0${initiativeParams.id}-row`}>
                        <th scope="row">{counter}</th>
                        <td>{initiativeParams.name}</td>
                        <td>{initiativeParams.surname}</td>
                        <th>{!!initiativeParams.edu_group ? initiativeParams.edu_group : "Не указано"}</th>
                        <th>{initiativeParams.email}</th>
                        <th>{!!initiativeParams.link ? "Начато" : "Сдано"}</th>
                        <th>{!!initiativeParams.checked && initiativeParams.checked == 1 ? "Проверено" : "Не проверено"}</th>
                    </tr>
                    ]
                })
            });
        }))
    }, [])

    return <>
        <div className="fs-3">
            Список участников
        </div>
        <table className="table ">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Имя</th>
                    <th scope="col">Фамилия</th>
                    <th scope="col">Группа</th>
                    <th scope="col">Почта</th>
                    <th scope="col">Статус</th>
                    <th scope="col">Проверено</th>
                </tr>
            </thead>
            <tbody>
                {members}
            </tbody>
        </table>
    </>
}
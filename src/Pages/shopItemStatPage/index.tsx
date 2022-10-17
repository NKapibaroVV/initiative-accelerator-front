import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IShopLogItem from "../../interfaces/shopLogItem";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function ShopItemStatPage() {
    const { item_id } = useParams();
    const currentUser = useGlobalUserState();

    const [users, setUsers] = useState([<tr key="834ghbf"><th></th></tr>])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_shop_item_stat/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({
                token: currentUser.userParams.token,
                item_id: item_id
            })
        }).then(res => res.json().then(response => {
            setUsers([])
            response.forEach((shopLog: IShopLogItem & IUser) => {
                setUsers(prev => [...prev, <tr key={`0-${shopLog.identifer}-${shopLog.id}`}>
                    <th>#</th>
                    <th>{new Date(shopLog.time).toLocaleString()}</th>
                    <th>{shopLog.name}</th>
                    <th>{shopLog.surname}</th>
                    <th>{shopLog.edu_group}</th>
                    <th>{shopLog.email}</th>
                    <th>{shopLog.role}</th>
                    <th><a href={`/users/check/${shopLog.user_id}`} className="btn btn-outline-info">Инфо</a></th>
                </tr>])
            });

        }))
    }, [])

    return <>
        <div>
            <div className="fs-3 m-2 p-2 text-center">
                Статистика по предмету магазина
            </div>
            <table className="table ">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Дата</th>
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
        </div>
    </>
}
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IShopLogItem from "../../interfaces/shopLogItem";
import IUser from "../../interfaces/user";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { useGlobalUserState } from "../../Modules/User/User";

export default function ShopItemStatPage() {
    const { item_id } = useParams();
    const currentUser = useGlobalUserState();

    const [users, setUsers] = useState([<TableRow key="834ghbf"><TableCell></TableCell></TableRow>])

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
                setUsers(prev => [...prev, <TableRow key={`0-${shopLog.identifer}-${shopLog.id}`}>
                    <TableCell>#</TableCell>
                    <TableCell>{new Date(shopLog.time).toLocaleString()}</TableCell>
                    <TableCell>{shopLog.name}</TableCell>
                    <TableCell>{shopLog.surname}</TableCell>
                    <TableCell>{shopLog.edu_group}</TableCell>
                    <TableCell>{shopLog.email}</TableCell>
                    <TableCell>{shopLog.role}</TableCell>
                    <TableCell><Button variant="outlined" href={`/users/check/${shopLog.user_id}`} className="w-100">Инфо</Button></TableCell>
                </TableRow>])
            });

        }))
    }, [])

    return <CheckModerator>
        <div>
            <div className="fs-3 m-2 p-2 text-center">
                Статистика по предмету магазина
            </div>
            <TableContainer>
                <Table className="table ">
                    <TableHead>
                        <TableRow>
                            <TableCell scope="col">#</TableCell>
                            <TableCell scope="col">Дата</TableCell>
                            <TableCell scope="col">Имя</TableCell>
                            <TableCell scope="col">Фамилия</TableCell>
                            <TableCell scope="col">Группа</TableCell>
                            <TableCell scope="col">Почта</TableCell>
                            <TableCell scope="col">Роль</TableCell>
                            <TableCell scope="col">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </CheckModerator>
}
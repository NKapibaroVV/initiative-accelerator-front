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

    const [customers, setCustomers] = useState([<TableRow key="834ghbf"><TableCell></TableCell></TableRow>])
    const [owners, setOwners] = useState([<TableRow key="834ghb1f"><TableCell></TableCell></TableRow>])

    useEffect(() => {

        //getting customers
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
            setCustomers([])
            response.forEach((shopLog: IShopLogItem & IUser) => {
                setCustomers(prev => [...prev, <TableRow key={`0-${shopLog.identifer}-${shopLog.id}`}>
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



        setOwners([])
        //getting owners
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_shop_item_users/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({
                token: currentUser.userParams.token,
                item_id: item_id
            })
        }).then(res => res.json().then(response => {
                    response.forEach((shopLog: IShopLogItem & IUser) => {
                        setOwners(prev => [...prev, <TableRow key={`0-${shopLog.identifer}-${shopLog.id}`}>
                            <TableCell>#</TableCell>
                            <TableCell>{shopLog.name}</TableCell>
                            <TableCell>{shopLog.surname}</TableCell>
                            <TableCell>{shopLog.edu_group}</TableCell>
                            <TableCell>{shopLog.email}</TableCell>
                            <TableCell>{shopLog.role}</TableCell>
                            <TableCell><Button variant="outlined" href={`/users/check/${shopLog.user_id}`} className="w-100">Инфо</Button></TableCell>
                        </TableRow>])
                    });
        }).catch(err=>{
                setOwners(prev => [...prev, <TableRow key={`0-sdfw-e48ue`}>
                    <TableCell>#</TableCell>
                    <TableCell>Это</TableCell>
                    <TableCell>задание</TableCell>
                    <TableCell>доступно</TableCell>
                    <TableCell>всем</TableCell>
                    <TableCell>пользователям</TableCell>
                    <TableCell></TableCell>
                </TableRow>])
        }))
    }, [])

    return <CheckModerator>
        <div>
            <div className="fs-3 m-2 p-2 text-center">
                Назначенные пользователи
            </div>
            <TableContainer>
                <Table className="table ">
                    <TableHead>
                        <TableRow>
                            <TableCell scope="col">#</TableCell>
                            <TableCell scope="col">Имя</TableCell>
                            <TableCell scope="col">Фамилия</TableCell>
                            <TableCell scope="col">Группа</TableCell>
                            <TableCell scope="col">Почта</TableCell>
                            <TableCell scope="col">Роль</TableCell>
                            <TableCell scope="col">Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {owners}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="fs-3 m-2 p-2 text-center">
                Покупки предмета магазина
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
                        {customers}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    </CheckModerator>
}
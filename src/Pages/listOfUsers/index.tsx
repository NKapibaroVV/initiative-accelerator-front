import { Table, TableHead, TableRow, TableCell, TableBody, Card, TableContainer, Button, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import CheckAdmin from "../../Modules/Check/CheckAdmin";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function ListOfUsersPage() {
    const currentUser = useGlobalUserState();
    const [users, setUsers] = useState([<TableRow>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        </TableRow>])

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
                        <TableRow key={`0${user.email}-row`}>
                            <TableCell scope="row">{counter}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.surname}</TableCell>
                            <TableCell>{!!user.edu_group && user.edu_group?.length > 1 ? user.edu_group : "Не указано"}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Button variant="outlined" className="w-100" href={`/users/edit/${user.id}`}>Редактировать</Button>
                                <Button variant="outlined" className="w-100 mt-2" href={`/users/check/${user.id}`}>Инфо</Button>
                            </TableCell>
                        </TableRow>
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
            <TableContainer variant="outlined" component={Card}>
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
                        {users}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    </CheckAdmin>
}
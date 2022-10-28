import { Table, TableHead, TableRow, TableCell, TableBody, Card, TableContainer, Button, Skeleton } from "@mui/material";
import { useEffect, useState, createRef, forwardRef, RefObject, Ref } from "react";
import Select, { GroupBase } from 'react-select'
import CheckAdmin from "../../Modules/Check/CheckAdmin";
import CheckModerator from "../../Modules/Check/CheckModerator";
import preloader from "../../Modules/preloader";
import { defaultUserParams, IUser, useGlobalUserState } from "../../Modules/User/User";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';

export default function ListOfUsersPage() {
    const currentUser = useGlobalUserState();
    const [usersList, setUsersList] = useState([{ label: "", value: "" }])
    let userSelectRef = createRef<any>();
    const [users, setUsers] = useState([<TableRow>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
    </TableRow>])

    function serachPerson() {
        let value = userSelectRef.current.props.value;
        if (value.value.length > 3) {
            document.location.assign(`/users/check/${value.value}`)
        }
    }

    function editPerson() {
        let value = userSelectRef.current.props.value;
        if (value.value.length > 3) {
            document.location.assign(`/users/edit/${value.value}`)
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
                let counter: number = 0;
                setUsers([]);
                setUsersList([]);
                response.forEach((user: IUser) => {
                    setUsersList((prev) => [...prev, { label: `${user.name} ${user.surname} (${user.email})`, value: user.id }])
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
            <div>
                <div className="row my-2 g-2">
                    <div className="col-12 col-md-8">
                        <Select options={usersList} ref={userSelectRef} />
                    </div>
                    <div className="col-6 col-md-2">
                        <Button variant="contained"
                            className="w-100"
                            onClick={serachPerson}><PersonSearchIcon /></Button>
                    </div>
                    <div className="col-6 col-md-2">
                        <Button variant="contained"
                            className="w-100"
                            onClick={editPerson}><ManageAccountsIcon/></Button>
                    </div>
                </div>
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
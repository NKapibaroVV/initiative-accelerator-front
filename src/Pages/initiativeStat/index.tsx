import { TableRow, TableCell, Table, TableHead, TableBody, TableContainer, Card, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Iinitiative from "../../interfaces/initiative";
import preloader from "../../Modules/preloader";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function InitiativeStatPage() {
    const currentUser = useGlobalUserState();

    const { initiative_id } = useParams();

    const [members, setMembers] = useState([<TableRow key="2937h">
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
        <TableCell>{preloader}</TableCell>
</TableRow>])

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
                    <TableRow key={`0${initiativeParams.id}-row`}>
                        <TableCell scope="row">{counter}</TableCell>
                        <TableCell>{initiativeParams.name}</TableCell>
                        <TableCell>{initiativeParams.surname}</TableCell>
                        <TableCell>{!!initiativeParams.edu_group ? initiativeParams.edu_group : "Не указано"}</TableCell>
                        <TableCell>{initiativeParams.email}</TableCell>
                        <TableCell>{!!initiativeParams.checked && typeof(initiativeParams.checked)=="undefined" ? "Начато" : "Сдано"}</TableCell>
                        <TableCell>{!!initiativeParams.checked && initiativeParams.checked == 1 ? "Проверено" : "Не проверено"}</TableCell>
                    </TableRow>
                    ]
                })
            });
        }))
    }, [])

    return <>
        <div className="fs-3">
            Список участников
        </div>
        <TableContainer component={Card} className="my-2">
            <Table className="table ">
                <TableHead>
                    <TableRow>
                        <TableCell scope="col">#</TableCell>
                        <TableCell scope="col">Имя</TableCell>
                        <TableCell scope="col">Фамилия</TableCell>
                        <TableCell scope="col">Группа</TableCell>
                        <TableCell scope="col">Почта</TableCell>
                        <TableCell scope="col">Статус</TableCell>
                        <TableCell scope="col">Проверено</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {members}
                </TableBody>
            </Table>
        </TableContainer>
    </>
}
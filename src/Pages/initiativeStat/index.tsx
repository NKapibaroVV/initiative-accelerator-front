import { TableRow, TableCell, Table, TableHead, TableBody, TableContainer, Card, Dialog, Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Iinitiative from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
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

    const [initiativeInfo, setInitiveInfo] = useState(<></>)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiative_members/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token, initiative_id: initiative_id })
        }).then(res => res.json().then((response: (Iinitiative & IUser)[]) => {
            setMembers([]);
            let counter: number = 0;
            const info = response[0]!;
            setInitiveInfo(<>
                <div key="001">
                    Награда: {info.income} баллов
                </div>
                <div key="002">
                    Сдать до: {new Date(info.deadline_complete).toLocaleString()}
                </div>
                <div key="003">
                    Взять до: {new Date(info.deadline_take).toLocaleString()}
                </div>
                <div key="005">
                    Описание: {info.content}
                </div>
            </>)
            response.forEach((initiativeParams: Iinitiative & IUser) => {
                console.log(initiativeParams)
                setMembers((prev) => {
                    counter += 1;
                    return [...prev,
                    <TableRow key={`0${initiativeParams.id}-row`}>
                        <TableCell scope="row">{counter}</TableCell>
                        <TableCell>{initiativeParams.name}</TableCell>
                        <TableCell>{initiativeParams.surname}</TableCell>
                        <TableCell>{!!initiativeParams.edu_group ? initiativeParams.edu_group : "Не указано"}</TableCell>
                        <TableCell>{initiativeParams.email}</TableCell>
                        <TableCell>{!new Object(initiativeParams).hasOwnProperty("checked") ? "Начато" : initiativeParams.checked == 1 ? "Сдано" : "Сдано"}</TableCell>
                        <TableCell>{!new Object(initiativeParams).hasOwnProperty("checked") ? "Не сдано" : initiativeParams.checked == 1 ? "Проверено" : "Не проверено"}</TableCell>
                    </TableRow>
                    ]
                })
            });
        }))
    }, [])

    return <CheckModerator><>
        {initiativeInfo}
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
    </CheckModerator>
}
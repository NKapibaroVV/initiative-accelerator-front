import { Card, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import { useGlobalUserState } from "../../Modules/User/User";

function RatingPage() {
    const user = useGlobalUserState();

    const [userStat, setUserStat] = useState({
        pos: <div className="spinner-grow text-light" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>, score: <div className="spinner-grow text-light" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    })

    const [ratingTableBody, setRatingTableBody] = useState([<tr key={`${new Date().getTime()}`}></tr>]);

    function arrayToTable(array: { name: string, surname: string, score: number }[]) {
        let tableRows: JSX.Element[] = [];

        let pos: number = 1;
        let prevScore: number = array[0].score;
        array.forEach(user => {
            if (prevScore != user.score) {
                prevScore = user.score
                pos++;
            }
            tableRows.push(<TableRow key={`${user.name}-${user.score}-${pos}`}>
                <TableCell scope="row">{pos}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname}</TableCell>
                <TableCell>{user.score}</TableCell>
            </TableRow>)
        });

        return tableRows;
    }
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_personal_rating/`, {
            headers: {
                'Content-Type': 'application/json'
            },

            method: "POST",
            body: JSON.stringify({ token: user.userParams.token })
        }).then((result) => result.json()).then(({ position, score }) => {
            setUserStat({ pos: position, score: score })
        })


        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_global_rating/`
        ).then(response => response.json()).then((ratingArray) => { setRatingTableBody(arrayToTable(ratingArray)) })
    }, [])


    return <>
        <CheckAuth>
            <Card variant="outlined" className="py-4 px-2">

                <div className="p-3 m-2 mx-auto" style={{ maxWidth: "300px" }}>
                    <div className="fs-4 text-center pb-2">
                        Рейтинг
                    </div>
                    <div className="row justify-content-center fs-5 g-2">
                        <div className="col-6">
                            <Card className="text-center">
                                <div>
                                    {userStat.pos}
                                </div>
                                Позиция
                            </Card>
                        </div>
                        <div className="col-6">
                            <Card className="text-center">
                                <div>
                                    {userStat.score}
                                </div>
                                Баллов
                            </Card>
                        </div>
                    </div>
                </div>

                <div className="py-4 text-center">
                    <TableContainer variant="outlined" component={Card}>
                        <Table size="small" aria-label="rating">
                            <TableHead>
                                <TableRow>
                                    <TableCell scope="col">Позиция</TableCell>
                                    <TableCell scope="col">Имя</TableCell>
                                    <TableCell scope="col">Фамилия</TableCell>
                                    <TableCell scope="col">Баллов</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ratingTableBody}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </Card>
        </CheckAuth>
    </>
}

export default RatingPage;
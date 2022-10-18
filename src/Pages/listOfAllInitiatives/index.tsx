import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import Iinitiative from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";

export default function ListOfAllInitiativesPage() {
    const user = useGlobalUserState();
    const [results, setResults] = useState([preloader])
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_initiatives/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token })
        }).then(res => res.json().then((response) => {
            setResults([]);
            console.log(response)
            if (!!response[0]) {
                response.forEach((element: Iinitiative) => {
                    setResults((prev) => [...prev, InitiativeBrick(element, initiativeProgress.edit)])
                });
            } else {
                setResults([<>Задания не найдены!</>])
            }

        }))
    }, [])
    return <CheckModerator>
        <>
            <div className="fs-3 text-center text-primary">
                Редактирование заданий
            </div>
            <div className="row justify-content-center gx-3 gy-2 my-3">
                <Button variant="outlined" className="col-12 col-md-5 mx-2" href="/addPublicInitiative">Создать открытое задание</Button>
                <Button variant="outlined" className="col-12 col-md-5 mx-2" href="/addPrivateInitiative">Создать приватное задание</Button>
            </div>
            {results}
        </>
    </CheckModerator>
}
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
                setResults([<>На данный момент нечего проверить!</>])
            }

        }))
    }, [])
    return <CheckModerator>
        <>
        <div className="fs-3 text-center text-white">
            Редактирование заданий
        </div>
            {results}
        </>
    </CheckModerator>
}
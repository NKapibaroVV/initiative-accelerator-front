import { useEffect, useState } from "react"
import Iinitiative from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";

export default function ListInitiativesResultsPage() {
    const user = useGlobalUserState();
    const [results, setResults] = useState([preloader])
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiatives_results/`, {
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
                    setResults((prev) => [...prev, InitiativeBrick(element, initiativeProgress.admin)])
                });
            }else{
                setResults([<>На данный момент нечего проверить!</>])
            }

        }))
    }, [])
    return <CheckModerator>
        <>
            {results}
        </>
    </CheckModerator>
}
import { useEffect, useState } from "react"
import { useGlobalUserState } from "../../../Modules/User/User"

export default function BigInitiativesStatistics() {

    const [content, setContent] = useState("Загрузка...");

    let currentUser = useGlobalUserState();
    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/getBigInitiativesStatistics`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token:currentUser.userParams.token })
        }).then(resp=>resp.text().then((csv:string)=>{
            document.documentElement.innerHTML = csv
        }))
    },[])
    return <>
    {content}
    </>
}
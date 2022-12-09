import { Button } from "@mui/material";
import { useEffect, useState } from "react"
import CheckAdmin from "../../../Modules/Check/CheckAdmin";
import CheckAuth from "../../../Modules/Check/CheckAuthorized";
import { useGlobalUserState } from "../../../Modules/User/User"

export default function BigInitiativesStatistics() {

    const [content, setContent] = useState(<>Загрузка...</>);

    let currentUser = useGlobalUserState();
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/getBigInitiativesStatistics`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token })
        }).then(resp => resp.text().then((csv: string) => {
            /**
             * let textFileAsBlob: Blob = new Blob([csv], { type: 'text/plain' });
            var downloadLink = document.createElement("a");
            downloadLink.download = "file.csv";
            downloadLink.innerHTML = "Download File";
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
            downloadLink.click();
             */

            function dataUrl(data: string) { 
                let universalBOM:string = "\uFEFF";
                return 'data:text/csv; charset=utf-8,' + encodeURIComponent(universalBOM+csv) }
            setContent(<Button className="w-100" href={dataUrl(csv)} download="bigInitiativesStatistics.csv">Скачать</Button>)
        }))
    }, [])
    return <>
        <CheckAuth>
            <CheckAdmin>
                {content}
            </CheckAdmin>
        </CheckAuth>
    </>
}
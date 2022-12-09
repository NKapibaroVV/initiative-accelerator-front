import { Button } from "@mui/material";
import { useEffect, useState } from "react"
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

            function dataUrl(data: string) { return 'data:text/plain;charset=utf-8, ' + encodeURI(data); }
            setContent(<Button href={dataUrl(csv)} download="statistics_excel.csv">Скачать</Button>)
        }))
    }, [])
    return <>
        {content}
    </>
}
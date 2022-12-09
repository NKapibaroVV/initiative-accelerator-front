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
            let textFileAsBlob:Blob = new Blob([csv], {type:'text/plain'}); 
            var downloadLink = document.createElement("a");
    	downloadLink.download = "file.csv";
    	downloadLink.innerHTML = "Download File";
    	if (window.webkitURL != null)
    	{
    		// Chrome allows the link to be clicked
    		// without actually adding it to the DOM.
    		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    	}
    	else
    	{
    		// Firefox requires the link to be added to the DOM
    		// before it can be clicked.
    		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    		downloadLink.style.display = "none";
    		document.body.appendChild(downloadLink);
    	}
    
    	downloadLink.click();
        }))
    },[])
    return <>
    {content}
    </>
}
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function VerifMail(){
    const { id,code} = useParams();

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/email/verif`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ id: id, code:code })
        }).then(resp=>resp.json().then((response:any)=>{
            if (!!response.msg) {
                alert("Email подтверждён!")
                document.location.replace("/cab")
            }else{
                alert("Email не удалось подтвердить!")
                document.location.replace("/")
            }
        }))
    },[])
    return <>
    <div className="text-center p-2 m-2 fs-4">
        Подтверждаем почту.
    </div>
    <div className="text-center p-2 m-2 fs-4">
        Ожидайте, Вы будете перенаправлены после подтверждения.
    </div>
    </>
}
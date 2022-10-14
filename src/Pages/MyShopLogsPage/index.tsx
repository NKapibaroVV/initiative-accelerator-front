import { useEffect, useState } from "react"
import IShopLogItem from "../../interfaces/shopLogItem";
import preloader from "../../Modules/preloader"
import ShopLogItem from "../../Modules/ShopLogItem";
import { useGlobalUserState } from "../../Modules/User/User";

export default function MyShopLogsPage(){

    const [shopLogs, setShopLogs] = useState([preloader])

    const user = useGlobalUserState();

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_my_shop_logs/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token })
        }).then(res=>res.json().then((response:IShopLogItem[])=>{
            setShopLogs([])
            response.forEach((shopLogItem:IShopLogItem) => {
                setShopLogs((prev)=>[...prev,ShopLogItem(shopLogItem)])
            });
        }))
    },[])
    return <div>
        <div className="fs-3">
            История обмена баллов
        </div>
        {shopLogs}
    </div>
}
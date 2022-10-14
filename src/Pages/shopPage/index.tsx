import { useEffect, useState } from "react"
import { IShopItem } from "../../interfaces/shopItem"
import preloader from "../../Modules/preloader"
import ShopItem from "../../Modules/ShopItem"
import { useGlobalUserState } from "../../Modules/User/User";

export default function ShopPage(){

    const currentUser = useGlobalUserState();
    
    const [result, setResult] = useState([preloader])

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_shop_items/`).then(resp=>resp.json().then((response:IShopItem[])=>{
            setResult([])
            response.forEach((shopItem:IShopItem) => {
                setResult((prev)=>[...prev,ShopItem(shopItem)])
            });
        }))
    },[])

    return <div>
        <div className="m-2 p-2 fs-3">
            У Вас {currentUser.userParams.score} баллов
        </div>
        <>{result}</>
    </div>
}
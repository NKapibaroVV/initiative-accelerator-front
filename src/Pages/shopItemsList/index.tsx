import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { IShopItem } from "../../interfaces/shopItem";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import preloader from "../../Modules/preloader";
import ShopItem from "../../Modules/ShopItem";
import { useGlobalUserState } from "../../Modules/User/User";

export default function ShopItemsListPage() {

    const currentUser = useGlobalUserState();

    const [result, setResult] = useState([preloader])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_shop_items/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
                token: currentUser.userParams.token,
            })
        }).then(resp => resp.json().then((response: IShopItem[]) => {
            setResult([])
            response.forEach((shopItem: IShopItem) => {
                setResult((prev) => [...prev, ShopItem(shopItem, true)])
            });
        }))
    }, [])

    return <CheckAuth><div>
        <div className="m-2 p-2 fs-3 text-center">
            Изменение предметов магазина баллов
        </div>
        <div className="row justify-content-center gx-2 gy-2 my-3">
        <Button variant="outlined" className="col-12 col-md-5 mx-1" href="/shop/add/public">Создать открытый</Button>
        <Button variant="outlined" className="col-12 col-md-5 mx-1" href="/shop/add/prvt">Создать приватный</Button>
        </div>
        <>{result}</>
    </div>
    </CheckAuth>
}
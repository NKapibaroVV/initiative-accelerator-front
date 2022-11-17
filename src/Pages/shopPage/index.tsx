import { useEffect, useState } from "react"
import { IShopItem } from "../../interfaces/shopItem"
import IShopLogItem from "../../interfaces/shopLogItem";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import preloader from "../../Modules/preloader"
import ShopItem from "../../Modules/ShopItem"
import { useGlobalUserState } from "../../Modules/User/User";

export default function ShopPage() {

    const currentUser = useGlobalUserState();

    const [result, setResult] = useState([preloader])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_shop_items/`).then(resp => resp.json().then((response: IShopItem[]) => {
            setResult([])
            let items: IShopItem[] | null = null;
            items = response;
            if (Object.keys(response).length < 1) {
                setResult([<div key="nu" className="text-center">Магазин баллов пуст...</div>])
            } else {
                fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_my_shop_logs/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",

                    body: JSON.stringify({ token: currentUser.userParams.token })
                }).then(res => res.json().then((resp: IShopLogItem[]) => {
                    if (!!items) {
                        resp.forEach((shopLogItem: IShopLogItem) => {
                            for (let index = 0; index < items!.length; index++) {
                                const shopItem = items![index];
                                if (!!shopItem && shopLogItem.shop_item_id == shopItem.id) {
                                    delete items![index];
                                }
                            }
                        })

                        let elementsCounter: number = 0;
                        let newItems: IShopItem[] | null;
                        items.forEach((shopItem: IShopItem) => {
                            elementsCounter += 1;
                        });
                        if (elementsCounter < 1) {
                            setResult([<div key="nu" className="text-center">Нет доступных для обмена позиций...</div>])
                        } else {
                            items.forEach((shopItem: IShopItem) => {
                                if (!!shopItem && !!shopItem.title) {
                                    setResult((prev) => [...prev, ShopItem(shopItem)])
                                }
                            });
                        }
                    }
                }))

            }
        }))
    }, [])

    return <CheckAuth><div>
        <div className="m-2 p-2 fs-3">
            У Вас {currentUser.userParams.score} баллов
        </div>
        <>{result}</>
    </div>
    </CheckAuth>
}
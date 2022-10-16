import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { IShopItem } from "../../interfaces/shopItem";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { useGlobalUserState } from "../../Modules/User/User";

export default function EditShopItemPage() {

    const { item_id } = useParams();
    const user = useGlobalUserState();
    let costRef = React.createRef<HTMLInputElement>();
    let titleRef = React.createRef<HTMLInputElement>();
    let descriptionRef = React.createRef<HTMLInputElement>();
    let deadlineTakeDateRef = React.createRef<HTMLInputElement>();
    let deadlineTakeTimeRef = React.createRef<HTMLInputElement>();
    let usersLimitRef = React.createRef<HTMLInputElement>();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_shop_item_params/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token, item_id: item_id })
        }).then(resp => resp.json().then((res: IShopItem[]) => {
            let response = res[0];
            costRef.current!.value = response.cost.toString();
            titleRef.current!.value = response.title;
            descriptionRef.current!.value = response.description;
            console.log({0:response.deadline_take,1:new Date(response.deadline_take!).toLocaleDateString()})
            deadlineTakeDateRef.current!.value = !!response.deadline_take ? `${new Date(response.deadline_take).toLocaleDateString().split(".")[2]}-${new Date(response.deadline_take).toLocaleDateString().split(".")[1]}-${new Date(response.deadline_take).toLocaleDateString().split(".")[0]}` : "";
            deadlineTakeTimeRef.current!.value = !!response.deadline_take ? new Date(response.deadline_take).toLocaleTimeString() : "";
            usersLimitRef.current!.value = !!response.users_limit ? response.users_limit.toString() : "";
        }))
    }, [])

    function updateShopItem() {



        let reqBody: any = { token: user.userParams.token, item_id:item_id }
        reqBody["cost"] = costRef.current!.value;
        reqBody["title"] = titleRef.current!.value;
        reqBody["description"] = descriptionRef.current!.value;
        !!deadlineTakeDateRef.current!.value && !!deadlineTakeTimeRef.current!.value ? reqBody["deadline_take"] = new Date(deadlineTakeDateRef.current!.value + deadlineTakeTimeRef.current!.value).getTime() : console.log("deadline_take is null");
        !!usersLimitRef.current!.value ? reqBody["users_limit"] = usersLimitRef.current!.value : console.log("users_limit is null");
        if (costRef.current!.value.length > 0 && titleRef.current!.value.length > 0 && descriptionRef.current!.value.length > 0) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/update_shop_item/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify(reqBody)
            }).then(resp => resp.json().then((response) => {
                alert("Обновлено!");
                document.location.assign("/shop/edit");
            }))
        } else {
            alert("Не выполнено! Проверьте правильность заполнения полей!");
        }

    }

    return <CheckModerator><div>
        <h3>Обновление позиции магазина</h3>
        <div className="row g-2">
            <div className="col-12">
                <label>Заголовок</label>
                <input name="title" type="text" className="w-100 p-2" placeholder="Заголовок" ref={titleRef}></input>
            </div>
            <div className="col-12">
                <label>Описание</label>
                <input name="description" type="text" className="w-100 p-2" placeholder="Описание" ref={descriptionRef}></input>
            </div>
            <div className="col-12">
                <label>Цена</label>
                <input name="cost" type="number" className="w-100 p-2" placeholder="Цена" ref={costRef}></input>
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Можно купить до:</label>
                <input type="date" className="form-control my-2" ref={deadlineTakeDateRef} />
                <input type="time" className="form-control my-2" ref={deadlineTakeTimeRef} />
            </div>
            <div className="col-12">
                <label htmlFor="inputDate">Ограничение по кол-ву покупок:</label>
                <input type="number" className="form-control my-2" ref={usersLimitRef} />
            </div>
            <div className="fs-6">
                *Поля "Можно купить до:" и "Ограничение по кол-ву покупок:" оставьте пустыми для снятия ограничений
            </div>
            <div className="col-12">
                <div className="w-100 p-2 btn btn-outline-info" onClick={updateShopItem}>
                    Обновить до текущих значений
                </div>
            </div>
        </div>
    </div></CheckModerator>
}
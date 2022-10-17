import { IShopItem } from "../../interfaces/shopItem";
import { useGlobalUserState } from "../User/User";

export default function ShopItem(props: IShopItem, editButton?: boolean) {
    const user = useGlobalUserState();

    function secondButtonAction() {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/buy_shop_item/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token, shop_item_id: props.id })
        }).then(res => res.text().then((response) => {
            alert(response);
            document.location.reload();
        }))
    }

    return <div key={props.id}>
        <div className="row text-black g-2 py-4">
            <div className="col-12">
                <div className="bg-info rounded-4 w-100 h-100 p-2">
                    <div className="fs-5 fw-bold ps-2">
                        {props.title}
                    </div>
                    <div className="text-start fs-6 fst-italic">
                        -{props.cost} баллов
                    </div>
                    <div className="text-end fs-6 fst-italic">
                        <>{!!props.deadline_take ? `Доступно до ${new Date(props.deadline_take).toLocaleString()}` : "Без ограничения по времени"}</>
                    </div>
                    <div className="text-end fs-6 fst-italic">
                        <>{!!props.users_limit ? `Осталось ${props.users_limit - props.users_taken}` : "Без ограничения по количеству"}</>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="d-block">
                    <div className="w-100 h-100">
                        <div className="d-block ms-auto" style={{ width: "fit-content" }}>
                            <button className={`btn-info btn mx-3`} type="button" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                Описание
                            </button>

                            {!!editButton ? <></> : <>
                                <div className={`btn ms-auto btn-outline-info `} onClick={secondButtonAction}>
                                    Обменять баллы
                                </div>
                            </>}

                            {!!editButton ? <>
                                <div className={`btn ms-auto btn-outline-info `} onClick={() => { document.location.assign(`/shop/edit/${props.id}`) }}>
                                    Редактировать
                                </div>
                                <div className={`btn ms-auto btn-outline-info `} onClick={() => { document.location.assign(`/shop/stat/${props.id}`) }}>
                                    Статистика
                                </div>
                            </> : <></>}

                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="offcanvas offcanvas-bottom text-black offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title}`}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body small">{props.description}
            </div>
        </div>
    </div>
}
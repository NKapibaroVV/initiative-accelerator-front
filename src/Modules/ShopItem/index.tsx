import { Button, Card } from "@mui/material";
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
        <Card variant="outlined" className="row g-2 py-1 my-2" sx={{
            borderRadius: 2
        }}>
            <div className="col-12">
                <div className="w-100 h-100 p-2">
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
                    <div className="row g-3 justify-content-center">
                        <div className={`col-4`}>
                            <Button variant="outlined" className="w-100" type="button" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                Описание
                            </Button>

                        </div>

                        {!!editButton ? <></> :
                            <div className={`col-4`}>
                                <Button variant="outlined" className="w-100" onClick={secondButtonAction}>
                                    Обменять баллы
                                </Button>

                            </div>}

                        {!!editButton ? <>
                            <div className={`col-4`}>
                                <Button variant="outlined" className="w-100" onClick={() => { document.location.assign(`/shop/edit/${props.id}`) }}>
                                    Редактировать
                                </Button>
                            </div>

                            <div className={`col-4`}>
                                <Button variant="outlined" className="w-100" onClick={() => { document.location.assign(`/shop/stat/${props.id}`) }}>
                                    Статистика
                                </Button>
                            </div>

                        </> : <></>}

                    </div>
                </div>
            </div>
        </Card>
        <div className="offcanvas offcanvas-bottom text-primary offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title}`}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body small">{props.description}
            </div>
        </div>
    </div>
}
import { Card } from "@mui/material";
import IShopLogItem from "../../interfaces/shopLogItem";

export default function ShopLogItem(props: IShopLogItem) {
    return <Card variant="outlined" className="my-3" key={props.id} sx={{
        borderRadius:2
    }}>
        <div className="p-2">
            <div className="fs-5 fw-bold ps-2">
                {props.title}
            </div>
            <div className="text-start fs-6 fst-italic">
                -{props.cost} баллов
            </div>
            <div className="text-end fs-6 fst-italic">
                <>{`ID обмена : ${props.identifer}`}</>
            </div>
            <div className="text-end fs-6 fst-italic">
                <>{`ID объекта : ${props.shop_item_id}`}</>
            </div>
            <div className="text-end fs-6 fst-italic">
                <>{`Время: ${new Date(props.time).toLocaleString()}`}</>
            </div>
        </div>
    </Card>
}
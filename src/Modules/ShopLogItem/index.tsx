import IShopLogItem from "../../interfaces/shopLogItem";

export default function ShopLogItem(props: IShopLogItem) {
    return <div className="my-3" key={props.id}>
        <div className="bg-info text-dark rounded-4 w-100 h-100 p-2">
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
    </div>
}
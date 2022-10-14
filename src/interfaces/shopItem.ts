export interface IShopItem {
    "id": number,
    "cost": number,
    "title": string,
    "description": string,
    "deadline_take": null|number,
    "users_limit": null|number,
    "users_taken": number,
}
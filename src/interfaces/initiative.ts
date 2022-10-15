export enum initiativeCategory {
    "Ответственность" = "Ответственность",
    "Целеустремлённость" = "Целеустремлённость",
    "Конкурентоспособность" = "Конкурентоспособность",
    "Грамотность" = "Грамотность",
    "Инициативность" = "Инициативность",
    "Креативность" = "Креативность"
}


export default interface Iinitiative {
    "id": string,
    "user_id"?: string,
    "category": initiativeCategory,
    "title": string,
    "content": string,
    "income": number,
    "deadline_take": number,
    "deadline_complete": number,
    "users_limit": number | null,
    "users_taken": number,
    "initiative_id"?: string, //только в начатых
    "checked"?: 0 | 1, //только в сданных
    "comment"?: string //только в сданных
}
import { userRoles } from "../enums/userRoles";

export default interface IUser {
    name: string,
    surname: string,
    email: string,
    id: string,
    token: string,
    birth: Date,
    role: userRoles,
    score: number,
    avatarURI?: string | null,
    edu_group: string | null,
    email_verified:0|1,
    notifs_checked:0|1
}
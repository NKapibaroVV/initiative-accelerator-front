import { stat } from 'fs';
import React, { Children, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { getCookie, setCookie } from 'typescript-cookie'
/**Интерфейс provider'а данных о пользователе */
export interface IUserProviderProps {
    children: React.ReactNode
}
/**Интерфейс пользователя */
export interface IUser {
    name: string,
    surname: string,
    email: string,
    login:string,
    id:string,
    token:string,
    birth:Date,
    role:userRoles,
    score:number
}
export enum userRoles{
    "Администратор"="Администратор","Студент"="Студент", "default"="default", "Модератор"="Модератор"
}

/**Параметры пользователя по умолчанию*/
export let defaultUserParams: IUser = {
    name:"default",
    surname:"default",
    email:"default",
    login:"default",
    id:"default",
    token:"default",
    role:userRoles.default,
    birth:new Date("2000-01-01"),
    score:0
}

/**Интерфейс для контекста пользователя */
export interface IUserContext {
    userParams: IUser,
    UpdateUser: React.Dispatch<React.SetStateAction<IUser>>
}




/**Контекст с параметрами пользователя */
export const globalUserContext = React.createContext<IUserContext>({ userParams: defaultUserParams, UpdateUser: ()=>{}  });
/**
 * Функция оборачивает дочерние элементы в контекст пользователя
 * @param props
 */
export const GlobalUserStateContextProvider = (props: IUserProviderProps) => {
    
    if (getCookie("userData")) {
        defaultUserParams = JSON.parse(decodeURI(getCookie("userData")!))
    }

    
    const [state, dispatch] = useState(defaultUserParams);
    async function updateUserFromServer() {
        await fetch(`${process.env.BACKEND_SERVER_DOMAIN}/api/get_me`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "token":defaultUserParams.token })
        }).then((resp=>resp.json())).then((user:IUser)=>{
            if (state!=user) {
                setCookie("userData", JSON.stringify(user),{expires:new Date(new Date().getTime()+60*60000)});
            }
        })
    }
    updateUserFromServer();
    return (
        <globalUserContext.Provider value={{ userParams: state, UpdateUser: dispatch }}>
                {props.children}
        </globalUserContext.Provider>
    );
}

/**Хук для просмотра и изменения параметров пользователя */
export const useGlobalUserState = () => {
    return (React.useContext(globalUserContext));
};
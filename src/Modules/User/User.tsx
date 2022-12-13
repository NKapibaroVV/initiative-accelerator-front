import React, { Children, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { userRoles } from '../../enums/userRoles';
import IUser from '../../interfaces/user';
/**Интерфейс provider'а данных о пользователе */
export interface IUserProviderProps {
    children: React.ReactNode
}
/**Интерфейс пользователя */



/**Параметры пользователя по умолчанию*/
export let defaultUserParams: IUser = {
    name: "default",
    surname: "default",
    email: "default",
    id: "default",
    token: "default",
    role: userRoles.default,
    birth: new Date("2000-01-01"),
    edu_group: null,
    avatarURI: null,
    score: 0,
    email_verified:0,
    notifs_checked:1
}

/**Интерфейс для контекста пользователя */
export interface IUserContext {
    userParams: IUser,
    UpdateUser: React.Dispatch<React.SetStateAction<IUser>>
}




/**Контекст с параметрами пользователя */
export const globalUserContext = React.createContext<IUserContext>({ userParams: defaultUserParams, UpdateUser: () => { } });
/**
 * Функция оборачивает дочерние элементы в контекст пользователя
 * @param props
 */
export const GlobalUserStateContextProvider = (props: IUserProviderProps) => {

    if (!!localStorage.getItem("userData")) {
        defaultUserParams = JSON.parse(localStorage.getItem("userData")!)
    }


    const [state, dispatch] = useState(defaultUserParams);
    async function updateUserFromServer() {
        await fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_me/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({ "token": defaultUserParams.token })
        }).then(resp => resp.json()).then((user: IUser) => {
            if (state != user) {
                localStorage.setItem("userData", JSON.stringify(user))
                if (state!=JSON.parse(localStorage.getItem("userData")!)) {
                    dispatch(user);
                }
            }

        }).catch((err) => {
            localStorage.clear();
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
import { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Iinitiative from "../../interfaces/initiative";
import IShopLogItem from "../../interfaces/shopLogItem";
import { initiativeProgress } from "../../Modules/initiativeBrick";
import preloader from "../../Modules/preloader";
import { IUser, useGlobalUserState } from "../../Modules/User/User";

export default function CheckUserInfoPage() {
    const { user_id } = useParams();
    const currentUser = useGlobalUserState();

    const [sumBalance, setSumBalance] = useState(0);

    let allInitiatives: { [id: string]: Iinitiative } = {};
    let takenInitiatives: { [id: string]: Iinitiative } = {};
    let completedInitiatives: { [id: string]: Iinitiative } = {};

    const [completedInitiativesBriks, setCompletedInitiativesBriks] = useState([preloader]);
    const [startedInitiativesBriks, setStartedInitiativesBriks] = useState([preloader]);
    const [notStartedInitiativesBriks, setNotStartedInitiativesBriks] = useState([preloader]);
    const [shopLogs, setShopLogs] = useState([preloader]);

    let firstNameRef = createRef<HTMLTableCellElement>();
    let secondNameRef = createRef<HTMLTableCellElement>();
    let loginRef = createRef<HTMLTableCellElement>();
    let emailRef = createRef<HTMLTableCellElement>();
    let groupRef = createRef<HTMLTableCellElement>();
    let birthRef = createRef<HTMLTableCellElement>();
    let roleRef = createRef<HTMLTableCellElement>();
    let scoreRef = createRef<HTMLTableCellElement>();
    let idRef = createRef<HTMLTableCellElement>();
    let summaryBalanceRef = createRef<HTMLTableCellElement>();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_user/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token, user_id: user_id })
        }).then(res => res.json().then(
            (response: any) => {
                firstNameRef.current!.innerText = response[0].name;
                secondNameRef.current!.innerText = response[0].surname;
                setSumBalance(response[0].score)
                scoreRef.current!.innerText = response[0].score;
                emailRef.current!.innerText = response[0].email;
                birthRef.current!.innerText = `${new Date(response[0].birth).toLocaleDateString().split(".")[2]}-${new Date(response[0].birth).toLocaleDateString().split(".")[1]}-${new Date(response[0].birth).toLocaleDateString().split(".")[0]}`
                groupRef.current!.innerText = `${!!response[0].edu_group ? response[0].edu_group : ""}`;
                roleRef.current!.innerText = response[0].role;
                loginRef.current!.innerText = response[0].login;
                idRef.current!.innerText = response[0].id;

                let userToken = response[0].token;

                fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiatives/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",

                    body: JSON.stringify({ token: userToken })
                }).then(resp => resp.json().then((response: Iinitiative[]) => {
                    response.forEach((element: Iinitiative) => {
                        allInitiatives[element.id] = element
                    });;

                    fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_taken_initiatives/`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: "POST",

                        body: JSON.stringify({ token: userToken })
                    }).then(resp => resp.json().then((response) => {
                        response.forEach((element: Iinitiative) => {
                            takenInitiatives[element.id] = element
                        });;


                        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_completed_initiatives/`, {
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            method: "POST",

                            body: JSON.stringify({ token: userToken })
                        }).then(resp => resp.json().then((response) => {
                            response.forEach((element: Iinitiative) => {
                                completedInitiatives[element.id] = element
                            });;

                            for (const key in takenInitiatives) {
                                if (Object.prototype.hasOwnProperty.call(allInitiatives, key)) {
                                    delete allInitiatives[key]
                                }
                            }

                            for (const key in completedInitiatives) {
                                if (Object.prototype.hasOwnProperty.call(takenInitiatives, key)) {
                                    delete takenInitiatives[key]
                                }
                            }

                            console.log({ allInitiatives, takenInitiatives, completedInitiatives })


                            setNotStartedInitiativesBriks([])
                            for (const key in allInitiatives) {
                                if (Object.prototype.hasOwnProperty.call(allInitiatives, key)) {
                                    const element = allInitiatives[key];
                                    setNotStartedInitiativesBriks((prev) => [...prev, <tr key={element.id}>
                                        <th scope="col">{element.category}</th>
                                        <th>{element.title}</th>
                                    </tr>])
                                }
                            }

                            setStartedInitiativesBriks([])
                            for (const key in takenInitiatives) {
                                if (Object.prototype.hasOwnProperty.call(takenInitiatives, key)) {
                                    const element = takenInitiatives[key];
                                    setStartedInitiativesBriks((prev) => [...prev, <tr key={element.id}>
                                        <th scope="col">{element.category}</th>
                                        <th>{element.title}</th>
                                    </tr>])
                                }
                            }

                            setCompletedInitiativesBriks([])
                            for (const key in completedInitiatives) {
                                if (Object.prototype.hasOwnProperty.call(completedInitiatives, key)) {
                                    const element = completedInitiatives[key];
                                    setCompletedInitiativesBriks((prev) => [...prev, <tr key={element.id}>
                                        <th scope="col">{element.category}</th>
                                        <th>{element.title}</th>
                                    </tr>])
                                }
                            }

                            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_my_shop_logs/`, {
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                method: "POST",

                                body: JSON.stringify({ token: userToken })
                            }).then(res => res.json().then((response: IShopLogItem[]) => {
                                setShopLogs([])
                                let spentMoney = 0;
                                response.forEach((shopLogItem: IShopLogItem) => {
                                    spentMoney += shopLogItem.cost;
                                    setShopLogs((prev) => [...prev, <tr key={shopLogItem.id}>
                                        <th scope="col">{shopLogItem.cost}</th>
                                        <th>{shopLogItem.title}</th>
                                        <th>{new Date(shopLogItem.time).toLocaleString()}</th>
                                    </tr>])
                                });
                                setSumBalance((prev) => Number.parseInt(prev.toString()) + spentMoney);

                            }))
                        }))
                    }
                    ))
                }

                )



                )


            }))


    }, [])

    return <>
        <div className="fs-3 m-2 p-2 text-center">
            Информация о пользователе
        </div>
        <div className="py-2">
            <div className="fs-5 m-2 p-2">
                Общая информация
            </div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Параметр</th>
                        <th>Значение</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="col">Имя</th>
                        <th ref={firstNameRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Фамилия</th>
                        <th ref={secondNameRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Дата рождения</th>
                        <th ref={birthRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Логин</th>
                        <th ref={loginRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Баланс</th>
                        <th ref={scoreRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Баланс за всё время</th>
                        <th>{sumBalance}</th>
                    </tr>
                    <tr>
                        <th scope="col">Почта</th>
                        <th ref={emailRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Идентификатор</th>
                        <th ref={idRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Группа</th>
                        <th ref={groupRef}>0000-0000</th>
                    </tr>
                    <tr>
                        <th scope="col">Роль</th>
                        <th ref={roleRef}>0000-0000</th>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className="py-2">
            <div className="fs-5 m-2 p-2">
                Завершенные инициативы
            </div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Категория</th>
                        <th>Заголовок</th>
                    </tr>
                </thead>
                <tbody>
                    {completedInitiativesBriks}
                </tbody>
            </table>
        </div>
        <div className="py-2">
            <div className="fs-5 m-2 p-2">
                Выполняемые инициативы
            </div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Категория</th>
                        <th>Заголовок</th>
                    </tr>
                </thead>
                <tbody>
                    {startedInitiativesBriks}
                </tbody>
            </table>
        </div>
        <div className="py-2">
            <div className="fs-5 m-2 p-2">
                Покупки
            </div>
            <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">Цена</th>
                        <th>Дата</th>
                        <th>Заголовок</th>
                    </tr>
                </thead>
                <tbody>
                    {shopLogs}
                </tbody>
            </table>
        </div>
    </>
}
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Iinitiative, { initiativeCategory } from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";

interface ICompletedRow {
    category: initiativeCategory
    checked: 0 | 1
    comment: string
    content: string
    deadline_complete: number
    deadline_take: number
    id: string
    identifer: number | string
    income: number
    initiative_id: string
    title: string
    user_id: string
    users_limit: number | null
    users_taken: number,
    email: string,
    birth: number,
    name: string,
    surname: string,
    login: string,
    edu_group:string|null,
}

export default function CheckInitiativePage() {
    const { initiative_id } = useParams();

    const user = useGlobalUserState();
    const [results, setResults] = useState([preloader])

    let rows: ICompletedRow[] = []

    const info = {
        title: "",
        deadline_take: 0,
        deadline_complete: 0,
        content: "",
        not_checked_count: 0,
        income: 0
    }


    const openResultButton = (props: ICompletedRow) => {
        function awardUser(penalty: number) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/award_user/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify({ token: user.userParams.token, initiative_id: props.initiative_id, user_id: props.user_id, penalty: penalty })
            }).then(res => res.json().then((response) => {
                if (response.success) {
                    if (Object.keys(rows).length < 2) {
                        document.location.assign("/initiatives/results")
                    } else {
                        document.location.reload();
                    }
                } else {
                    alert(response);
                }
            }))
        }

        return <>
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target={`#ofcanv${props.initiative_id}-${props.login}`} aria-controls={`#${props.initiative_id}-${props.login}`}>
                Check
            </button>

            <div className="offcanvas offcanvas-bottom text-bg-dark" style={{ height: "80%" }} tabIndex={-1} id={`ofcanv${props.initiative_id}-${props.login}`} aria-labelledby={`#label${props.initiative_id}-${props.login}`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`#label${props.initiative_id}-${props.login}`}>{props.title} - {props.email}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div>
                        {props.comment}
                    </div>
                    <div className="row g-2">
                        <div className="col-md-3 col-sm-6 col-12">
                            <div className="btn btn-outline-danger w-100" onClick={() => { awardUser(100) }}>
                                Не выполнено
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12">
                            <div className="btn btn-outline-danger w-100" onClick={() => { awardUser(50) }}>
                                Выполнено не в срок
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12">
                            <div className="btn btn-outline-warning w-100" onClick={() => { awardUser(25) }}>
                                Выполнено не кач-но
                            </div>
                        </div>
                        <div className="col-md-3 col-sm-6 col-12">
                            <div className="btn btn-outline-success w-100" onClick={() => { awardUser(0) }}>
                                Выполнено верно
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    const resultRow = (props: ICompletedRow[]) => {
        let rowsElements: JSX.Element[] = []

        let counter: number = 1;
        props.forEach(row => {
            rowsElements.push(<tr key={`0${counter}-row`}>
                <th scope="row">{counter}</th>
                <td>{row.name}</td>
                <td>{row.surname}</td>
                <td>{!!row.edu_group&&row.edu_group?.length>1?row.edu_group:"Не указано"}</td>
                <td>{row.email}</td>
                <td>{openResultButton(row)}</td>
            </tr>)
            counter += 1;
        });
        return rowsElements
    }


    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiative_results/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ token: user.userParams.token, initiative_id })
        }).then(res => res.json().then((response: ICompletedRow[]) => {
            setResults([]);

            console.log(response)
            rows = response;
            info.content = rows[0].content;
            info.title = rows[0].title;
            info.deadline_take = rows[0].deadline_take;
            info.deadline_complete = rows[0].deadline_complete;
            info.not_checked_count = Object.keys(rows).length;
            info.income = rows[0].income;
            setResults([<div key="000">
                Название: {info.title}
            </div>,
            <div key="001">
                Награда: {info.income} баллов
            </div>,
            <div key="002">
                Сдать до: {new Date(info.deadline_complete).toLocaleString()}
            </div>,
            <div key="003">
                Взять до: {new Date(info.deadline_take).toLocaleString()}
            </div>,
            <div key="004">
                Проверить: {info.not_checked_count} решений
            </div>,
            <div key="005">
                Описание: {info.content}
            </div>])

            const table = <table className="table table-dark">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Имя</th>
                        <th scope="col">Фамилия</th>
                        <th scope="col">Группа</th>
                        <th scope="col">Почта</th>
                        <th scope="col">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {resultRow(rows)}
                </tbody>
            </table>

            setResults((prev) => [...prev, <>
                {table}
            </>])
        }))
    }, [])
    return <CheckModerator>
        <>
            {results}
        </>
    </CheckModerator>
}
import React, { useEffect, useState } from "react";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import { useGlobalUserState } from "../../Modules/User/User";

function RatingPage() {
    const user = useGlobalUserState();

    const [userStat, setUserStat] = useState({pos:<div className="spinner-grow text-light" role="status">
    <span className="visually-hidden">Loading...</span>
</div>,score:<div className="spinner-grow text-light" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>})

    const [ratingTableBody, setRatingTableBody] =useState([<tr key={`${new Date().getTime()}`}></tr>]);

    function arrayToTable(array:{name: string, surname: string, score: number}[]){
        let tableRows:JSX.Element[] = [];

        let pos:number = 1;
        array.forEach(user => {
            tableRows.push(<tr key={`${user.name}-${user.score}-${pos}`}>
                <th scope="row">{pos}</th>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.score}</td>
            </tr>)
            pos++;
        });

        return tableRows;
    }
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_personal_rating`, {
            headers: {
                'Content-Type': 'application/json'
            },
            
            method: "POST",
            body: JSON.stringify({ token: user.userParams.token })
        }).then((result) => result.json()).then(({ position, score }) => {
            setUserStat({pos:position, score:score})
        })


        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_global_rating`
        ).then(response=>response.json()).then((ratingArray)=>{setRatingTableBody(arrayToTable(ratingArray))})
    }, [])


    return <>
    <CheckAuth>
    <div className="py-4">
            <div className="fs-4 text-center">
                Рейтинг
            </div>
            <div className="p-2 m-2 bg-secondary rounded-4 mx-auto" style={{ maxWidth: "300px" }}>
                <div className="row justify-content-center fs-5 g-2">
                    <div className="col-6">
                        <div className="text-center">
                            <div>
                                {userStat.pos}
                            </div>
                            Позиция
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="text-center">
                            <div>
                                {userStat.score}
                            </div>
                            Баллов
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-4 text-center">
                <table className="table table-dark table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Позиция</th>
                            <th scope="col">Имя</th>
                            <th scope="col">Фамилия</th>
                            <th scope="col">Баллов</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ratingTableBody}
                    </tbody>
                </table>
            </div>
        </div>
    </CheckAuth>
    </>
}

export default RatingPage;
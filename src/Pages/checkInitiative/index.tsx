import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { IBrickProps } from "../../Modules/initiativeBrick";
import { useGlobalUserState } from "../../Modules/User/User";

function CheckInitiative() {

    let userCounter:number = 1;
    const user = useGlobalUserState();
    const { initiativeObj } = useParams();
    const currentInitiative: IBrickProps = JSON.parse(decodeURI(initiativeObj!));

    const [initiativeResults, setInitiativeResults] = useState([<tr key={`00187841`}><th scope="col">Ещё никто не сделал...</th></tr>]);

    let msgButton = (props: { message: string, id: string, userId:string, userSurname:string, userName:string, userLogin:string }) => {

        let closeCanvRef = React.createRef<HTMLButtonElement>();
        function awardUser(penalty?:number){

            const awardBody = ()=>{
                if (penalty) {
                    return { token: user.userParams.token, user_id:props.userId, initiative_id:props.id, penalty:penalty }
                }else{
                    return { token: user.userParams.token, user_id:props.userId, initiative_id:props.id }
                }
            }
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/award_user`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                
                body: JSON.stringify(awardBody())
            }).then((result) => result.json()).then((respJson) => {
                if(respJson["success"]){
                    console.log(props.message)
                    alert("Баллы выданы пользователю! Рекомендуем сохранить текст его ответа, он более не будет доступен!")
                    document.location.reload();
                }else{
                    alert("Не удалось назначить пользователю награду!")
                }
            })
        }
        return <>

            <button className="btn btn-primary p-1" type="button" data-bs-toggle="offcanvas" data-bs-target={`#p0-${props.id}`} aria-controls={`pb0-${props.id}`}>Открыть решение</button>
            <div className="offcanvas offcanvas-bottom offcanvas-60vh" tabIndex={-1} id={`p0-${props.id}`} aria-labelledby={`pb0-${props.id}`}>
                <div className="offcanvas-header text-dark">
                    <h5 className="offcanvas-title" id={`pb0-${props.id}`}>{currentInitiative.title} - {props.userSurname} {props.userName} ({props.userLogin})</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" ref={closeCanvRef} ></button>
                </div>
                <div className="offcanvas-body small text-dark">
                    {props.message}
                    <div className="py-3">
                        <div className="row g-2">
                            <div className="col-md-3 col-12"><div className="btn btn-outline-success w-100" onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");awardUser()}}>Выполнено</div></div>
                            <div className="col-md-3 col-12"><div className="btn btn-outline-warning w-100" onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");awardUser(25)}}>Выполнено некачественно</div></div>
                            <div className="col-md-3 col-12"><div className="btn btn-outline-danger w-100" onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");awardUser(50)}}>Выполнено не в срок</div></div>
                            <div className="col-md-3 col-12"><div className="btn btn-dark w-100" onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");awardUser(100)}}>Не выполнено</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiative_results`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            
            body: JSON.stringify({ token: user.userParams.token, "id": currentInitiative.id })
        }).then((result) => result.json()).then((userInitiativeJson) => {
            if (Object.keys(userInitiativeJson).length > 0) {
                setInitiativeResults([<tr key={`98477948273423`}></tr>]);
                userInitiativeJson.forEach((element: 
                    {"id":string,"initiative_id":string,"user_id":string,"message":string,"time":number,"name":string,"surname":string,"email":string,"login":string}
                ) => {
                    console.log(element.time)
                    setInitiativeResults((prevState) => [...prevState,

                    <tr key={element.id}>
                        <th scope="col">{userCounter}</th>
                        <td>{element.id}</td>
                        <td>{element.name}</td>
                        <td>{element.surname}</td>
                        <td>{element.login}</td>
                        <td className={`${new Date(element.time).getTime()>currentInitiative.deadLine?"fw-bold text-danger":""}`}>{new Date(element.time).toLocaleDateString()} {new Date(element.time).toLocaleTimeString()}</td>
                        <td>{msgButton({message: element.message, id:element.initiative_id, userId:element.user_id, userName:element.name, userSurname:element.surname, userLogin:element.login})}</td>
                    </tr>]);

                    userCounter++;
                });
            }
        })
    }, [])

    return <>
        <CheckModerator>
            <>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">Название:</div> {currentInitiative.title}
                </div>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">Идентификатор:</div> {currentInitiative.id}
                </div>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">Категория:</div> {currentInitiative.category}
                </div>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">Крайний срок:</div> {new Date(currentInitiative.deadLine).toLocaleDateString()} {new Date(currentInitiative.deadLine).toLocaleTimeString()}
                </div>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">За выполнение:</div> {currentInitiative.income} баллов
                </div>
                <div className="mx-auto py-2 my-1">
                    <div className="fw-bold fs-5">Описание задания:</div> {currentInitiative.offcanvasContent}
                </div>

                <table className="table table-dark">
                    <thead>
                        <tr>
                            <th scope="col">№</th>
                            <th scope="col">id</th>
                            <th scope="col">Имя</th>
                            <th scope="col">Фамилия</th>
                            <th scope="col">Логин</th>
                            <th scope="col">Время</th>
                            <th scope="col">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initiativeResults}
                    </tbody>
                </table>
            </>
        </CheckModerator>
    </>
}
export default CheckInitiative;
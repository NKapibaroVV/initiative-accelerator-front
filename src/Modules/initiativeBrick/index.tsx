import React, { createRef } from "react";
import Iinitiative from "../../interfaces/initiative";
import { useGlobalUserState } from "../User/User";
import { Button, Card, Paper, Typography } from "@mui/material";

export enum initiativeProgress {
    "notStarted" = "notStarted",
    "started" = "started",
    "completed" = "completed",
    "admin" = "admin",
    "edit" = "edit"
}



function InitiativeBrick(props: Iinitiative, progress: initiativeProgress) {
    const user = useGlobalUserState();

    let sendCanvasRef = React.createRef<HTMLDivElement>();
    let sendInputRef = React.createRef<HTMLTextAreaElement>();

    let startInitiative = () => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/start_initiative/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token, initiative_id: props.id })
        }).then(resp => resp.text().then((response) => {
            alert(response)
            document.location.reload();
        }))
    }

    let sendInitiative = () => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/complete_initiative/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token, initiative_id: props.id, comment: `${sendInputRef.current!.value}` })
        }).then((resp) => {
            console.log(resp);
            document.location.reload();
        })
    }

    let secondButtonAction = () => {
        switch (progress) {
            case initiativeProgress.notStarted:
                startInitiative();
                break;
            case initiativeProgress.started:
                sendCanvasRef.current?.classList.add("show");
                break;
            case initiativeProgress.completed:
                alert("completed")
                break;
            case initiativeProgress.admin:
                document.location.assign(`/initiatives/check/${props.id}`)
                break;
            case initiativeProgress.edit:
                document.location.assign(`/initiatives/edit/${props.id}`)
                break;
        }
    }

    return <div key={props.id}>
        <Card variant="outlined" sx={{
            borderRadius: 4,
            marginTop: 1.5,
        }}>
            <div className="row text-primary g-2 py-2">
                <div className="col-12">
                    <div className="row p-3 gx-3 gy-4">
                        <Typography className="col-12 text-center fs-4" mt={2}>
                            {props.title}
                        </Typography>

                        <Typography className="col-6 text-center">
                            <>Выполнить до {new Date(props.deadline_complete).toLocaleDateString()} {new Date(props.deadline_complete).toLocaleTimeString()}</>
                        </Typography>
                        <Typography className="col-6 text-center m-auto">
                            +{props.income} баллов
                        </Typography>
                        <Typography className="col-12 text-center" mt={2}>
                            <>Взяли {props.users_taken} из {!!props.users_limit ? props.users_limit : "∞"} пользователей</>
                        </Typography>
                    </div>
                </div>
                <div className="col-12">
                    <div className="d-block">
                        <div className="w-100 h-100">
                            <div className="row g-2 justify-content-center px-2">
                                <Button variant="outlined" className="col-5 mb-2 ms-2 p-0">
                                    <div className="w-100 h-100 p-1" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                        Описание
                                    </div>
                                </Button>
                                <Button variant="outlined" className={`col-5 me-2 mb-2 ms-2 ${!!props.link ? "" : "d-none"}`} href={props.link}>
                                    ВК
                                </Button>
                                <Button variant="outlined" className={` btn col-5 ${progress == initiativeProgress.edit ? "" : "d-none"}`} href={`/initiatives/stat/${props.id}`}>
                                    Статистика
                                </Button>
                                <Button variant="outlined" className={`col-10 mb-2 ${progress == initiativeProgress.completed ? "d-none" : ""}`} onClick={secondButtonAction}>
                                    {progress == initiativeProgress.edit ? "Редактировать" : progress == initiativeProgress.completed ? "Просмотреть" : progress == initiativeProgress.started ? "Сдать" : progress == initiativeProgress.notStarted ? "Начать" : "Проверить"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="offcanvas offcanvas-bottom text-primary offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title}`}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">{props.content}
                </div>
            </div>

            <div className="offcanvas offcanvas-bottom text-primary offcanvas-60vh" ref={sendCanvasRef} tabIndex={-1} id={`res${props.id}Send`} aria-labelledby={`res${props.id}SendLabel`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`res${props.id}SendLabel`}>{`${props.title}`}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" onClick={() => { sendCanvasRef.current?.classList.remove("show"); }} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <div className="row g-2 justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="form-floating">
                                <textarea className="form-control w-100" ref={sendInputRef} placeholder="Ваше сообщение" id={`res${props.id}Comment`} style={{ height: "200px" }}></textarea>
                                <label htmlFor={`res${props.id}Comment`}>Ваше сообщение</label>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <Button variant="outlined" className="w-100" onClick={sendInitiative}>
                                Отправить!
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

        </Card >
    </div>
}

export default InitiativeBrick;
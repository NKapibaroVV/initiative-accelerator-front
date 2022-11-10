import React, { createRef, useEffect } from "react";
import Iinitiative from "../../interfaces/initiative";
import { useGlobalUserState } from "../User/User";
import { Button, Card, Paper, Typography } from "@mui/material";
import { SendSharp } from "@mui/icons-material";

export enum initiativeProgress {
    "notStarted" = "notStarted",
    "started" = "started",
    "completed" = "completed",
    "admin" = "admin",
    "edit" = "edit"
}



function InitiativeBrick(props: Iinitiative, progress: initiativeProgress) {
    const user = useGlobalUserState();

    let startInitiativeCanvasRef = React.createRef<HTMLDivElement>();
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
                startInitiativeCanvasRef.current?.classList.add("show");
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

    return <div key={props.id} id={`brick_${props.id}`}>
        <Card variant="outlined" sx={{
            borderRadius: 2,
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
                            <div className="row g-2 justify-content-center mx-3">
                                <div className="col-12">
                                    <Button variant="outlined" className="w-100" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                        Описание
                                    </Button>
                                </div>
                                <div className={`col-12 ${!!props.link ? "" : "d-none"}`} >
                                    <Button variant="outlined" className="w-100" href={props.link}>
                                        ВК
                                    </Button>
                                </div>
                                <div className={`col-12 ${progress == initiativeProgress.edit ? "" : "d-none"}`}>
                                    <Button variant="outlined" className="w-100" href={`/initiatives/stat/${props.id}`}>
                                        Статистика
                                    </Button>
                                </div>
                                <div className={`col-12 ${progress == initiativeProgress.completed ? "d-none" : ""}`}>
                                    <Button variant="outlined" className="w-100" onClick={secondButtonAction}>
                                        {progress == initiativeProgress.edit ? "Редактировать" : progress == initiativeProgress.completed ? "Просмотреть" : progress == initiativeProgress.started ? "Сдать" : progress == initiativeProgress.notStarted ? "Начать" : "Проверить"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {progress == initiativeProgress.notStarted ? <div className={`offcanvas offcanvas-bottom text-primary offcanvas-60vh`} ref={startInitiativeCanvasRef} tabIndex={-1} id={`start${props.id}`} aria-labelledby={`start${props.id}Label`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`start${props.id}Label`}>{`${props.title}`}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" onClick={() => { startInitiativeCanvasRef.current?.classList.remove("show"); }} aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">
                    <p className="fs-5">Нажимая "Начать", вы берёте на себя ответственность за качественное и своевременное выполнение задания.</p>
                    <p className="fs-5">Эта операция не может быть отменена позже.</p>
                    <br />
                    <p className="fs-5">О задании:</p>
                    <div>
                        <Typography className="">
                            <>Выполнить до {new Date(props.deadline_complete).toLocaleDateString()} {new Date(props.deadline_complete).toLocaleTimeString()}</>
                        </Typography>
                        <Typography className=" m-auto">
                            +{props.income} баллов
                        </Typography>
                        <Typography className="" mt={2}>
                            <>Взяли {props.users_taken} из {!!props.users_limit ? props.users_limit : "∞"} пользователей</>
                        </Typography>
                    </div>
                </div>
                <div className="">
                    <div className="row g-2 py-1 px-1">
                        <div className="col-12 col-md-6">
                            <Button variant="contained" className="w-100" color="success"
                                onClick={() => {
                                    startInitiativeCanvasRef.current?.classList.remove("show");
                                }}>Отказаться</Button>
                        </div>
                        <div className="col-12 col-md-6">
                            <Button variant="outlined" className="w-100" color="warning"
                                onClick={() => {
                                    startInitiative();
                                }}>Начать</Button>
                        </div>
                    </div>
                </div>
            </div> : <></>}

            <div className="offcanvas offcanvas-bottom text-primary offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title}`}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body small">{props.content}
                </div>
            </div>

            {progress == initiativeProgress.started ? <div className="offcanvas offcanvas-bottom text-primary offcanvas-60vh" ref={sendCanvasRef} tabIndex={-1} id={`res${props.id}Send`} aria-labelledby={`res${props.id}SendLabel`}>
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
                            <Button variant="outlined" className="w-100" onClick={sendInitiative} endIcon={<SendSharp />}>
                                Отправить
                            </Button>
                        </div>
                    </div>
                </div>
            </div> : <></>}

        </Card >
    </div>
}

export default InitiativeBrick;
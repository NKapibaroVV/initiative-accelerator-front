import React, { createRef } from "react";
import Iinitiative from "../../interfaces/initiative";
import { useGlobalUserState } from "../User/User";

export enum initiativeProgress {
    "notStarted" = "notStarted",
    "started" = "started",
    "completed" = "completed",
    "admin" = "admin"
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
        }).then(resp => resp.text().then((response)=>{
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
        }
    }

    return <div key={props.id}>
        <div className="row text-black g-2 py-4">
            <div className="col-12">
                <div className="bg-info rounded-4 w-100 h-100 p-2">
                    <div className="fs-5 fw-bold ps-2">
                        {props.title}
                    </div>
                    <div className="text-start fs-6 fst-italic">
                        +{props.income} баллов
                    </div>
                    <div className="text-end fs-6 fst-italic">
                        <>Выполнить до {new Date(props.deadline_complete).toLocaleDateString()} {new Date(props.deadline_complete).toLocaleTimeString()}</>
                    </div>
                    <div className="text-end fs-6 fst-italic">
                        <>Взяли {props.users_taken} из {!!props.users_limit?props.users_limit:"∞"} пользователей</>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="d-block">
                    <div className="w-100 h-100">
                        <div className="d-block ms-auto" style={{ width: "fit-content" }}>
                            <button className={`btn-info btn mx-3 ${progress == initiativeProgress.completed ? "me-0" : ""}`} type="button" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                Описание
                            </button>
                            <div className={`btn ms-auto btn-outline-info ${progress == initiativeProgress.completed ? "d-none" : ""}`} onClick={secondButtonAction}>
                                {progress == initiativeProgress.completed ? "Просмотреть" : progress == initiativeProgress.started ? "Сдать" : progress == initiativeProgress.notStarted ? "Начать" : "Проверить"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="offcanvas offcanvas-bottom text-black offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title}`}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body small">{props.content}
            </div>
        </div>

        <button className="d-none" type="button" data-bs-toggle="offcanvas" data-bs-target={`#res${props.id}Send`} aria-controls={`res${props.id}Send`}>
            Отправить
        </button>
        <div className="offcanvas offcanvas-bottom text-black offcanvas-60vh" ref={sendCanvasRef} tabIndex={-1} id={`res${props.id}Send`} aria-labelledby={`res${props.id}SendLabel`}>
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
                        <button className="btn-outline-dark w-100 btn" onClick={sendInitiative}>
                            Отправить!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default InitiativeBrick;
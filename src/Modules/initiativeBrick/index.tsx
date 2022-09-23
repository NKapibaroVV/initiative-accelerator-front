import React, { createRef } from "react";
import { useGlobalUserState } from "../User/User";

export enum initiativeProgress {
    "notStarted" = "notStarted",
    "started" = "started",
    "completed" = "completed",
    "admin"="admin"
}

export enum initiativeCategories {
    "Ответственность" = "Ответственность",
    "Целеустремлённость" = "Целеустремлённость",
    "Конкурентоспособность" = "Конкурентоспособность",
    "Грамотность" = "Грамотность",
    "Инициативность" = "Инициативность",
    "Креативность" = "Креативность"
}

export interface IBrickProps {
    title: string,
    deadLine: number,
    id: string,
    offcanvasContent: string,
    progress: initiativeProgress,
    income: number,
    category: initiativeCategories
}



function InitiativeBrick(props: IBrickProps) {
    function categoryIndicator() {
        switch (props.category) {
            case initiativeCategories.Ответственность:
                return <i className="bi bi-heart-fill mx-auto text-white"></i>
            case initiativeCategories.Целеустремлённость:
                return <i className="bi bi-dribbble ma-auto text-white"></i>
            case initiativeCategories.Конкурентоспособность:
                return <i className="bi bi-mic mx-auto text-white"></i>
            case initiativeCategories.Грамотность:
                return <i className="bi bi-journal-bookmark mx-auto text-white"></i>
            case initiativeCategories.Инициативность:
                return <i className="bi bi-eye mx-auto text-white"></i>
            case initiativeCategories.Креативность:
                return <i className="bi bi-camera-fill mx-auto text-white"></i>
            default:
                return <></>
        }
    }
    let sendOffcanvasBtnRef = React.createRef<HTMLButtonElement>()
    const user = useGlobalUserState();

    const messageRef = createRef<HTMLTextAreaElement>();

    function pressSecondButton() {
        if (props.progress == initiativeProgress.notStarted) {
            fetch(`${process.env.BACKEND_SERVER_DOMAIN}/api/start_initiative`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ token: user.userParams.token, id: props.id })
            }).then(() => { document.location.reload() })
        } else if (props.progress == initiativeProgress.started) {
            sendOffcanvasBtnRef.current!.click();
        }else if(props.progress == initiativeProgress.admin){
            window.location.assign(`/check_i/${encodeURI(JSON.stringify(props))}`);
        }
    }

    return <div>
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
                        <>{categoryIndicator()} до {new Date(props.deadLine).toLocaleDateString()}</>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <div className="d-block">
                    <div className="w-100 h-100">
                        <div className="d-block ms-auto" style={{ width: "fit-content" }}>
                            <button className="btn-info btn mx-3" type="button" data-bs-toggle="offcanvas" data-bs-target={`#msg${props.id}`} aria-controls={`msg${props.id}`}>
                                Описание
                            </button>
                            <div className={`btn ms-auto ${props.progress == initiativeProgress.notStarted ? "btn-outline-info" : props.progress == initiativeProgress.started ? "btn-outline-success text-white border-white" : props.progress==initiativeProgress.admin?"btn-outline-info":"d-none"}`} onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");pressSecondButton();}}>
                                {props.progress == initiativeProgress.notStarted ? "Начать" : props.progress == initiativeProgress.started ? "Сдать" : props.progress==initiativeProgress.admin?"Проверить":""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="offcanvas offcanvas-bottom text-black offcanvas-60vh" tabIndex={-1} id={`msg${props.id}`} aria-labelledby={`msg${props.id}Label`}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={`msg${props.id}Label`}>{`${props.title} - до ${new Date(props.deadLine).toLocaleDateString()} `}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body small" dangerouslySetInnerHTML={{ __html: props.offcanvasContent }}>
            </div>
        </div>

        <button className="d-none" ref={sendOffcanvasBtnRef} type="button" data-bs-toggle="offcanvas" data-bs-target={`#res${props.id}Send`} aria-controls={`res${props.id}Send`}>
            Отправить
        </button>
        <div className="offcanvas offcanvas-bottom text-black offcanvas-60vh" tabIndex={-1} id={`res${props.id}Send`} aria-labelledby={`res${props.id}SendLabel`}>
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id={`res${props.id}SendLabel`}>{`${props.title} - до ${new Date(props.deadLine).toLocaleDateString()} `}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body small">
                <div className="row g-2 justify-content-center">
                    <div className="col-12 col-md-6">
                        <div className="form-floating">
                            <textarea ref={messageRef} className="form-control w-100" placeholder="Ваше сообщение" id={`res${props.id}Comment`} style={{ height: "200px" }}></textarea>
                            <label htmlFor={`res${props.id}Comment`}>Ваше сообщение</label>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <button className="btn-outline-dark w-100 btn" onClick={(clickedElement) => {
                            clickedElement.currentTarget.disabled = true;
                            fetch(`${process.env.BACKEND_SERVER_DOMAIN}/api/complete_initiative`, {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    "token": user.userParams.token,
                                    "message": messageRef.current!.value,
                                    "initiative_id": props.id
                                })
                            }).then(result => result.json()).then((json) => { if (json["success"]) { document.location.reload() } })
                        }}>
                            Отправить
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default InitiativeBrick;
import React from "react";
import { useEffect, useState } from "react";
import INotification from "../../interfaces/notification";
import { useGlobalUserState } from "../User/User";

function notifBrick(notif: INotification) {
    return <>
        <div className="card" style={{ marginTop: "10px" }}>
            <div className="card-body">
                <h5 className="card-title">{notif.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{new Date(notif.time).toLocaleString()}</h6>
                <p className="card-text">{notif.text}</p>
            </div>
        </div>
    </>
}

export default function NotifContainer() {
    const currentUser = useGlobalUserState();

    const bellRef = React.createRef<HTMLSpanElement>();

    const [notifContent, setNotifContent] = useState([<>
        <div className="mx-auto mt-100" style={{ width: "fit-content" }}>
            <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </>]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/getNotifs/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token })
        }).then(res => res.json().then((notifs: INotification[]) => {
            setNotifContent([notifBrick(notifs[0])]);
            notifs.forEach((value: INotification, index: number) => {
                if (index != 0) {
                    setNotifContent(prev => [notifBrick(value), ...prev])
                }
            })
        }))
    }, [])

    function checkNotifs() {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/checkNotifs/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: currentUser.userParams.token })
        }).then(()=>{
            bellRef.current?.classList.replace("bi-bell-fill","bi-bell");
            bellRef.current?.classList.remove("text-danger");
        })
    }

    return <>
        <button className={`navbar-toggler`} type="button" style={{ marginLeft: "auto", marginRight: "10px", width: "56px", height: "40px" }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasNotif" aria-controls="offcanvasNotif" onClick={checkNotifs}>
            <span className={`bi bi-bell${currentUser.userParams.notifs_checked == 0 ? "-fill text-danger" : ""}`} style={{ width: "30px", height: "30px" }} ref={bellRef}></span>
        </button>
        <div className="offcanvas offcanvas-end text-bg-white" tabIndex={-1} id="offcanvasNotif" aria-labelledby="offcanvasNotifLabel">
            <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNotifLabel">Уведомления</h5>
                <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                {notifContent}
            </div>

        </div>
    </>
}
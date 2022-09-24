import React, { useEffect, useState } from "react";
import InitiativeBrick, { initiativeCategories, initiativeProgress } from "../../Modules/initiativeBrick";
import { useGlobalUserState } from "../../Modules/User/User";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import "./index.css";

function CabinetPage() {

    const user = useGlobalUserState();

    let preloader = <div key={`preloader-${new Date().getTime()}`} style={{ width: "fit-content" }} className="mx-auto">
            <div className="spinner-grow text-info mx-2" role="status" />
            <div className="spinner-grow text-info mx-2" role="status" />
            <div className="spinner-grow text-info mx-2" role="status" />
        </div>

    let [completedInitiatives, setCompletedInitiatives] = useState<Array<JSX.Element>>([preloader]);
    let [inPropressInitiatives, setInPropressInitiatives] = useState<Array<JSX.Element>>([preloader]);
    let [notStartedInitiatives, setNotStartedInitiatives] = useState<Array<JSX.Element>>([preloader]);

    let completedInitiativesBricks: Array<JSX.Element> = [];
    let inProgressInitiativesBricks: Array<JSX.Element> = [];
    let notStartedInitiativesBricks: Array<JSX.Element> = [];
    useEffect(() => {
        (async function getInitiatives() {
            let allInitiatives: { [id: string]: { category: initiativeCategories, title: string, deadLine: number, offcanvasContent: string, income: number } } = {};
            let userStartedInitiatives: { [id: string]: { category: initiativeCategories, title: string, deadLine: number, offcanvasContent: string, income: number } } = {};
            let userCompletedInitiatives: { [id: string]: { category: initiativeCategories, title: string, deadLine: number, offcanvasContent: string, income: number } } = {};

            await fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_initiatives`).then(
                (result) => result.json()).then((allInitiativesJson: any) => {
                    allInitiativesJson.forEach((initiative: { category: initiativeCategories, id: string, title: string, deadLine: number, offcanvasContent: string, income: number }) => {
                        allInitiatives[initiative.id] = { category: initiative.category, title: initiative.title, deadLine: initiative.deadLine, offcanvasContent: initiative.offcanvasContent, income: initiative.income }
                    });

                    fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_user_initiatives`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode:"cors",
                        method: "POST",
                        body: JSON.stringify({ token: user.userParams.token })
                    }).then((result) => result.json()).then((userInitiativesJson) => {
                        userInitiativesJson.forEach((initiative: { id: string, state: initiativeProgress }) => {
                            if (allInitiatives[initiative.id]) {
                                if (initiative.state == initiativeProgress.started) {
                                    userStartedInitiatives[initiative.id] = allInitiatives[initiative.id];
                                } else if (initiative.state == initiativeProgress.completed) {
                                    userCompletedInitiatives[initiative.id] = allInitiatives[initiative.id];
                                }
                                delete allInitiatives[initiative.id];
                            }
                        });
                    }).then(() => {
                        for (const initiativeId in userCompletedInitiatives) {
                            if (Object.prototype.hasOwnProperty.call(userCompletedInitiatives, initiativeId)) {
                                const element = userCompletedInitiatives[initiativeId];
                                completedInitiativesBricks.push(<InitiativeBrick category={element.category} title={element.title} deadLine={element.deadLine} id={initiativeId} offcanvasContent={element.offcanvasContent} progress={initiativeProgress.completed} income={element.income} key={initiativeId} />)
                            }
                        }
                        setCompletedInitiatives([!!completedInitiativesBricks[0]?completedInitiativesBricks[0]:<div key={"0-1"}></div>, 
                            !!completedInitiativesBricks[1]?completedInitiativesBricks[1]:<div key={"0104-2"}></div>]);
                        delete completedInitiativesBricks[0];
                        delete completedInitiativesBricks[0];
                        let moreCompletedInitiativesRef = React.createRef<HTMLDivElement>();
                        setCompletedInitiatives((prev)=>[...prev, <div key={`com-0`} className={`btn btn-success ${completedInitiativesBricks.length>0?"":"d-none"}`} onClick={(clickedElement)=>{moreCompletedInitiativesRef.current!.classList.remove("d-none"); clickedElement.currentTarget.classList.add("d-none")}}>Показать ещё {completedInitiativesBricks.length}</div>,<div key={`sus-0`} className="d-none" ref={moreCompletedInitiativesRef}>{completedInitiativesBricks}</div>]);

                        for (const initiativeId in userStartedInitiatives) {
                            if (Object.prototype.hasOwnProperty.call(userStartedInitiatives, initiativeId)) {
                                const element = userStartedInitiatives[initiativeId];
                                inProgressInitiativesBricks.push(<InitiativeBrick category={element.category} title={element.title} deadLine={element.deadLine} id={initiativeId} offcanvasContent={element.offcanvasContent} progress={initiativeProgress.started} income={element.income} key={initiativeId} />)
                            }
                        }
                        setInPropressInitiatives(inProgressInitiativesBricks);

                        for (const initiativeId in allInitiatives) {
                            if (Object.prototype.hasOwnProperty.call(allInitiatives, initiativeId)) {
                                const element = allInitiatives[initiativeId];
                                if (element.deadLine > new Date().getTime()) {
                                    notStartedInitiativesBricks.push(<InitiativeBrick category={element.category} title={element.title} deadLine={element.deadLine} id={initiativeId} offcanvasContent={element.offcanvasContent} progress={initiativeProgress.notStarted} income={element.income} key={initiativeId} />)
                                }
                            }
                        }
                        setNotStartedInitiatives(notStartedInitiativesBricks);
                    })
                })
        })()
    }, [])


    function getCompletedInitiativesCountByCategory(category: initiativeCategories) {

        let count: number = 0;
        completedInitiatives.forEach((e) => {
            if (e.props.category == category) {
                count++;
            }
        });
        return <>{count}</>;

    }
    return <>
        <CheckAuth>
            <div className="pt-4">

                <div className="mx-2" style={{ minHeight: "80px" }}>
                    <div className="row py-3 gx-2 px-2 gy-2">
                        <div className="col-md-5 col-12 justify-content-center">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-12 col-sm-4">
                                            <div className="d-block m-auto">
                                                <div className="d-flex justify-content-center p-2">
                                                    <i className="bi bi-person-circle hover-info-to-white fs-icon-5"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-sm-8 fs-5 d-flex">
                                            <div className={`w-100 align-self-center h-100 align-items-stretch row g-0 ${document.documentElement.clientWidth < 512 ? "text-center" : "text-start"}`}>
                                                <div className="col-12 ps-2 align-text-top mb-auto">
                                                    {`${user.userParams.name} ${user.userParams.surname}`}
                                                </div>
                                                <div className="col-12 mt-1 ps-2">
                                                    {user.userParams.role}
                                                </div>
                                                <div className="col-12 mt-1 ps-2 align-text-bottom mt-auto">
                                                    Баллов: {user.userParams.score}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="col-md-7 col-12">
                            <div className="border-white border-3 rounded-4 h-100 p-2" style={{ borderStyle: "dashed" }}>
                                <div className="m-auto">
                                    <div className="row gx-0">
                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-heart-fill fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center  text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Ответственность)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-dribbble fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Целеустремлённость)}</div>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-mic fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Конкурентоспособность)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-journal-bookmark fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Грамотность)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-eye fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Инициативность)}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-2 col-12 hover-info-to-white">
                                            <div className="row justify-content-center">
                                                <div className="row">
                                                    <div className=" d-flex justify-content-center">
                                                        <i className="bi bi-camera-fill fs-icon-4"></i>
                                                    </div>

                                                    <div className="d-block mx-auto p-0 text-center text-white">{getCompletedInitiativesCountByCategory(initiativeCategories.Креативность)}</div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Завершенные инициативы</h3>
                        <>{completedInitiatives}</>
                    </div>
                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Начатые инициативы</h3>
                        <>{inPropressInitiatives}</>
                    </div>
                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Не начатые инициативы</h3>
                        <>{notStartedInitiatives}</>
                    </div>

                </div>

            </div>
        </CheckAuth>
    </>
}

export default CabinetPage;
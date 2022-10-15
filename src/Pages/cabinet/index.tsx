import React, { useEffect, useState } from "react";
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import { useGlobalUserState } from "../../Modules/User/User";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import "./index.css";
import { initializeTooltips } from "../../Modules/bootstrapUtilities/initializeTooltips";
import Iinitiative, { initiativeCategory } from "../../interfaces/initiative";
import preloader from "../../Modules/preloader";

function CabinetPage() {
    initializeTooltips();

    const user = useGlobalUserState();


    const [completedInitiativesBriks, setCompletedInitiativesBriks] = useState([preloader])
    const [startedInitiativesBriks, setStartedInitiativesBriks] = useState([preloader])
    const [notStartedInitiativesBriks, setNotStartedInitiativesBriks] = useState([preloader])

    const [indicators, setIndicators] = useState(<></>)


    let allInitiatives: { [id: string]: Iinitiative } = {};
    let takenInitiatives: { [id: string]: Iinitiative } = {};
    let completedInitiatives: { [id: string]: Iinitiative } = {};
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_initiatives/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token })
        }).then(resp => resp.json().then((response: Iinitiative[]) => {
            response.forEach((element: Iinitiative) => {
                allInitiatives[element.id] = element
            });;

            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_taken_initiatives/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify({ token: user.userParams.token })
            }).then(resp => resp.json().then((response) => {
                response.forEach((element: Iinitiative) => {
                    takenInitiatives[element.id] = element
                });;


                fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_completed_initiatives/`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: "POST",

                    body: JSON.stringify({ token: user.userParams.token })
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
                            setNotStartedInitiativesBriks((prev) => [...prev, InitiativeBrick(element, initiativeProgress.notStarted)])
                        }
                    }

                    setStartedInitiativesBriks([])
                    for (const key in takenInitiatives) {
                        if (Object.prototype.hasOwnProperty.call(takenInitiatives, key)) {
                            const element = takenInitiatives[key];
                            setStartedInitiativesBriks((prev) => [...prev, InitiativeBrick(element, initiativeProgress.started)])
                        }
                    }

                    setCompletedInitiativesBriks([])
                    for (const key in completedInitiatives) {
                        if (Object.prototype.hasOwnProperty.call(completedInitiatives, key)) {
                            const element = completedInitiatives[key];
                            setCompletedInitiativesBriks((prev) => [...prev, InitiativeBrick(element, initiativeProgress.completed)])
                        }
                    }

                    setIndicators(<div className="row gx-0">
                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-heart-fill fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Ответственность"></i>
                                    </div>

                                    <div className="d-block mx-auto p-0 text-center  text-white">{getCountOfCompletedCategories(initiativeCategory.Ответственность)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-dribbble fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Целеустремлённость"></i>
                                    </div>

                                    <div className="d-block mx-auto p-0 text-center text-white">{getCountOfCompletedCategories(initiativeCategory.Целеустремлённость)}</div>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-mic fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Конкурентоспособность"></i>
                                    </div>
                                    <div className="d-block mx-auto p-0 text-center text-white">{getCountOfCompletedCategories(initiativeCategory.Конкурентоспособность)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-journal-bookmark fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Грамотность"></i>
                                    </div>

                                    <div className="d-block mx-auto p-0 text-center text-white">{getCountOfCompletedCategories(initiativeCategory.Грамотность)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-eye fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Инициативность"></i>
                                    </div>

                                    <div className="d-block mx-auto p-0 text-center text-white">{getCountOfCompletedCategories(initiativeCategory.Инициативность)}</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 col-12 hover-info-to-white">
                            <div className="row justify-content-center">
                                <div className="row">
                                    <div className=" d-flex justify-content-center">
                                        <i className="bi bi-camera-fill fs-icon-4" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="Креативность"></i>
                                    </div>

                                    <div className="d-block mx-auto p-0 text-center text-white">{getCountOfCompletedCategories(initiativeCategory.Креативность)}</div>
                                </div>
                            </div>
                        </div>


                    </div>)
                }))


            }))


        }))
    }, [])

    function getCountOfCompletedCategories(category: initiativeCategory) {
        let counter = 0;
        for (const key in completedInitiatives) {
            if (Object.prototype.hasOwnProperty.call(completedInitiatives, key)) {
                const initiative = completedInitiatives[key];
                if (initiative.category == category) {
                    counter += 1;
                }
            }
        }
        return counter
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
                                    {indicators}
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Завершенные инициативы</h3>
                        <>{completedInitiativesBriks}</>
                    </div>
                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Начатые инициативы</h3>
                        <>{startedInitiativesBriks}</>
                    </div>
                    <div className="py-3">
                        <h3 className="border-bottom border-3 border-white">Не начатые инициативы</h3>
                        <>{notStartedInitiativesBriks}</>
                    </div>

                </div>

            </div>
        </CheckAuth>
    </>
}

export default CabinetPage;
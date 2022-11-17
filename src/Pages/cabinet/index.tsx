import React, { useEffect, useState } from "react";
import SchoolIcon from '@mui/icons-material/School';
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import { useGlobalUserState } from "../../Modules/User/User";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import { initializeTooltips } from "../../Modules/bootstrapUtilities/initializeTooltips";
import Iinitiative, { initiativeCategory } from "../../interfaces/initiative";
import preloader from "../../Modules/preloader";
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Card, Skeleton, Tooltip, Button, ButtonGroup, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Badge, ExpandMore, Savings } from "@mui/icons-material";
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import StartIcon from '@mui/icons-material/Start';
import { blue } from "@mui/material/colors";
import Preloader from "../../Modules/preloader";
import Person4Icon from '@mui/icons-material/Person4';

function CabinetPage() {
    initializeTooltips();

    const user = useGlobalUserState();

    const [displayedBricks, setDisplayedBricks] = useState([preloader]);

    const [completedInitiativesBriks, setCompletedInitiativesBriks] = useState([preloader])
    const [startedInitiativesBriks, setStartedInitiativesBriks] = useState([preloader])
    const [notStartedInitiativesBriks, setNotStartedInitiativesBriks] = useState([preloader])

    const [indicators, setIndicators] = useState(<><Skeleton variant="rounded" sx={{
        width: "100%",
        height: "125px",
    }} /></>);

    let allInitiatives: { [id: string]: Iinitiative } = {};
    let takenInitiatives: { [id: string]: Iinitiative } = {};
    let completedInitiatives: { [id: string]: Iinitiative } = {};

    useEffect(() => {
        setDisplayedBricks(notStartedInitiativesBriks)
    }, [notStartedInitiativesBriks])

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

                    fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_rank/`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        method: "POST",

                        body: JSON.stringify({ token: user.userParams.token })
                    }).then(resp => resp.json().then((rankObj: { rank: string }) => {
                        setIndicators(
                            <Card variant="outlined" className="row gx-0 px-2 py-2 h-100">

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white ">
                                        <Tooltip title="Ответственность">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-heart-fill fs-icon-4"></i>
                                                </div>

                                                <div className="d-block mx-auto p-0 text-center  text-primary">{getCountOfCompletedCategories(initiativeCategory.Ответственность)}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Целеустремлённость">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-dribbble fs-icon-4"></i>
                                                </div>

                                                <div className="d-block mx-auto p-0 text-center text-primary">{getCountOfCompletedCategories(initiativeCategory.Целеустремлённость)}</div>

                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Конкурентоспособность">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-mic fs-icon-4"></i>
                                                </div>
                                                <div className="d-block mx-auto p-0 text-center text-primary">{getCountOfCompletedCategories(initiativeCategory.Конкурентоспособность)}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Грамотность">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-journal-bookmark fs-icon-4"></i>
                                                </div>

                                                <div className="d-block mx-auto p-0 text-center text-primary">{getCountOfCompletedCategories(initiativeCategory.Грамотность)}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Инициативность">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-eye fs-icon-4"></i>
                                                </div>

                                                <div className="d-block mx-auto p-0 text-center text-primary">{getCountOfCompletedCategories(initiativeCategory.Инициативность)}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Креативность">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-camera-fill fs-icon-4"></i>
                                                </div>

                                                <div className="d-block mx-auto p-0 text-center text-primary">{getCountOfCompletedCategories(initiativeCategory.Креативность)}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="row justify-content-center hover-info-to-white">
                                        <Tooltip title="Престиж">
                                            <div className="row">
                                                <div className="d-flex justify-content-center">
                                                    <i className="bi bi-mortarboard-fill fs-icon-4"></i>
                                                </div>
                                                <div className="d-block mx-auto p-0 text-center text-primary">{rankObj.rank}</div>
                                            </div>
                                        </Tooltip>
                                    </div>
                                </div>

                            </Card>)
                    }))
                }))


            })).then(() => {
                setTimeout(() => {
                    if (document.location.hash.startsWith("#brick_") && document.location.hash.length) {
                        const id = `start${document.location.hash.replace("#brick_", "")}`;
                        console.log(id)
                        var interval = setInterval(() => {
                            let brickCanvas = document.getElementById(id);
                            if (brickCanvas != null) {
                                clearInterval(interval);
                                brickCanvas.classList.add("show");
                            }
                        }, 100)
                    }
                }, 100)
            })


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

                    <div className="row">
                        <div className="row col-12 col-lg-5 g-2"
                            style={{
                                height: "fit-content"
                            }}>
                            <div className="col-12">
                                <Avatar sx={{
                                    width: 125,
                                    height: 125,
                                    bgcolor: `${!!user.userParams.avatarURI ? "" : "#0dcaf0"}`,
                                    mx: "auto",
                                    img: {
                                        height: "auto"
                                    }
                                }}
                                    className="py-1"
                                    src={`${user.userParams.avatarURI}`}
                                >{user.userParams.name.substring(0, 1)}{user.userParams.surname.substring(0, 1)}</Avatar>
                            </div>
                            <div className="col-12">
                                <Card variant="outlined" className="">
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Person4Icon></Person4Icon>
                                                </ListItemIcon>
                                                <ListItemText primary={`${`${user.userParams.name} ${user.userParams.surname}`}`} />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Badge></Badge>
                                                </ListItemIcon>
                                                <ListItemText primary={`${user.userParams.role}`} />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                        <ListItem disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Savings></Savings>
                                                </ListItemIcon>
                                                <ListItemText primary={`Баллов: ${user.userParams.score}`} />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Card>
                            </div>
                            <div className="col-12">
                                <Card variant="outlined" className="">
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    setDisplayedBricks(startedInitiativesBriks);
                                                }}>
                                                <ListItemIcon>
                                                    <DoneIcon></DoneIcon>
                                                </ListItemIcon>
                                                <ListItemText primary="Начатые инициативы" />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    setDisplayedBricks(completedInitiativesBriks);
                                                }}>
                                                <ListItemIcon>
                                                    <DoneAllIcon></DoneAllIcon>
                                                </ListItemIcon>
                                                <ListItemText primary="Завершенные инициативы" />
                                            </ListItemButton>
                                        </ListItem>
                                        <Divider />
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => {
                                                    setDisplayedBricks(notStartedInitiativesBriks);
                                                }}>
                                                <ListItemIcon>
                                                    <StartIcon></StartIcon>
                                                </ListItemIcon>
                                                <ListItemText primary="Не начатые инициативы" />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Card>
                            </div>
                        </div>
                        <div className="col-12 col-lg-7 row g-2"
                            style={{
                                height: "fit-content"
                            }}>
                            <div className="col-12"
                                style={{
                                    height: 125
                                }}>
                                {indicators}
                            </div>
                            <div className="col-12">
                                <Card variant="outlined" className="p-2 h-100">
                                    {displayedBricks.length < 1 ? <Typography align="center">Кажется, в этом разделе пусто<BubbleChartIcon className="ms-1" /></Typography> : displayedBricks == notStartedInitiativesBriks ?
                                        <Typography align="center">Не начатые инициативы<StartIcon className="ms-1" /></Typography> : displayedBricks == startedInitiativesBriks ? <Typography align="center">Начатые инициативы<DoneIcon className="ms-1" /></Typography> : <Typography align="center">Завершенные инициативы<DoneAllIcon className="ms-1" /></Typography>}
                                    {displayedBricks}
                                </Card>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CheckAuth>
    </>
}

export default CabinetPage;
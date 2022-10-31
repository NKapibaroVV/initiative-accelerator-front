import { Button } from "@mui/material";
import { useState, useEffect, createRef } from "react";
import Select from "react-select";
import Iinitiative from "../../interfaces/initiative";
import CheckModerator from "../../Modules/Check/CheckModerator";
import InitiativeBrick, { initiativeProgress } from "../../Modules/initiativeBrick";
import preloader from "../../Modules/preloader";
import { useGlobalUserState } from "../../Modules/User/User";
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import EditIcon from '@mui/icons-material/Edit';

export default function ListOfAllInitiativesPage() {
    const user = useGlobalUserState();
    const [results, setResults] = useState([preloader]);
    const selectRef = createRef<any>();
    const [initiativesObjects, setInitiativesObjects] = useState([{ label: "", value: "" }])
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_initiatives/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token })
        }).then(res => res.json().then((response) => {
            setResults([]);
            console.log(response)
            if (!!response[0]) {
                setInitiativesObjects([]);
                response.forEach((element: Iinitiative) => {
                    setInitiativesObjects((prev) => [...prev, { label: `${element.title} (${element.id})`, value: element.id }])
                    setResults((prev) => [...prev, InitiativeBrick(element, initiativeProgress.edit)])
                });
            } else {
                setResults([<>Задания не найдены!</>])
            }

        }))
    }, [])
    return <CheckModerator>
        <>
            <div className="fs-3 text-center text-primary">
                Редактирование заданий
            </div>
            <div className="row justify-content-center gx-3 gy-2 my-3">
                <Button variant="outlined" className="col-12 col-md-5 mx-2" href="/addPublicInitiative">Создать открытое задание</Button>
                <Button variant="outlined" className="col-12 col-md-5 mx-2" href="/addPrivateInitiative">Создать приватное задание</Button>
            </div>
            <div className="row g-2 justify-content-center">
                <div className="col-12 col-md-8">
                    <Select options={initiativesObjects} ref={selectRef} />
                </div>
                <div className="col-6 col-md-2">
                    <Button
                        className="w-100"
                        variant="contained"
                        onClick={() => {
                            if (!!selectRef.current!.props.value && !!selectRef.current!.props.value.value) {
                                document.location.assign(`/initiatives/stat/${selectRef.current!.props.value.value}`);
                            }
                        }}><AutoGraphIcon /></Button>
                </div>
                <div className="col-6 col-md-2">
                    <Button
                        className="w-100"
                        variant="contained"
                        onClick={() => {
                            if (!!selectRef.current!.props.value && !!selectRef.current!.props.value.value) {
                                document.location.assign(`/initiatives/edit/${selectRef.current!.props.value.value}`);
                            }
                        }}><EditIcon /></Button>
                </div>


            </div>
            {results}
        </>
    </CheckModerator>
}
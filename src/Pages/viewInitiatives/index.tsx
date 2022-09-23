import { useEffect, useState } from "react";
import CheckModerator from "../../Modules/Check/CheckModerator";
import InitiativeBrick, { IBrickProps, initiativeCategories, initiativeProgress } from "../../Modules/initiativeBrick";
import { useGlobalUserState } from "../../Modules/User/User";

function ViewInitiativesPage() {

    let allInitiativesBricks: Array<JSX.Element> = [];
    const [initiatives, setInitiatives] = useState([<></>]);
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_all_initiatives`).then(
            (result) => result.json()).then((allInitiativesJson: IBrickProps[]) => {
                allInitiativesJson.forEach((initiative: { category: initiativeCategories, id: string, title: string, deadLine: number, offcanvasContent: string, income: number }) => {
                    allInitiativesBricks.push(<InitiativeBrick title={initiative.title} deadLine={initiative.deadLine} id={initiative.id} offcanvasContent={initiative.offcanvasContent} progress={initiativeProgress.admin} income={initiative.income} category={initiative.category} ></InitiativeBrick>)
                })
            }).then(()=>{
                setInitiatives(allInitiativesBricks)
            })
    }, [])


    return <>
        <CheckModerator>
            <>
            {initiatives}
            </>
        </CheckModerator>
    </>
}
export default ViewInitiativesPage;
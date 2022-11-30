import { userRoles } from "../../enums/userRoles";
import { useGlobalUserState } from "../User/User";

function CheckModerator(props: { children: JSX.Element }) {
    let user = useGlobalUserState();
    if (user.userParams.role == userRoles.Администратор || user.userParams.role == userRoles.Модератор) {
        return props.children
    } else {
        window.location.assign("/cab");
        return <></>
    }
}
export default CheckModerator;
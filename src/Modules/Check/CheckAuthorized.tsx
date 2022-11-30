import { userRoles } from "../../enums/userRoles";
import { useGlobalUserState } from "../User/User";

function CheckAuth(props: { children: JSX.Element }) {
    let user = useGlobalUserState();
    if (user.userParams.role != userRoles.default) {
        return props.children
    } else {
        window.location.assign("/auth");
        return <></>
    }
}
export default CheckAuth;
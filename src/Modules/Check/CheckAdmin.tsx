import { userRoles } from "../../enums/userRoles";
import { useGlobalUserState, } from "../User/User";

function CheckAdmin(props:{children:JSX.Element}){
    let user = useGlobalUserState();
    if (user.userParams.role==userRoles.Администратор) {
        return props.children
    }else{
        window.location.assign("/cab");
        return<></>
    }
}
export default CheckAdmin;
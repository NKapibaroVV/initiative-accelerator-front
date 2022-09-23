import { useGlobalUserState, userRoles } from "../User/User";

function CheckAuth(props:{children:JSX.Element}){
    let user = useGlobalUserState();
    if (user.userParams.role!=userRoles.default) {
        return props.children
    }else{
        window.location.assign("/vkauth");
        return<></>
    }
}
export default CheckAuth;
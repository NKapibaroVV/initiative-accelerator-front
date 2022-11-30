import { Avatar, Button } from "@mui/material";
import { createRef, useEffect, useState } from "react";
import IUser from "../../interfaces/user";
import CheckAuth from "../../Modules/Check/CheckAuthorized";
import { useGlobalUserState } from "../../Modules/User/User";

export default function ProfilePage() {

    const [avatarURI, setAvatarURI] = useState("");
    let firstNameRef = createRef<HTMLInputElement>();
    let secondNameRef = createRef<HTMLInputElement>();
    let emailRef = createRef<HTMLInputElement>();
    let groupRef = createRef<HTMLInputElement>();
    let avatarRef = createRef<HTMLInputElement>();
    let birthRef = createRef<HTMLInputElement>();
    let passwordRef = createRef<HTMLInputElement>();
    let passwordRepeatedRef = createRef<HTMLInputElement>();

    let user = useGlobalUserState();

    function updateAccount() {

        let reqBody: any = {
            token: user.userParams.token,
            name: firstNameRef.current!.value,
            surname: secondNameRef.current!.value,
            email: emailRef.current!.value,
            edu_group: groupRef.current!.value,
            birth: birthRef.current!.value,
            avatar: avatarRef.current!.value
        }



        if (passwordRef.current!.value.length > 4 && passwordRef.current!.value == passwordRepeatedRef.current!.value) {
            reqBody.password = passwordRef.current!.value;
        } else {
            alert("Пароль короче 5 символов или введённые пароли не совпадают!!")
        }
        if (!/http.?:\/\/.*\.(jpg|png)/g.test(avatarRef.current!.value)) {
            alert("Ссылка на автар не соответствует требованиям!")
        }
        else {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/update_profile/`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",

                body: JSON.stringify(reqBody)
            }).then(resp => resp.json().then((response) => {
                alert("Профиль обновлен!");
                document.location.reload();
            }))
        }


    }

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/get_me/`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",

            body: JSON.stringify({ token: user.userParams.token })
        }).then(resp => resp.json().then((response: any) => {
            let userObject: IUser = response;
            firstNameRef.current!.value = userObject.name;
            secondNameRef.current!.value = userObject.surname;
            emailRef.current!.value = userObject.email;
            birthRef.current!.value = `${new Date(userObject.birth).toLocaleDateString().split(".")[2]}-${new Date(userObject.birth).toLocaleDateString().split(".")[1]}-${new Date(userObject.birth).toLocaleDateString().split(".")[0]}`
            groupRef.current!.value = `${userObject.edu_group}`;
            avatarRef.current!.value = `${userObject.avatarURI}`;
            setAvatarURI(`${userObject.avatarURI}`)
        }))
    }, [])
    return <CheckAuth>
        <div className="py-3">
            <h4 className="text-center px-2 mb-3 pb-2">Изменение профиля</h4>
            <p className="text-center px-2 mb-3 pb-2">(Вводите значения только в те поля, которые хотите изменить!)</p>
            <div className="row justify-content-center gy-4 gx-2">
                <div className="col-md-7 col-10">
                    <label>Имя</label>
                    <input className="form-control" type="text" name="surname" placeholder="Имя" ref={firstNameRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Фамилия</label>
                    <input className="form-control" type="text" name="name" placeholder="Фамилия" ref={secondNameRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Учебная группа</label>
                    <input className="form-control" type="text" name="group" placeholder="Учебная группа" ref={groupRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Ссылка на аватар</label>
                    <br />
                    <label>Ссылка должна начинаться с http или https и заканчиваться на .png или .jpg</label>
                    <input className="form-control" type="text" name="group" placeholder="Учебная группа" ref={avatarRef}
                        onChange={(event) => {
                            setAvatarURI(event.currentTarget.value);
                        }} />
                    <label>Предпросмотр:</label>
                    <Avatar sx={{
                        width: 125,
                        height: 125,
                        bgcolor: `${!!avatarURI ? "" : "#0dcaf0"}`,
                        mx: "auto",
                        img: {
                            height: "auto"
                        }
                    }}
                        className="py-1"
                        src={`${avatarURI}`}
                    >{user.userParams.name.substring(0, 1)}{user.userParams.surname.substring(0, 1)}</Avatar>
                </div>
                <div className="col-md-7 col-10">
                    <label>Email</label>
                    <input className="form-control" type="text" name="email" placeholder="Email" ref={emailRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Дата рождения</label>
                    <input className="form-control" type="date" name="birth" ref={birthRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Пароль</label>
                    <input className="form-control" type="password" name="password" placeholder="Пароль" ref={passwordRef} />
                </div>
                <div className="col-md-7 col-10">
                    <label>Повтор пароля</label>
                    <input className="form-control" type="password" name="repeatPassword" placeholder="Повтор пароля" ref={passwordRepeatedRef} />
                </div>
                <div className="col-md-7 col-10">
                    <Button variant="outlined" className="w-100" onClick={(event) => {
                        updateAccount();
                    }}>
                        Применить
                    </Button>
                </div>

            </div>
        </div>
    </CheckAuth>;
}
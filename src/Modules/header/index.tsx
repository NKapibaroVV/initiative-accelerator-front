import { Warning } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { userRoles } from "../../enums/userRoles";
import NotifContainer from "../NotifContainer";
import { useGlobalUserState } from "../User/User";

function Header() {
    const user = useGlobalUserState();

    function showNotifications() {

    }

    return <>
        <nav className="navbar navbar-white bg-light">
            <div className="container-fluid">
                <a className="navbar-brand ms-2" href="/"><img
                    style={{
                        height: "40px",
                        width: "40px"
                    }}
                    src="https://pk10.mskobr.ru/attach_files/logo/%D0%BB%D0%BE%D0%B3%D0%BE%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82.png" alt="logo" />
                </a>
                {user.userParams.role != "default" ? <NotifContainer /> : null}
                <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="offcanvas offcanvas-end text-bg-white" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                    <div className="offcanvas-header">
                        <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Навигация по сайту</h5>
                        <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                    </div>
                    <div className="offcanvas-body">
                        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                            <li className="nav-item">
                                <a className="nav-link p-1 text-start" aria-current="page" href="/">Главная</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link p-1 text-start" href="/cab">Кабинет</a>
                            </li>
                            {user.userParams.role == userRoles.Администратор ? <>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/users">Редактировать участников</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/statistic/bigInitiativesStatistics.csv">Статистика</a>
                                </li>
                            </> : <></>}
                            {user.userParams.role == userRoles.Модератор || user.userParams.role == userRoles.Администратор ?
                                <>
                                    <li className="nav-item">
                                        <a className="nav-link p-1 text-start" href="/shop/edit">Редактировать магазин</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link p-1 text-start" href="/initiatives/edit">Редактировать задания</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link p-1 text-start" href="/initiatives/results">Проверка заданий</a>
                                    </li>
                                </> : <></>}
                            {user.userParams.role != userRoles.default ? <>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/rating">Рейтинг</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/shop/">Обменять баллы</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/shop/story">История обмена баллов</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" href="/profile">Редактировать профиль</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link p-1 text-start" onClick={() => { localStorage.removeItem("userData"); window.location.assign("/"); }}>Выйти</a>
                                </li>
                            </> : <></>}
                        </ul>
                    </div>
                </div>
            </div>


        </nav>
        <Alert sx={{
            w:100
        }}
        color="error"
        icon={<Warning sx={{
        my:"auto"
        }}/>}
        hidden={user.userParams.email_verified==1||user.userParams.email=="default"}>
            Подтвердите свой email! Ссылка для подтверждения была отправлена на почту {user.userParams.email}<br/>
            Без подтверждения Вы не сможете принимать участие в инициативах, а следовательно получать баллы.<br/><br/>
            Если письмо не пришло Вам на почту (т.е. Вы не можете найти его во входящих, а так же папке "спам"), то Вам нужно обратиться к Администрации.
        </Alert>
    </>
}

export default Header;
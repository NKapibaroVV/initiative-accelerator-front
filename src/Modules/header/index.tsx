import { useGlobalUserState, userRoles } from "../User/User";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'

function Header() {
    const user = useGlobalUserState();

    return <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand" href="/"></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end text-bg-dark" tabIndex={-1} id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Навигация по сайту</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="/">Главная</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/cab">Кабинет</a>
                        </li>
                        {user.userParams.role == userRoles.Модератор || user.userParams.role == userRoles.Администратор ?
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/addInitiative">Создать задание</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/viewInitiatives">Открыть все задания</a>
                                </li>
                            </> : <></>}
                        {user.userParams.role != userRoles.default ? <>
                            <li className="nav-item">
                                <a className="nav-link" href="/rating">Рейтинг</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" onClick={() => { removeCookie("userData"); window.location.assign("/"); }}>Выйти</a>
                            </li>
                        </> : <></>}
                    </ul>
                </div>
            </div>
        </div>
    </nav>
}

export default Header;
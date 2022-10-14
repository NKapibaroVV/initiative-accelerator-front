import { useGlobalUserState, userRoles } from "../User/User";
import { getCookie, setCookie, removeCookie } from 'typescript-cookie'

function Header() {
    const user = useGlobalUserState();

    return <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
            <a className="navbar-brand ms-2" href="/"><img
                style={{
                    height: "40px",
                    width: "40px"
                }}
                src="https://pk10.mskobr.ru/attach_files/logo/%D0%BB%D0%BE%D0%B3%D0%BE%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82.png" alt="logo" />
            </a>
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
                            <a className="nav-link btn p-1 text-start" aria-current="page" href="/">Главная</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link btn p-1 text-start" href="/cab">Кабинет</a>
                        </li>
                        {user.userParams.role == userRoles.Модератор || user.userParams.role == userRoles.Администратор ?
                            <>
                                <li className="nav-item">
                                    <a className="nav-link btn p-1 text-start" href="/shop/edit">Редактировать магазин баллов</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link btn p-1 text-start" href="/addPublicInitiative">Создать задание всем</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link btn p-1 text-start" href="/addPrivateInitiative">Создать задание пользователям</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link btn p-1 text-start" href="/initiatives/results">Открыть все задания</a>
                                </li>
                            </> : <></>}
                        {user.userParams.role != userRoles.default ? <>
                            <li className="nav-item">
                                <a className="nav-link btn p-1 text-start" href="/rating">Рейтинг</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn p-1 text-start" href="/shop/">Обменять баллы</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn p-1 text-start" href="/shop/story">История обмена баллов</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link btn p-1 text-start" onClick={() => { removeCookie("userData"); window.location.assign("/"); }}>Выйти</a>
                            </li>
                        </> : <></>}
                    </ul>
                </div>
            </div>
        </div>
    </nav>
}

export default Header;
import React from "react";
import CheckModerator from "../../Modules/Check/CheckModerator";
import { useGlobalUserState } from "../../Modules/User/User";
function AddInitiativePage() {
    const user = useGlobalUserState();

    let titleRef = React.createRef<HTMLInputElement>();
    let scoreRef = React.createRef<HTMLInputElement>();
    let commentRef = React.createRef<HTMLTextAreaElement>();

    let dayRef = React.createRef<HTMLInputElement>();
    let timeRef = React.createRef<HTMLInputElement>();

    let categoryRef = React.createRef<HTMLSelectElement>();

    function createInitiative() {
        if (dayRef.current!.value.length == 10 && timeRef.current!.value.length == 5 && titleRef.current!.value && scoreRef.current!.value && commentRef.current!.value) {

        }
        let deadLine: number = new Date(`${dayRef.current!.value}T${timeRef.current!.value}`).getTime()

        if (deadLine > new Date().getTime()&&parseInt(scoreRef.current!.value)>0&&commentRef.current!.value.length>0&& titleRef.current!.value.length>0) {
            fetch(`${process.env.REACT_APP_BACKEND_SERVER_DOMAIN}/api/add_initiative`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: "POST",
                
                body: JSON.stringify({
                    "token": user.userParams.token,
                    "score": scoreRef.current!.value,
                    "title": titleRef.current!.value,
                    "comment": commentRef.current!.value,
                    "deadLine": deadLine,
                    "category":categoryRef.current!.value
                })
            }).then((resp) => resp.json()).then((jsonResult) => {
                if (jsonResult["success"]) {
                    alert("Создано");
                    document.location.reload();
                }
            })
        } else {
            alert("Одно или несколько полей заполнены неверно!");
        }
    }

    return <>
        <CheckModerator>
            <div className="py-3">
                <div className="row g-2">

                    <div className="col-md-6 col-12">
                        <div className="row g-2">

                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="text" className="form-control" id="floatingInput" placeholder="Заголовок" ref={titleRef} />
                                    <label htmlFor="floatingInput">Заголовок</label>
                                </div>
                            </div>

                            <div className="col-12 col-md-6">
                                <div className="form-floating mb-3 text-dark">
                                    <input type="number" className="form-control" id="floatingInput" placeholder="Баллов за выполнение" ref={scoreRef} />
                                    <label htmlFor="floatingInput">Баллов за выполнение</label>
                                </div>
                            </div>

                            <div className="col-12">
                                <div className="form-group">
                                    <label htmlFor="inputDate">Дата окончания:</label>
                                    <input type="date" className="form-control my-2" ref={dayRef} />
                                    <input type="time" className="form-control my-2" ref={timeRef} />
                                </div>
                            </div>

                            <div className="col-12">
                                <label>Категория:</label>
                                <select className="form-select" aria-label="" ref={categoryRef}>
                                    <option value="Ответственность" selected>Ответственность</option>
                                    <option value="Целеустремлённость">Целеустремлённость</option>
                                    <option value="Конкурентоспособность">Конкурентоспособность</option>
                                    <option value="Грамотность">Грамотность</option>
                                    <option value="Инициативность">Инициативность</option>
                                    <option value="Креативность">Креативность</option>
                                </select>
                            </div>

                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-floating text-dark">
                            <textarea className="form-control" placeholder="Описание" id="floatingTextarea2" style={{ height: "300px" }} ref={commentRef}></textarea>
                            <label htmlFor="floatingTextarea2">Описание</label>
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="btn btn-outline-info rounded-4 p-2 w-100" onClick={(clickedElement)=>{clickedElement.currentTarget.classList.add("disabled");createInitiative()}}>Создать</div>
                    </div>

                </div>
            </div>
        </CheckModerator>
    </>
}
export default AddInitiativePage;
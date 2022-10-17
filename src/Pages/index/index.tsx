import { Card } from "@mui/material";
import "./index.css";

function MainPage() {
    return <>
        <div className="my-2">
            <h1 className="text-center my-3">Акселератор инициатив</h1>
            <h3 className="border-bottom border-3 border-dark pb-1 mb-3">Система роста</h3>

            <Card className="rounded-4 p-3  my-3">
                <div className="fw-bold">Участник</div>
                имеет возможность брать наряд в «Акселераторе Инициатив»
                или в «Центре Содействия Инициативам» на выполнение задания и по
                итогам получать баллы и очки опыта.
                Обладатели наибольшего количества баллов по итогам недели будут
                посвящены на торжественной церемонии поднятия флага в Члены
                Московского студенческого отряда Педагогического резерва.
            </Card>

            <Card className="rounded-4 p-3 ">
                <div className="fw-bold">Член МСОПР</div>
                <div className="rounded-4 p-3 mx-2">
                    <div className="fw-bold">Активист</div>
                    - участие в инициативах студентов, мероприятиях и событиях
                    колледжа, а также работа по направлениям.
                </div>

                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">Наставник</div>
                    создание и реализация инициатив посредством
                    объединения в сообщества и направления.
                    <div className="fw-lighter fst-italic">*Наставники имеют право самостоятельно направлять наряды в «Акселератор Инициатив» или
                        «Центр Содействия Инициативам», получать гранты на создание сообществ.</div>
                </div>

                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">Эксперт</div>
                    - координация направлений и сообществ.
                </div>

                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">Магистр / Руководитель АИ и ЦСТ</div>
                    - координация работы проекта.
                </div>
            </Card>


            <h3 className="border-bottom border-3 border-dark pb-1 my-3">Работа с заданиями</h3>

            <Card className="rounded-4 p-3 ">
                <div className="fw-bold">Штрафы</div>
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">-25 баллов</div>
                    за некачественное выполнение задания.
                </div>
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">-50 баллов</div>
                    за просрок дедлайна.
                </div>
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">-100 баллов</div>
                    за невыполнение задания.
                </div>
            </Card>

            <h3 className="border-bottom border-3 border-dark pb-1 my-3">Условия при работе с заданиями</h3>

            <Card className="rounded-4 p-3 ">
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">1. Не более 3-х открытых наряда.</div>
                </div>
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">2. Взаимодействие с ответственным лицом.</div>
                </div>
                <div className="rounded-4 p-3  mx-2">
                    <div className="fw-bold">3. Визирование ответственным лицом.</div>
                </div>
            </Card>
        </div>
    </>

}

export default MainPage;
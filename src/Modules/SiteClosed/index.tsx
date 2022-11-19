import { ReactElement } from "react"

export enum siteStates{
    "tech_works"
}

export default function SiteClosed(props:{children:JSX.Element,state?:siteStates }) {

    if (props.state == siteStates.tech_works) {
        return (<html>
            <head>
                <meta charSet="utf-8" />
                <title>На сайте ведутся технические работы</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <meta name="description" content="На сайте ведутся технические работы" />
                <style type="text/css">
                    {`
            body {font-family: "Antic Slab", Arial, Helvetica, sans-serif;}
            .box {
                width: 800px;
                height:200px;
                position: absolute;
                top: 50%;
                left: 50%;
                background-color: #f8f8f8;
                border: 1px solid #e5e4e4;
                text-align: center;
                margin-top: -100px;
                margin-left: -400px;
            }
            h1 {
                color: #614444;
                font-size: 40px !important;
                font-weight: normal !important;
            }`
            }
                </style>
            </head>
            <body>
        <div className="box">
            <h1>Технический перерыв</h1>
            <p >Приносим свои извинения за перебои в работе сайта.<br/>
                Наши технические специалисты работают над обновлением сайта.</p>
        </div>
    </body>
        </html>
        )
    }
    else{
        return props.children
    }
}
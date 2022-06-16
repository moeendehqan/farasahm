

import './statisticsupdate.css'
const Statisticsupdate = (props) =>{

    return(
        <div>
            <div className="statisticsupdate">
                <div >
                    <h3>تعداد مشتریان</h3>
                    <h1 id="statisticsupdateuser">{props.nameuser}</h1>
                </div>
                <div >
                    <h3>تعداد معاملات</h3>
                    <h1 id="statisticsupdatetrade">{props.numTrade}</h1>
                </div>
                <div >
                    <h3>اخرین بروزرسانی</h3>
                    <h1 id="statisticsupdatedate">{props.lastUpdate}</h1>
                </div>
            </div>
        </div>
    )
}

export default Statisticsupdate
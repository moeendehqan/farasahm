import './newbie.css'
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js';
import Popview from '../../../components/popview/popview';

const Newbie = () =>{
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [chartNum, setChartNum] = useState(null)
    const [typeReport, setTypeReport] = useState('num')
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);

    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleNewbieData = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/newbie',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            if(Response.data.replay){
                console.log(Response.data.data.map(d=>d.Date))

                const options = {
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: false,
                        text: 'رفتار معاملاتی ',
                      },                    },                  }
                
                    const datan = {
                        labels: Response.data.data.map(d=>d.Date),
                        datasets:[{
                            label: "خریداران",
                            data: Response.data.data.map(d=>d.allnum),
                            fill: true,
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                        },{
                            label: "جدیدالورود",
                            data: Response.data.data.map(d=>d.newnum),
                            fill: true,
                            backgroundColor: "rgba(177, 61, 206,0.2)",
                            borderColor: "rgba(177, 61, 206,1)"
                            }]                    }
                    const datav = {
                        labels: Response.data.data.map(d=>d.Date),
                        datasets:[{
                            label: "خریداران",
                            data: Response.data.data.map(d=>d.allvol),
                            fill: true,
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                        },{
                            label: "جدیدالورود",
                            data: Response.data.data.map(d=>d.newvol),
                            fill: true,
                            backgroundColor: "rgba(177, 61, 206,0.2)",
                            borderColor: "rgba(177, 61, 206,1)"
                            }]                    }

                    setChartNum(<Line options={options} data={typeReport=='num'?datan:datav} />)
            }else{
                setMsg(Response.data.msg)
                setChartNum(null)
            }
        })
    }

    useEffect(handleNewbieData, [typeReport, fromDate, toDate])

    return(
        <aside>
            <div>
                <h3>جدید الورود ها</h3>
                <div>
                    <div>
                        {chartNum}
                    </div>
                </div>
                <Alarm msg={msg} smsg={setMsg}/>
            </div>

            <div className='StocksOption'>
                <label>نوع</label>
                <select onChange={(e)=>setTypeReport(e.target.value)}>
                    <option value='num'>تعداد</option>
                    <option value='vol'>حجم</option>
                </select>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>
            </div>

        </aside>
    )
}

export default Newbie
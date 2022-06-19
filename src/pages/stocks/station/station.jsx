import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import {Chart as ChartJS,CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';

const Station = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [side, setSide] = useState('Buy_brkr')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [content, setContent] = useState(null)
    const [typeReport, setTypeReport] = useState('vol')
    console.log(typeReport)
    ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend)


    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetStation = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/station',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
                side:side
            }
        }).then(Response=>{
            if(Response.data.replay){

                const options = {
                    indexAxis: 'y',
                    elements: {
                      bar: {
                        borderWidth: 2,
                      },
                      font:{
                        family:'peydaRegular'
                      }
                    },
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                      title: {
                        display: false,
                        text: 'Chart.js Horizontal Bar Chart',
                      },                    },                  };

                const labels = Response.data.data.map(items=>items.Istgah);
                const datav = {
                        labels,
                        datasets: [
                          {
                            label: 'حجم',
                            data: Response.data.data.map(items=>items.Volume),
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                          },                        ]                      }
                const datan = {
                        labels,
                        datasets: [
                            {
                            label: 'حجم',
                            data: Response.data.data.map(items=>items.count),
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                            },                        ]                      }

                setContent(<Bar options={options} data={typeReport==='vol'?datav:datan} />)
            }else{
                setMsg(Response.data.msg)
            }

        })
    }

useEffect(handleGetStation, [fromDate,toDate,side,typeReport])

    return(
        <aside>
            <div>
                <h3>ایستگاهای معاملاتی</h3>
                {content}
                <Alarm msg={msg} smsg={setMsg} />
            </div>
            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='Buy_brkr'>خرید</option>
                    <option value='Sel_brkr'>فروش</option>
                </select>
                <label>نوع</label>
                <select onChange={(e)=>setTypeReport(e.target.value)}>
                    <option value='vol'>حجم</option>
                    <option value='num'>تعداد</option>
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

export default Station
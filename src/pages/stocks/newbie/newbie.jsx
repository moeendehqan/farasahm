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
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import Loader from '../../../components/loader/loader'

const Newbie = () =>{
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [chartNum, setChartNum] = useState(null)
    const [typeReport, setTypeReport] = useState('num')
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            labels:{
                font:{
                    family:'peydaRegular'
                },
            },
            Tooltip:{
                backgroundColor:'#263bb0'
            },
        title: {
            display: false,text: 'رفتار معاملاتی '
                }
            }
        }
    const [dataNum, setDataNum] = useState(null)
    const [dataVol, setDataVol] = useState(null)
    const [dataNumR, setDataNumR] = useState(null)
    const [dataVolR, setDataVolR] = useState(null)
    const [loading, setLoading] = useState(true)

    const exportPdf = () => {
        html2canvas(document.querySelector("#NewbieChart")).then(canvas => {
           //document.body.appendChild(canvas);  // if you want see your screenshot in body.
           const imgData = canvas.toDataURL('image/png');
           const pdf = new jsPDF();
           pdf.addImage(imgData, 'PNG', 0, 0);
           pdf.save("download.pdf"); 
       });
   
    }

    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleNewbieData = () =>{
        setLoading(true)
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/newbie',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            setLoading(false)
            if(Response.data.replay){
                setDataNum({
                    labels: Response.data.data.map(d=>d.Date),
                    datasets:[{
                        label: "کل",
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
                        }]                    })
                setDataVol({
                    labels: Response.data.data.map(d=>d.Date),
                    datasets:[{
                        label: "کل",
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
                        }]                    })
                setDataNumR({
                    labels: Response.data.data.map(d=>d.Date),
                    datasets:[{
                        label: "نسبت تعداد جدیدالورود به کل",
                        data: Response.data.data.map(d=>Math.round((d.newnum/d.allnum)*100)),
                        fill: true,
                        backgroundColor: "rgba(198, 62, 241,0.2)",
                        borderColor: "rgba(45, 65, 253,1)"
                    }]                    })
                setDataVolR({
                    labels: Response.data.data.map(d=>d.Date),
                    datasets:[{
                        label: "نسبت حجم جدیدالورود به کل",
                        data: Response.data.data.map(d=>Math.round((d.newvol/d.allvol)*100)),
                        fill: true,
                        backgroundColor: "rgba(198, 62, 241,0.2)",
                        borderColor: "rgba(45, 65, 253,1)"
                    }]                    })

            }else{
                setMsg(Response.data.msg)
                setDataNum(null)
                setDataVol(null)
            }
        })
    }

    useEffect(handleNewbieData, [fromDate, toDate])

    return(
        <aside>
            <div>
                <h3>جدید الورود ها</h3>
                <div className='NewbieChart' id='NewbieChart'>
                    {dataNum===null?null:
                        typeReport==='vol'?
                        <Line options={options} data={dataVol} />:
                        typeReport==='num'?
                        <Line options={options} data={dataNum} />:
                        typeReport==='volR'?
                        <Line options={options} data={dataVolR} />:
                        <Line options={options} data={dataNumR} />
                    }

                </div>
                <Alarm msg={msg} smsg={setMsg}/>
            </div>

            <div className='StocksOption'>
                <label>نوع</label>
                <select onChange={(e)=>setTypeReport(e.target.value)}>
                    <option value='num'>تعداد</option>
                    <option value='vol'>حجم</option>
                    <option value='volR'>حجم%</option>
                    <option value='volR'>تعداد%</option>
                </select>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>
                <label>دریافت</label>
                <div className='StocksDownloadBox'>
                    <button onClick={exportPdf}>PDF</button>
                </div>
            </div>
            {loading?<Loader />:null}
        </aside>
    )
}

export default Newbie
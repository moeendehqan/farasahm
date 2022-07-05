import {Chart as ChartJS,LinearScale,CategoryScale,BarElement,PointElement,LineElement,Legend,Tooltip,} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { getCookie } from "../../../components/cookie"
import axios from 'axios';
import { serverAddress } from '../../../config/config';
import { useEffect, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

const Volume = () =>{
    const username = getCookie('username')
    ChartJS.register(LinearScale,CategoryScale,BarElement,PointElement,LineElement,Legend,Tooltip);
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)
    const [chartVolume, setChartVolume] = useState(null)

    const options = {
            plugins: {
                legend: {
                    labels: {
                        font: {
                            family: 'peydaRegular',
                        }
                    }
                },
                tooltip:{
                    titleFont:{
                        family: 'peydaRegular',
                    },
                    bodyFont:{
                        family: 'peydaRegular',
                    },
                    backgroundColor:'#263bb0'
                }
            }
        }
    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const exportPdf = () => {
        html2canvas(document.querySelector("#ChartVolume")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        })}

    const handleFromDate = (date) =>{setFromDate(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToDate(DatePickerToInt(date))}

    const handleGetVolume = () =>{
        axios({
            method:'POST',
            url:serverAddress+'/etf/volume',
            data:{
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            var labels = Response.data.map(i=>i.date)
            var data = {
                labels,
                datasets: [
                    {
                      type: 'bar',
                      label: 'حجم',
                      backgroundColor:'#263bb0',
                      borderColor: '#263bb0',
                      borderWidth: 2,
                      fill: false,
                      data: Response.data.map((i)=>i.trade_volume),
                    },
                    {
                      type: 'line',
                      label: 'میانگین30',
                      data:  Response.data.map((i)=>i.Avg30),
                      backgroundColor:'#9b3cac',
                      borderColor: '#9b3cac',
                      borderWidth: 3,
                      pointStyle:'line',
                    },
                    {
                      type: 'line',
                      label: 'میانگین7',
                      backgroundColor: 'rgb(53, 162, 235)',
                      data:  Response.data.map((i)=>i.Avg7),
                      borderColor: '#e7d8ef',
                      backgroundColor:'#e7d8ef',
                      borderWidth: 3,
                      pointStyle:'line',
                    },
                        ]
            }
            setChartVolume(<Chart type='bar' data={data} options={options} />)

        })
    }

    useEffect(handleGetVolume,[fromDate,toDate])
    return(
        <aside>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            <div id='ChartVolume'>
                {chartVolume}
            </div>
            

            <div className='EtfOption'>
                <label>از تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                <label>تا تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
            </div>
        </aside>
    )
}


export default Volume
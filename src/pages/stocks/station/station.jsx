import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import './station.css'
import MiniLoader from '../../../components/loader/miniloader'
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

const Station = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [side, setSide] = useState('Buy_brkr')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [dataStation, setDataStation] = useState(null)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const exportPdf = () => {
        html2canvas(document.querySelector("#detailsTable")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        })}

    if(dataStation!=null){
        var table = new Tabulator("#detailsTable", {
            data:dataStation,
            columnHeaderSortMulti:true,
            columns:[
                {title:"تعداد", field:"count",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,bottomCalc:"sum",},
                {title:"حجم", field:"Volume",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,
                formatter:"progress",
                formatterParams:{
                    min:Math.min(...(dataStation.map(i=>i.Volume*1))),
                    max:Math.max(...(dataStation.map(i=>i.Volume*1))),
                    color:'#263bb0',
                    legend:true,
                    legendAlign:'justify'
                                },
                bottomCalc:"sum",
                },
                {title:"ایستگاه", field:"Istgah",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3, headerFilter:true},

            ],
            
            layout: "fitColumns",
        });
}

    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetStation = () =>{
        console.log(fromDate)
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
                setDataStation(Response.data.data)
            }else{
                setMsg(Response.data.msg)
            }
        })
    }

useEffect(handleGetStation, [fromDate,toDate,side])

    return(
        <aside>
            <div>
                <h3>ایستگاهای معاملاتی</h3>
            </div>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            {dataStation==null?<div className='ContinerLoader'><MiniLoader/></div>:null}

            <div id='detailsTable'></div>
            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='Buy_brkr'>خرید</option>
                    <option value='Sel_brkr'>فروش</option>
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

import { getCookie } from "../../../components/cookie"
import axios from "axios"
import { serverAddress } from "../../../config/config"
import { useState, useEffect } from "react"
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import './nav.css'
import Alarm from '../../../components/alarm/alarm'

const Nav = () => {
    const username = getCookie('username')
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)
    const [dataNav, setDataNav] = useState(null)
    const [msg, setMsg] = useState(null)

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

    const handleFromDate = (date) =>{setFromDate(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToDate(DatePickerToInt(date))}

    const handleGetNav = ()=>{
        setDataNav(null)
        axios({
            method:'POST',
            url:serverAddress+'/etf/nav',
            data:{
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            if(Response.data.replay){
                setDataNav(Response.data.data)
            }else{
                setMsg(Response.data.msg)
                setDataNav(null)
            }
        })
    }

if(dataNav!=null){
    var table = new Tabulator("#detailsTable", {
        data:dataNav,
        columnHeaderSortMulti:true,
        columns:[
            {title:"تاریخ", field:"date",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
            {title:"قیمت پایانی", field:"final_price",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
            {title:"تغییر", field:"close_price_change_percent",visible:false},
            {title:"nav", field:"nav",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
            {title:"مقدار اختلاف", field:"deffNav",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,},
            
            {title:"نرخ اختلاف", field:"RatedeffNav",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
             formatter:function(cell, formatterParams){
                var value = cell.getValue();
                if (value<0){

                    return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTN' style='width:"+((value*-1)/0.02).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
                }else{
                    return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(value/0.02).toString()+'%'+"'></div><p>"+ value.toString()+'%' +"</p></div>")
                }
            }
         
            },
            {title:"date", field:"dateInt",visible:false},
        ],
        layout: "fitColumns",
    })
}
    useEffect(handleGetNav,[fromDate,toDate])

    return(
        <aside>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            <div id='detailsTable'></div>
            
            <div className='EtfOption'>
                <label>از تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                <label>تا تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
        </aside>
    )
}


export default Nav

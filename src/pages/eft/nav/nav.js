
import { getCookie } from "../../../components/cookie"
import axios from "axios"
import { serverAddress } from "../../../config/config"
import { useState, useEffect } from "react"
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import {useLocation} from 'react-router-dom';
import Loader from '../../../components/loader/loader'
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import './nav.css'
const Nav = () => {
    const username = getCookie('username')
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)


    const handleFromDate = (date) =>{setFromDate(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToDate(DatePickerToInt(date))}

    const handleGetNav = ()=>{
        axios({
            method:'POST',
            url:serverAddress+'/etf/nav',
            data:{
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            console.log(Response.data)
            var table = new Tabulator("#detailsTable", {
                data:Response.data,
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

                            return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTN' style='width:"+((value*-1)/0.05).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
                        }else{
                            return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(value/0.05).toString()+'%'+"'></div><p>"+ value.toString()+'%' +"</p></div>")
                        }
                    }
                 
                    },
                    {title:"date", field:"dateInt",visible:false},
                ],
                layout: "fitColumns",
            })
        })
    }
    'date','final_price','close_price_change_percent','deffNav','RatedeffNav','dateInt'
    useEffect(handleGetNav,[])

    return(
        <aside>
            <div id='detailsTable'></div>
            <div className='EtfOption'>
                <label>از تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                <label>تا تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
            </div>
        </aside>
    )
}


export default Nav

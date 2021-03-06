import './details.css'
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
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


const Details = () => {
    const location = useLocation(); 
    const username = getCookie('username')
    const [listTrader, setListTrader] = useState([])
    const [traderSelect, setTraderSelect] = useState(location.state)
    const [listTrade, setListTrade] = useState([])
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [loading, setLoading] = useState(true)
    const [shortData, setShortData] = useState(null)

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

    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}


    if(listTrade.length>0){
        var Volume =listTrade.map(i=>i.Volume)
        var vpmx = Math.max(...Volume)
        var vpmn = Math.min(...Volume)

        var table = new Tabulator("#detailsTable", {
            data:listTrade,
            columnHeaderSortMulti:true,
            columns:[
                {title:"index", field:"index",visible:false},
                {title:"??????", field:"Volume",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    if(value>0){
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChart' style='width:"+(((value)/vpmx)*50).toString()+'%'+"'> </div><p>"+ value.toString()+"</p></div>")
                    }else{
                        return("<div class='StocksTableChartContiner'><div class='StocksTableChartneg' style='width:"+(((value)/vpmn)*50).toString()+'%'+"'> </div><p>"+ value.toString()+"</p></div>")
                    }
                },
                bottomCalc:"sum",
                },
                {title:"????????", field:"Price",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                formatter:"money",
                formatterParams:{
                    decimal:",",
                    precision:false,
                },},
                {title:"????????????", field:"B_account",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
                {title:"??????????????", field:"S_account",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
                {title:"??????????", field:"Date",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
                {title:"????????", field:"Time",visible:false,}
            ],
            layout: "fitColumns",
        });
}

    const handleGetDetails = () => {
        const inList = (listTrader.find(i => i.Account==traderSelect))
        if(inList!= undefined && inList.Account==traderSelect){
            setLoading(true)
            setListTrade([])
            axios({
                method: 'POST',
                url:serverAddress+'/stocks/detailes',
                data:{
                    username:username,
                    account:traderSelect,
                    fromDate:fromDate,
                    toDate:toDate
                }
            }).then(Response=>{
                setLoading(false)
                if(Response.data.replay){
                    setListTrade(Response.data.data)
                    setShortData(Response.data.shortData)
                }
            })
        }

    }

    const handleGetDetailsLoction = () => {
        if(location.state){
            setLoading(true)
            axios({
                method: 'POST',
                url:serverAddress+'/stocks/detailes',
                data:{
                    username:username,
                    account:location.state,
                    fromDate:false,
                    toDate:false
                }
            }).then(Response=>{
                setLoading(false)
                if(Response.data.replay){
                    setListTrade(Response.data.data)
                    setShortData(Response.data.shortData)
                }
            })
        }

    }

    const handleGetTraderList = () =>{

        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traderlist',
            data:{
                username:username
            }
        }).then(response =>{
            setListTrader(response.data.data)
        })

    }

    useEffect(handleGetTraderList,[])
    useEffect(handleGetDetailsLoction,[location.state])
    useEffect(handleGetDetails,[traderSelect, fromDate, toDate])

    return(
        <aside className='Details'>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            {shortData==null?null:
            <div className='StocksDitailsShortData'>
                <div>
                    <p>??????????</p>
                    <p>{shortData.vol}</p>
                </div>
                <div>
                    <p>?????????????? ????????</p>
                    <p>{shortData.avgprcb}</p>
                </div>
                <div>
                    <p>?????????????? ????????</p>
                    <p>{shortData.avgprcs}</p>
                </div>
            </div>}
            
            <div id='detailsTable'></div>

            {listTrader.length===0?null:
            <div className='StocksOption'>
                <label>??????</label>
                <input value={traderSelect}  list='browsers' onChange={(e)=>setTraderSelect(e.target.value)} />
                <datalist id="browsers">
                    {listTrader.map(items=>{
                        return(
                            <option key={Math.random(Math.random()*100000000)} value={items.Account}>{items.Fullname}</option>
                        )
                    })

                    }
                </datalist>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    ???? ??????????
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    ???? ??????????
                </label>
            </div>}
            {loading?<Loader />:null}
        </aside>
    )
}

export default Details
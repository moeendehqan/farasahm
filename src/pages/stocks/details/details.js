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



const Details = () => {
    const location = useLocation(); 
    const username = getCookie('username')
    const [listTrader, setListTrader] = useState([])
    const [traderSelect, setTraderSelect] = useState(location.state)
    const [listTrade, setListTrade] = useState([])
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [loading, setLoading] = useState(true)


    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');


    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}


    if(listTrade.length>0){
        const vol = (listTrade.map(i=>i.Volume*1))
        console.log(vol)
        console.log(Math.max(...vol))
        var table = new Tabulator("#detailsTable", {
            data:listTrade,
            columnHeaderSortMulti:true,
            columns:[
                {title:"index", field:"index",visible:false},
                {title:"حجم", field:"Volume",hozAlign:'center',headerHozAlign:'center',formatter:'progress'},
                {title:"قیمت", field:"Price",hozAlign:'center',headerHozAlign:'center'},
                {title:"خریدار", field:"B_account",hozAlign:'center',headerHozAlign:'center'},
                {title:"فروشنده", field:"S_account",hozAlign:'center',headerHozAlign:'center'},
                {title:"تاریخ", field:"Date",hozAlign:'center',headerHozAlign:'center'},
                {title:"زمان", field:"Time",visible:false,}
            ],
            layout: "fitColumns",
        });
}

    const handleDownloadCsv =() =>{table.download("csv", "data.csv")}

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
            
            <div id='detailsTable'></div>

            {listTrader.length===0?null:
            <div className='StocksOption'>
                <label>نام</label>
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
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>
                <div>
                    <button id="download-csv" onClick={()=>table.download("csv", "data.csv")}>Download CSV</button>
                    <button id="download-xlsx" onClick={()=>{table.download("xlsx", "data.xlsx")}}>Download XLSX</button>
                    <button id="download-pdf" onClick={()=>{table.download("pdf", "data.pdf")}}>Download PDF</button>
                    <button id="download-html" onClick={()=>{table.download("html", "data.html")}}>Download HTML</button>
                </div>
            </div>}
            {loading?<Loader />:null}
        </aside>
    )
}

export default Details
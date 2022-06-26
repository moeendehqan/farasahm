
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './traders.css'
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import { Line } from "react-chartjs-2";
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js';
import Popview from '../../../components/popview/popview';
import Loader from '../../../components/loader/loader'
import { useNavigate } from 'react-router-dom';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

const Traders = () => {

    const navigate = useNavigate()
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [historiCode, setHistoriCode] = useState(null)
    const [dataTraders, setDataTraders] = useState(null)
    const [side, setSide] = useState('buy')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const [loading, setLoading] = useState(true)

    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const exportPdf = () => {
        html2canvas(document.querySelector("#detailsTable")).then(canvas => {
           //document.body.appendChild(canvas);  // if you want see your screenshot in body.
           const imgData = canvas.toDataURL('image/png');
           const pdf = new jsPDF();
           pdf.addImage(imgData, 'PNG', 0, 0);
           pdf.save("download.pdf"); 
       });
   
    }


    if(dataTraders!=null){
        var table = new Tabulator("#detailsTable", {
            data:dataTraders,
            columnHeaderSortMulti:true,
            columns:[
                {title:'کدبورسی', field:'code',visible:false},
                {title:'مانده',field:'balance',hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                cellClick:function(e, cell){
                    handleHistoriCode(cell.getData().code, cell.getData().name)
                    },
                },
                {title:'قیمت',field:'price',hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
                {title:'حجم',field:'volume',hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:6,formatter:"progress",
                    formatterParams:{
                        min:Math.min(...(dataTraders.map(i=>i.volume*1))),
                        max:Math.max(...(dataTraders.map(i=>i.volume*1))),
                        color:'#263bb0',
                        legend:true,
                        legendAlign:'justify'
                    },
                    cellClick:function(e, cell){
                        handleDetailsTrade(cell.getData().code)
                    },
                },
                {title:'نام',field:'name',hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:4,
                cellClick:function(e, cell){
                    infoTraders(cell.getData().code)
                    },
                    headerFilter:"input",
                },

            ],
            layout: "fitColumns",
        });
}

    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetDataTraders = () =>{
        setLoading(true)
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traders',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
                side:side,
            }
        }).then(response=>{
            setLoading(false)
            if(response.data.replay){
                setDataTraders(response.data.data)
            }else{
                setMsg(response.data.msg)
                setDataTraders(null)
            }        })
        }
        

    const infoTraders = (code) =>{
        setLoading(true)
        axios({
            method:'POST',
            url:serverAddress+'/stocks/infocode',
            data:{
                username:username,
                code:code
            }
        }).then(response=>{
            setLoading(false)
                setMsg(response.data.msg)
                })    }
        
        const handleHistoriCode = (code , name) =>{
            setLoading(true)
            axios({
                method:'POST',
                url:serverAddress+'/stocks/historicode',
                data:{
                    username:username,
                    code:code
                }
            }).then(response=>{
                setLoading(false)
                    const options = {
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: name,
                            color: "rgb(39, 59, 176)"
                          },
                        },
                      };
                    const data = {
                        labels: response.data.data.map(d=>d.date),
                        datasets: [
                          {
                            label: "حجم",
                            data: response.data.data.map(d=>d.cum),
                            fill: true,
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                          }
                        ]
                      }
                      setHistoriCode(<Line options={options} data={data} />)
                    })    }

    const handleDetailsTrade = (code)=>{
        navigate('/stocks/details',{state:code})
    }
    useEffect(handleGetDataTraders,[fromDate, toDate, side])

    return(
        <aside>
            <div>
            <h3>معاملگران</h3>
            </div>
            <div id='detailsTable'></div>

            <Alarm msg={msg} smsg={setMsg}/>
            <Popview contet={historiCode} scontent={setHistoriCode}/>

            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='buy'>خرید</option>
                    <option value='sel'>فروش</option>
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
                    <button onClick={()=>{table.download("xlsx", "data.xlsx")}}>XLSX</button>
                    <button onClick={exportPdf}>PDF</button>
                </div>

            </div>
            {loading?<Loader />:null}
        </aside>
    )
}

export default Traders
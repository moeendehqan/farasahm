import axios from "axios"
import { serverAddress } from "../../../config/config"
import { getCookie } from "../../../components/cookie"
import {useEffect, useState} from 'react'
import {Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend,} from 'chart.js';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

const Reserve = ()=>{
    const username = getCookie('username');
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const [etfList, setEtfList] = useState([])
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',

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
        },
      };
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)
    const [etfSelect, setEtfSelect] = useState(null)
    const [msg, setMsg] = useState(null)
    const [chart, setChart] = useState(null)

    window.jspdf  = require('jspdf');

    const exportPdf = () => {
        html2canvas(document.querySelector("#tableReserve")).then(canvas => {
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
    const handleEtfSelect = (ev)=>{
        const inList = (etfList.find(i => i.symbol==ev))
        if(inList!= undefined && inList.symbol==ev){
            setEtfSelect(ev)
        }
    }


    const handleGetList = () =>{
        axios({
            method: 'POST',
            url: serverAddress+'/etf/etflist',
            data: {
                username:username
            }
        }).then(response=>{
            setEtfList(response.data)
        })
    }
    const handleGetReserve = ()=>{
        axios({
        method: "POST",
        url:serverAddress+'/etf/reserve',
        data:{
            username:username,
            fromDate:fromDate,
            toDate:toDate,
            etfSelect:etfSelect
        }
    }).then(response=>{
        if(response.data.replay){
            var df = JSON.parse(response.data.data.df)
            if (response.data.data.sub==false){
            const labels = JSON.parse(response.data.data.df).map(i=>i.date)
            const data = {
                labels,
                datasets: [
                  {
                    label: response.data.data.basename,
                    data: df.map(i=>i.reserve),
                    borderColor: '#263bb0',
                    backgroundColor: '#263bb0',
                  },]}
            setChart(<Line options={options} data={data} />)
            }else{
                const labels = df.map(i=>i.dateB)
                const data = {
                    labels,
                    datasets: [
                      {
                        label: response.data.data.basename,
                        data: JSON.parse(response.data.data.df).map(i=>i.reserveB),
                        borderColor: '#263bb0',
                        backgroundColor: '#263bb0',
                        pointStyle:'cross',

                      },{
                        label:  response.data.data.subname,
                        data: JSON.parse(response.data.data.df).map(i=>i.reserveS),
                        borderColor: '#9b3cac',
                        backgroundColor: '#9b3cac',
                        pointStyle:'cross',

                      }
                    ]}
                setChart(<Line options={options} data={data} />)
            }



        }else{
            setMsg(response.data.msg)
        }

    })
}

    useEffect(handleGetList,[])
    useEffect(handleGetReserve,[etfSelect, fromDate, toDate])

    return(
        <aside>
            <div id="tableReserve">
                {chart}
            </div>
            <Alarm msg={msg} smsg={setMsg} />
            <div className='EtfOption'>
                <label>از تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                <label>تا تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
 

                <label>قیاس</label>
                <input list='browsers' onChange={(e)=>handleEtfSelect(e.target.value)} />
                <datalist id="browsers">
                    {etfList.map(items=>{
                        return(
                            <option key={Math.random(Math.random()*100000000)} value={items.symbol}>{items.name}</option>
                        )
                    })
                    }
                </datalist>
                <label>دریافت</label>
                <div className='StocksDownloadBox'>
                    <button onClick={exportPdf}>PDF</button>
                </div>
            </div>
        </aside>
    )
}

export default Reserve
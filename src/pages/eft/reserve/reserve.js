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

const Reserve = ()=>{
    const username = getCookie('username');
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const [etfList, setEtfList] = useState([])
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
        },
      };
    const [fromDate, setFromDate] = useState(false)
    const [toDate, setToDate] = useState(false)
    const [etfSelect, setEtfSelect] = useState(null)
    const [msg, setMsg] = useState(null)
    const [chart, setChart] = useState(null)


    
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
            if (response.data.dfsub.replay==false){
            const labels = JSON.parse(response.data.dfbase.data).map(i=>i.date)
            const data = {
                labels,
                datasets: [
                  {
                    label: response.data.dfbase.name,
                    data: JSON.parse(response.data.dfbase.data).map(i=>i.reserve),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },]}
            setChart(<Line options={options} data={data} />)
            }else{
                const labels = JSON.parse(response.data.dfbase.data).map(i=>i.date)
                const data = {
                    labels,
                    datasets: [
                      {
                        label: response.data.dfbase.name,
                        data: JSON.parse(response.data.dfbase.data).map(i=>i.reserve),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      },{
                        label: response.data.dfsub.name,
                        data: JSON.parse(response.data.dfsub.data).map(i=>i.reserve),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
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
    useEffect(handleGetReserve,[etfSelect])

    return(
        <aside>
            {chart}
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

            </div>
        </aside>
    )
}

export default Reserve
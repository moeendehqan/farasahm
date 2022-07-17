import { getCookie } from "../../../components/cookie"
import Alarm from '../../../components/alarm/alarm'
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import { useEffect, useState } from "react"
import './update.css'
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';

const PortfolioUpdate = () =>{
    const username = getCookie('username')
    const [TBS, SetTBS] = useState(null)
    const [msg, setMsg] = useState(null)
    const [method, setMethod] = useState('فایل TBS')
    const [ dateTrade ,setDateTrade ] = useState(null)


    const handleDateTrade = (date) =>{setDateTrade(DatePickerToInt(date))}

    const handleUpdateFileTBS = () =>{
        if (TBS===null){
            setMsg('فایل را بار گذاری کنید')
        }else{
            const formData = new FormData();
            formData.append('TBS',TBS)
            formData.append('username',username)
            axios({
                method:'POST',
                url: serverAddress + '/portfolio/updatetbs',
                data: formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(Response=>{
                setMsg(Response.data.msg)
            })    
        }
    }

    return(
        <div className="dashboard">
            <div className='UpdateStocks'>
                <h3>بروزرسانی</h3>
                {method=='فایل TBS'?
                <div className="PortfolioUpdateMethode">
                    <label>فایل فهرست معاملات
                        <input type='file' onChange={e=>SetTBS(e.target.files[0])}></input>
                    </label>
                    
                    <button onClick={handleUpdateFileTBS}>تایید</button>
                </div>:
                <div className="PortfolioUpdateMethode">
                    <lable>تاریخ
                        <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={date => handleDateTrade(date)}/>
                    </lable>
                    <button onClick={handleUpdateFileTBS}>تایید</button>
                </div>}
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='PortfolioOption'>
                <label>روش</label>
                <select value={method} onChange={e=>setMethod(e.target.value)}>
                    <option value='فایل TBS'>فایل TBS</option>
                    <option value='دستی'>دستی</option>
                </select>

            </div>
        </div>
    )
}

export default PortfolioUpdate
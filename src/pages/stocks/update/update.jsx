import './update.css'
import { getCookie } from "../../../components/cookie"
import Alarm from '../../../components/alarm/alarm'
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import { useEffect, useState } from "react"

const UpdateStocks = () =>{
    const username = getCookie('username')
    const [fileTrade, setFileTrade] = useState(null)
    const [fileRegister, SetFileRegister] = useState(null)
    const [msg, setMsg] = useState(null)
    const [bulletin, setBulletin] = useState(null)

    const handleGetDataUpdate = () =>{
        axios({
            method:'POST',
            url: serverAddress+'/stocks/dataupdate',
            data:{
                username:username
            }
        }).then(response=>{
            if(response.data.replay){
                setBulletin(response.data.data)
            }
        })
    }

    const handleSubmit = async() =>{
        if (fileTrade===null){
            setMsg('فایل معاملات را بارگذاری کنید')
        }else if(fileRegister===null){
            setMsg('فایل ریجیستر را بارگذاری کنید')
        }else{
            const formData = new FormData();
            formData.append('Trade',fileTrade)
            formData.append('Register',fileRegister)
            formData.append('user',username)
            await axios({
                method: 'post',
                url: serverAddress+'/stocks/update',
                data: formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(response=>{
                setMsg(response.data.msg)
                if(response.data.replay){
                    setFileTrade(null)
                    SetFileRegister(null)
                }            })        }    }


    useEffect(handleGetDataUpdate,[msg])

    return(

        <div className='dashboard'>
            <div className='UpdateStocks'>
                <div>
                    <h3>بروزرسانی</h3>
                    <div>
                        <label>
                            <p>فایل معاملات</p>
                            <input type='file' onChange={e=>setFileTrade(e.target.files[0])}></input>
                        </label>
                        <label>
                            <p>فایل رجیستر</p>
                            <input type='file' onChange={e=>SetFileRegister(e.target.files[0])}></input>
                        </label>
                    </div>
                        <button onClick={handleSubmit}>ثبت</button>
                </div>
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='updateBulletin'>
                <div>
                    <span>اخرین بروزرسانی</span>
                    <h2>{bulletin!=null?bulletin.lastUpdate.toString():null}</h2>
                </div>
                <div>
                    <span>تعداد بروزرسانی</span>
                    <h2>{bulletin!=null?bulletin.cuntUpdate.toLocaleString():null}</h2>
                </div>
                <div>
                    <span>تعداد معاملات</span>
                    <h2>{bulletin!=null?bulletin.cuntTrade.toLocaleString():null}</h2>
                </div>
                <div>
                    <span>تعداد معاملگران</span>
                    <h2>{bulletin!=null?bulletin.cuntTrader.toLocaleString():null}</h2>
                </div>
            </div>
        </div>
    )
}

export default UpdateStocks
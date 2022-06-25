import './update.css'
import { getCookie } from "../../../components/cookie"
import Alarm from '../../../components/alarm/alarm'
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import { useEffect, useState } from "react"
import Loader from '../../../components/loader/loader'
import MiniLoader from '../../../components/loader/miniloader'

const UpdateStocks = () =>{
    const username = getCookie('username')
    const [fileTrade, setFileTrade] = useState(null)
    const [fileRegister, SetFileRegister] = useState(null)
    const [msg, setMsg] = useState(null)
    const [bulletin, setBulletin] = useState(null)
    const [loading, setLoading] = useState(false)
    const [unavailable, setUnavailable] = useState(null)

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
                axios({
                    method:'POST',
                    url: serverAddress+'/stocks/unavailable',
                    data:{
                        username: username
                    }
                }).then(res=>{
                    setUnavailable(res.data)
                    console.log(res.data)
                })
            }
        })
    }

    const handleSubmit = async() =>{
        if (fileTrade===null){
            setMsg('فایل معاملات را بارگذاری کنید')
        }else if(fileRegister===null){
            setMsg('فایل ریجیستر را بارگذاری کنید')
        }else{
            setLoading(true)
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
                setLoading(false)
                setMsg(response.data.msg)
                if(response.data.replay){
                    setFileTrade(null)
                    SetFileRegister(null)
                }            })        }    }

    const handleUnavailebleList= ()=>{
        const text = <p>روز های که بروزرسانی انجام نشده</p>
        const listDate = unavailable.listDate.map(i=>{
            return(
                <span>{i}</span> 
            )
        })
        setMsg(<div className='UnavailableMsg'>
                    {text}
                    {listDate}
                </div>)


    }
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
                    <h2>{bulletin!=null?bulletin.lastUpdate.toString():<MiniLoader/>}</h2>
                </div>
                <div>
                    <span>تعداد بروزرسانی</span>
                    <h2>{bulletin!=null?bulletin.cuntUpdate.toLocaleString():<MiniLoader/>}</h2>
                </div>
                <div>
                    <span>بروزرسانی ناموجود</span>
                    <h2 onClick={handleUnavailebleList}>{unavailable==null?<MiniLoader/>:
                    unavailable.count.toLocaleString()
                    }</h2>
                </div>
                <div>
                    <span>تعداد معاملات</span>
                    <h2>{bulletin!=null?bulletin.cuntTrade.toLocaleString():<MiniLoader/>}</h2>
                </div>
                <div>
                    <span>تعداد معاملگران</span>
                    <h2>{bulletin!=null?bulletin.cuntTrader.toLocaleString():<MiniLoader/>}</h2>
                </div>
            </div>
            {loading?<Loader />:null}
        </div>
    )
}

export default UpdateStocks
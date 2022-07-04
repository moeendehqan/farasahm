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
    const [daily, SetDaily] = useState(null)
    const [registerDaily, SetRegisterDaily] = useState(null)
    const [msg, setMsg] = useState(null)
    const [bulletin, setBulletin] = useState(null)
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

                })
            }
        })
    }

    const handleSubmitdaily = async() =>{
        if (daily===null){
            setMsg('(TCR) فایل معاملات روزانه')
        }else{
            const formData = new FormData();
            formData.append('daily',daily)
            formData.append('registerdaily',registerDaily)
            formData.append('user',username)
            await axios({
                method: 'post',
                url: serverAddress+'/stocks/update',
                data: formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(response=>{
                    setMsg(response.data.msg)
        })        }    }




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
                  <h3>بروزرسانی</h3>
                <div>
                    <div>
                        <label>
                            <p>(TCR) فایل معاملات روزانه</p>
                            <input type='file' onChange={e=>SetDaily(e.target.files[0])}></input>
                        </label>
                        <label>
                            <p>فایل رجیستری روزانه سهام عادی</p>
                            <input type='file' onChange={e=>SetRegisterDaily(e.target.files[0])}></input>
                        </label>
                    </div>
                        <button onClick={handleSubmitdaily}>ثبت</button>
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
        </div>
    )
}

export default UpdateStocks
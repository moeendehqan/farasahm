import { useState } from "react"
import './update.css'
import { getCookie } from "../../../components/cookie"
import Alarm from '../../../components/alarm/alarm'
import axios from 'axios'
import { serverAddress } from "../../../config/config"

const UpdateStocks = () =>{
    const username = getCookie('username')
    const [fileTrade, setFileTrade] = useState(null)
    const [fileRegister, SetFileRegister] = useState(null)
    const [msg, setMsg] = useState(null)


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

    return(

        <aside >
            <div className='UpdateStocks'>
            <h3>بروزرسانی</h3>
                <label>
                    <p>فایل معاملات</p>
                    <input type='file' onChange={e=>setFileTrade(e.target.files[0])}></input>
                </label>
                <label>
                    <p>فایل رجیستر</p>
                    <input type='file' onChange={e=>SetFileRegister(e.target.files[0])}></input>
                </label>
                <button onClick={handleSubmit}>ثبت</button>
            </div>

            <Alarm msg={msg} smsg={setMsg}/>

        </aside>


    )
}

export default UpdateStocks
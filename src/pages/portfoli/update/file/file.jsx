
import {useState} from 'react'
import axios from 'axios'
import { serverAddress } from '../../../../config/config'
import './file.css'
const Wfile = (props)=>{

    const [filetrade, setFiletrade] = useState('')
    const [msg, setMsg] = useState('')

    const handleSubmit = () =>{
        if (filetrade===''){
            setMsg('فایل معاملات را بارگذاری کنید')
        }else{
            const formData = new FormData()
            formData.append('filetrade',filetrade)
            formData.append('username',props.username)
            setMsg('')
            axios({
                method: 'post',
                url: serverAddress+'/portfoli/update',
                data: formData,
                config: {headers:{'content-type': 'multipart/form-data'}}
                }).then(Response=>{
                    setMsg(Response.data.msg)
                })

        }

    }


    return(
        <div>
            <div className='portfoliupdatecontiner'>
                <h2>بروزرسانی با فایل</h2>
                <label>فایل
                    <input type='file' onChange={(e)=>setFiletrade(e.target.files[0])}></input>
                </label>
                <button onClick={handleSubmit}>بارگذاری</button>
                {msg!==''?
                    <div className='portfoliupdatefilemsg'>
                        <p>{msg}</p>
                        <button onClick={()=>setMsg('')}>تایید</button>
                    </div>
                    :null}
            </div>
        </div>
    )
}

export default Wfile
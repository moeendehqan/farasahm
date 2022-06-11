import { getCookie } from '../../../components/cookie'
import {useState} from 'react'
import axios from 'axios'
import { serverAddress } from '../../../config/config'

const Update = () =>{
    const [filetrade, setFiletrade] = useState('')
    const [msg, setMsg] = useState('')

    const handleSubmit = () =>{
        if (filetrade===''){
            setMsg('فایل معاملات را بارگذارری کنید')
        }else{
            const formData = new FormData()
            formData.append('filetrade',filetrade)
            formData.append('username',getCookie('username'))
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
            <label>
                فایل
                <input type='file' onChange={(e)=>setFiletrade(e.target.files[0])}></input>
            </label>
            <button onClick={handleSubmit}>بارگذاری</button>
            <span>{msg}</span>
        </div>
    )
}

export default Update
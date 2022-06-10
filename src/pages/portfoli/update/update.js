import { getCookie } from '../../../components/cookie'
import {useState} from 'react'


const Update = () =>{
    const [filetrade, setFiletrade] = useState('')
    const [msg, setMsg] = useState('')
    


    return(
        <div>
            <label>
                فایل
                <input type='file' onChange={(e)=>setFiletrade(e.target.files[0])}></input>

            </label>
        </div>
    )
}

export default Update
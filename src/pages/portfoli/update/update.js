import {useState} from 'react'
import './update.css'
import Wfile from './file/file'
import Wform from './form/form'
const Update = () =>{
    const [tab, setTab] = useState(<Wfile/>)


    return(
        <div>
            <div>
                <button onClick={()=>setTab(<Wfile/>)}>فایل</button>
                <button onClick={()=>setTab(<Wform/>)}>دستی</button>
            </div>
            {tab}
        </div>
    )
}

export default Update
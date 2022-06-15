import {useState} from 'react'
import './update.css'
import Wfile from './file/file'
import Wform from './form/form'
const Update = () =>{
    const [tabradio, setTabradio] = useState('file')
    const [tab, setTab] = useState(<Wfile/>)

    const handletab = (e) =>{
        setTabradio(e.target.value)
        if(e.target.value==='file'){setTab(<Wfile/>)
        }else if(e.target.value==='manual'){setTab(<Wform/>)}
    }

    

    return(
        <div>
            <div className='portfolioseting'>
                <div className='portfoliupdatetab' onChange={(e)=>handletab(e)}>
                    <input className='portfoliupdateradio' type="radio" value="manual" name='manual' checked={tabradio==='manual'} />دستی
                    <input className='portfoliupdateradio' type="radio" value="file" name='file' checked={tabradio==='file'} />فایل
                </div>
            </div>
            <div>
                {tab}
                <p>sssss</p>
            </div>
        </div>
    )
}

export default Update
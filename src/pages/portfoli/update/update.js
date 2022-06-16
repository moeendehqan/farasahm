import {useState, useEffect} from 'react'
import './update.css'
import Wfile from './file/file'
import Wform from './form/form'
import Statisticsupdate from '../../../components/statisticsupdate/statisticsupdate'
import { getCookie } from '../../../components/cookie'
import { serverAddress } from '../../../config/config'
import axios from 'axios'

const Update = () =>{
    const [tabradio, setTabradio] = useState('file')
    const [tab, setTab] = useState(<Wfile/>)
    const username = getCookie('username')
    const [customerlist, setCustomerlist] = useState('')
    const [numTrade, setNumTrade] = useState('')
    const [lastUpdate, setLastUpdate] = useState('')
    

    const getListCustomer = ()=>{
        axios({
           method: 'post',
           url: serverAddress+'/portfoli/customerupdate',
           data: { username:username}
           }).then(Response=>{
               if (Response.data.replay){
                   setCustomerlist(Response.data.databack.customerNames)
                   setNumTrade(Response.data.databack.numTrade)
                   setLastUpdate(Response.data.databack.lastUpdate)
              }else{
               setCustomerlist('')
           }})
        
        }

    const handletab = (e) =>{
        setTabradio(e.target.value)
        if(e.target.value==='file'){setTab(<Wfile username={username} />)
        }else if(e.target.value==='manual'){setTab(<Wform username={username} customerlist={customerlist} />)}
    }

    
    useEffect(getListCustomer,[])

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
                <Statisticsupdate nameuser={customerlist.length} numTrade={numTrade} lastUpdate={lastUpdate}/>
            </div>
        </div>
    )
}

export default Update
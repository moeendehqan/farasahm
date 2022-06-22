import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './sediment.css'
import Alarm from '../../../components/alarm/alarm'
import Loader from '../../../components/loader/loader'

const Sediment = () =>{
    const username = getCookie('username')
    const [period, setPeriod] = useState(3)
    const [sedimentVolume, setSedmentVolume] = useState(null)
    const [sedimentCount, setSedmentCount] = useState(null)
    const [sedimentData, setSedmentData] = useState(null)
    const [msg, setMsg] = useState(null)
    const [loading, setLoading] = useState(true)

    const handleSediment = () =>{
        setLoading(true)
        axios({
            method: 'POST',
            url: serverAddress+'/stocks/sediment',
            data: {
                username:username,
                period:period,
            }
        }).then(response=>{
            if(response.data.replay){
                setSedmentVolume(response.data.sumSediment)
                setSedmentCount(response.data.countSediment)
                setSedmentData(response.data.data)
                setLoading(false)
            }else{
                setSedmentVolume(null)
                setSedmentCount(null)
                setSedmentData(null)
                setMsg(response.data.msg)
                setLoading(false)
            }
        })
    }
    useEffect(handleSediment,[period])

    return(
        <aside>
            <div className='SedimentSum'>
                <div>
                    <h3>حجم رسوب</h3>
                    <p>{sedimentVolume!=null?sedimentVolume.toLocaleString():'-'}</p>
                </div>
                <div>
                    <h3>تعداد سهامداران رسوبی</h3>
                    <p>{sedimentCount!=null?sedimentCount.toLocaleString():'-'}</p>
                </div>
                <div>
                    <h3>سرانه سهامداران رسوبی</h3>
                    <p>{sedimentCount!=null?Math.round(sedimentVolume/sedimentCount).toLocaleString():'-'}</p>
                </div>
            </div>
            
                {sedimentData==null?null:
                <div className='SedimentAll'>
                    <div className='SedimentTheader'>
                        <h4 className='SedimentName'>نام</h4>
                        <h4 className='SedimentVolume'>حجم رسوب</h4>
                    </div>
                    <div className='SedimentTbody'>
                            {sedimentData.map(items=>{
                                const weg = {width: (items.w*90).toString()+'%'}
                                return(
                                <div key={items.B_account}>
                                    <p className='SedimentName'>{items.B_account}</p>
                                    <div className='SedimentVolume'>
                                        <div style={weg}>
                                            <p>{items.balance.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    
                                </div>
                                )})}


                    </div>

                </div>
                }



            <div className='StocksOption'>
                <select value={period} onChange={(e)=>setPeriod(e.target.value)}>
                    <option value='3'>سه ماهه گذشته</option>
                    <option value='6'>شش ماهه گذشته</option>
                    <option value='9'>نه ماهه گذشته</option>
                    <option value='12'>یکسال گذشته</option>
                </select>
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
            {loading?<Loader />:null}
        </aside>
    )

}

export default Sediment
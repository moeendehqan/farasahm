import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import './station.css'
import Loader from '../../../components/loader/loader'

const Station = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [side, setSide] = useState('Buy_brkr')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [dataStation, setDataStation] = useState(null)
    const [loading, setLoading] = useState(true)



    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetStation = () =>{
        setLoading(true)
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/station',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
                side:side
            }
        }).then(Response=>{
            setLoading(false)
            if(Response.data.replay){
                setDataStation(Response.data.data)
            }else{
                setMsg(Response.data.msg)
            }
        })
    }

useEffect(handleGetStation, [fromDate,toDate,side])

    return(
        <aside>
            <div>
                <h3>ایستگاهای معاملاتی</h3>
                <div>
                    <div className='StationTheader'>
                        <p className='StationTistgah'>ایستگاه</p>
                        <p className='StationTvolum'>حجم</p>
                        <p className='StationTcunt'>تعداد</p>
                    </div>
                    <div className='StationTbody'>
                        {dataStation===null?null:
                            dataStation.map(items=>{
                                const weg ={
                                    width:(items.w *85)+'%'
                                }
                                return(
                                    <div key={items.Istgah} className='StationTbar'>
                                        <p className='StationTistgah'>{items.Istgah}</p>
                                        <div className='StationTvolum'>
                                            <div style={weg}>
                                                <p>{items.Volume.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <p className='StationTcunt'>{items.count.toLocaleString()}</p>
                                    </div>
                                )
                            })
                        
                        }

                    </div>
                </div>
                <Alarm msg={msg} smsg={setMsg} />
            </div>
            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='Buy_brkr'>خرید</option>
                    <option value='Sel_brkr'>فروش</option>
                </select>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>
            </div>
            {loading?<Loader />:null}
        </aside>
    )
}

export default Station
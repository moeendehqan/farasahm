
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './traders.css'
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';

const Traders = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [dataTraders, setDataTraders] = useState(null)
    const [side, setSide] = useState('buy')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)


    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetDataTraders = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traders',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
                side:side
            }
        }).then(response=>{
            if(response.data.replay){
                setDataTraders(response.data.data)
            }else{
                setMsg(response.data.msg)
                setDataTraders(null)
            }        })    }

    const infoTraders = (code) =>{
        axios({
            method:'POST',
            url:serverAddress+'/stocks/infocode',
            data:{
                username:username,
                code:code
            }
        }).then(response=>{
                setMsg(response.data.msg)
                })    }
        
        const historiCode = (code) =>{
            axios({
                method:'POST',
                url:serverAddress+'/stocks/historicode',
                data:{
                    username:username,
                    code:code
                }
            }).then(response=>{
                    console.log(response.data.data)
                    })    }


    useEffect(handleGetDataTraders,[fromDate, toDate, side])

    return(
        <aside>
            <div>
                <h3>معاملگران</h3>
                {dataTraders===null?null:
                <div>
                    <div className='stocksTheader'>
                        <p className='StocksTname'>نام</p>
                        <p className='StocksTvolume'>حجم</p>
                        <p className='StocksTprice'>قیمت</p>
                        <p className='StocksTinfo'>مشخصات</p>
                        <p className='StocksTbehavior'>رفتار</p>
                    </div>
                    {dataTraders.map(items=>{
                        const weg = {width :(items.w*85)+'%'}
                        return(
                            <div key={items.code} className='StocksTbody'>
                                <p className='StocksTname'>{items.name}</p>
                                <div className='StocksTvolume'>
                                    <div style={weg} className='stocksTbar'><p>{items.volume.toLocaleString()}</p></div>
                                </div>
                                <p className='StocksTprice'>{items.price.toLocaleString()}</p>
                                <div className='StocksTinfo'><button onClick={()=>infoTraders(items.code)}>[نمایش]</button></div>
                                <div className='StocksTbehavior'><button onClick={()=>historiCode(items.code)}>نمودار</button></div>
                            </div>
                        )
                    })}
                </div>
                }
                <Alarm msg={msg} smsg={setMsg}/>
            </div>
            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='buy'>خرید</option>
                    <option value='sel'>فروش</option>
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

        </aside>
    )
}

export default Traders
import './details.css'
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import {useLocation} from 'react-router-dom';
import Loader from '../../../components/loader/loader'

const Details = () => {
    const location = useLocation(); 
    const username = getCookie('username')
    const [listTrader, setListTrader] = useState([])
    const [traderSelect, setTraderSelect] = useState(location.state)
    const [listTrade, setListTrade] = useState([])
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [loading, setLoading] = useState(true)




    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetDetails = () => {
        const inList = (listTrader.find(i => i.Account==traderSelect))
        if(inList!= undefined && inList.Account==traderSelect){
            setLoading(true)
            axios({
                method: 'POST',
                url:serverAddress+'/stocks/detailes',
                data:{
                    username:username,
                    account:traderSelect,
                    fromDate:fromDate,
                    toDate:toDate
                }
            }).then(Response=>{
                setLoading(false)
                if(Response.data.replay){
                    setListTrade(Response.data.data)
                }
            })
        }

    }

    const handleGetDetailsLoction = () => {
        if(location.state){
            setLoading(true)
            axios({
                method: 'POST',
                url:serverAddress+'/stocks/detailes',
                data:{
                    username:username,
                    account:location.state,
                    fromDate:false,
                    toDate:false
                }
            }).then(Response=>{
                setLoading(false)
                if(Response.data.replay){
                    setListTrade(Response.data.data)
                }
            })
        }

    }

    const handleGetTraderList = () =>{

        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traderlist',
            data:{
                username:username
            }
        }).then(response =>{
            setListTrader(response.data.data)
        })

    }

    useEffect(handleGetTraderList,[])
    useEffect(handleGetDetailsLoction,[location.state])
    useEffect(handleGetDetails,[traderSelect, fromDate, toDate])

    return(
        <aside className='Details'>
            {listTrade.length>0?
            <table>
                <thead>
                    <tr>
                        <td className='DetailsVolume'>حجم</td>
                        <td className='DetailsPrice'>قیمت</td>
                        <td className='DetailsSaller'>فروشنده</td>
                        <td className='DetailsBuyer'>خریدار</td>
                        <td className='DetailsDate'>تاریخ</td>
                        <td className='DetailsTime'>ساعت</td>
                    </tr>
                </thead>
                <tbody>
            {listTrade.map(items=>{
                return(
                    <tr>
                        <td className='DetailsVolume'>{items.Volume.toLocaleString()}</td>
                        <td className='DetailsPrice'>{items.Price.toLocaleString()}</td>
                        <td className='DetailsSaller'>{items.S_account}</td>
                        <td className='DetailsBuyer'>{items.B_account}</td>
                        <td className='DetailsDate'>{items.Date}</td>
                        <td className='DetailsTime'>{items.Time}</td>
                    </tr>
                )
            })}
                </tbody>
            </table>
            :null}
            {listTrader.length===0?null:
            <div className='StocksOption'>
                <label>نام</label>
                <input value={traderSelect}  list='browsers' onChange={(e)=>setTraderSelect(e.target.value)} />
                <datalist id="browsers">
                    {listTrader.map(items=>{
                        return(
                            <option key={items.Account} value={items.Account}>{items.Fullname}</option>
                        )
                    })

                    }
                </datalist>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>
            </div>}
            {loading?<Loader />:null}
        </aside>
    )
}

export default Details
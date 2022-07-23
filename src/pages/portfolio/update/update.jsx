import { getCookie } from "../../../components/cookie"
import Alarm from '../../../components/alarm/alarm'
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import { useEffect, useState } from "react"
import './update.css'
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';

const PortfolioUpdate = () =>{
    const username = getCookie('username')
    const [TBS, SetTBS] = useState(null)
    const [msg, setMsg] = useState(null)
    const [method, setMethod] = useState('فایل TBS')
    const [investorList, setInvestorList] = useState(null)
    const [symbolList, setSymbolList] = useState(null)

    const [dateTrade ,setDateTrade ] = useState(null)
    const [invester, setInvester] = useState('')
    const [side, setSide] = useState('buy')
    const [symbol, setSymbol] = useState('')
    const [price, setPrice] = useState('')
    const [amunt, setAmunt] = useState('')

console.log(price>0)
    const handleDateTrade = (date) =>{setDateTrade(DatePickerToInt(date))}

    const handleUpdateManual = ()=>{
        const inListInvestor = investorList.find(i=>i.code==invester)
        const inListSymbol = symbolList.find(i=>i.name==symbol)
        if(dateTrade<13850000){setMsg('لطفا تاریخ را به صورت صحیح واردکنید')
        }else if(inListInvestor==undefined){setMsg('لطفا نام سرمایه گذار را انتخاب کنید')
        }else if(inListInvestor==invester){setMsg('سرمایه گذار میبایست از اسامی لیست انتخاب شود')
        }else if(inListSymbol==undefined){setMsg('لطفا نماد را انتخاب کنید')
        }else if(inListSymbol==symbol){setMsg('نماد میبایست از نماد های لیست باشد')
        }else if(!price>0){setMsg('لطفا قیمت را واردکنید')
        }else if(!amunt>0){setMsg('لطفا تعداد را وارد کنید')
        }else{
            axios({method:"POST",url:serverAddress+'/portfolio/updatemanual',
                data:{username:username, date:dateTrade, invester:invester, side:side, symbol:symbol, price:price, amunt:amunt}
            }).then(Response=>{
                if(Response.data.replay){
                    setMsg('اطلاعات با موفقیت بروز شد')
                    setDateTrade(null)
                    setInvester('')
                    setSymbol('')
                    setPrice('')
                    setAmunt('')
                }else{setMsg('مشکلی پیش آمده لطفا مجددا تلاش کنید')}
            })
        }
    }

    const handleGetInvestorList = ()=>{
        axios({method:"POST",url:serverAddress+'/portfolio/investorlist',data:{username:username}
    }).then(Response=>{setInvestorList(Response.data.df)})}

    const handleGetSymbolList = ()=>{
        axios({method:"POST",url:serverAddress+'/portfolio/symbolelist'
    }).then(Response=>{setSymbolList(Response.data)})}

    const handleUpdateFileTBS = ()=>{
        if (TBS===null){setMsg('فایل را بار گذاری کنید')
        }else{
            const formData = new FormData();
            formData.append('TBS',TBS)
            formData.append('username',username)
            axios({method:'POST',url: serverAddress + '/portfolio/updatetbs',data: formData,
            config: {headers:{'content-type': 'multipart/form-data'}}
            }).then(Response=>{setMsg(Response.data.msg)})}}

    useEffect(handleGetInvestorList,[])
    useEffect(handleGetSymbolList,[])

    return(
        <div className="dashboard">
            <div className='UpdateStocks'>
                <h3>بروزرسانی</h3>
                {method=='فایل TBS'?
                <div className="PortfolioUpdateMethode">
                    <label>فایل فهرست معاملات
                        <input type='file' onChange={e=>SetTBS(e.target.files[0])}></input>
                    </label>
                    <button onClick={handleUpdateFileTBS}>تایید</button>
                </div>:
                <div className="PortfolioUpdateMethode">
                    <label className='PortfolioFild'>
                        <p>سرمایه گذار</p>
                        <input list='browser' onChange={(e)=>setInvester(e.target.value)}/>
                        <datalist id='browser'>
                            {investorList.map(items=>{
                            return(
                                <option key={items.code} value={items.code}>{items.name}</option>
                            )                            })                            }
                        </datalist>
                    </label>
                    <label className='PortfolioFild'>
                        <p>تاریخ</p>
                        <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="PortfolioDateFild" onChange={date => handleDateTrade(date)}/>
                    </label>
                    <label className='PortfolioFild'>
                        <p>سمت معامله</p>
                        <select value={side} onChange={(e)=>setSide(e.target.value)}>
                            <option value='buy'>خرید</option>
                            <option value='sel'>فروش</option>
                        </select>
                    </label>
                    <label className='PortfolioFild'>
                        <p>نماد</p>
                        <input list='browsersy' onChange={(e)=>setSymbol(e.target.value)}/>
                        <datalist id='browsersy'>
                            {symbolList.map(items=>{
                            return(
                                <option key={items.name} value={items.name}>{items.name}</option>
                            )                            })                            }
                        </datalist>
                    </label>
                    <label className='PortfolioFild'>
                        <p>قیمت</p>
                        <input type='Number' value={price} onChange={(e)=>setPrice(e.target.value)}/>
                    </label>
                    <label className='PortfolioFild'>
                        <p>تعداد</p>
                        <input type='Number' value={amunt} onChange={(e)=>setAmunt(e.target.value)}/>
                    </label>
                    <button onClick={handleUpdateManual}>تایید</button>
                </div>}
            </div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='PortfolioOption'>
                <label>روش</label>
                <select value={method} onChange={e=>setMethod(e.target.value)}>
                    <option value='فایل TBS'>فایل TBS</option>
                    <option value='دستی'>دستی</option>
                </select>
            </div>
        </div>
    )
}

export default PortfolioUpdate
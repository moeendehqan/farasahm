import './form.css'
import { useEffect, useState } from 'react'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { getCookie } from '../../../../components/cookie'
import { serverAddress } from '../../../../config/config'
import axios from 'axios'


const Wform = ()=>{

    const [symbol, setSymbol] = useState('')
    const [symbolList, setSymbolList] = useState('')
    const [amunt, setAmunt] = useState('')
    const [price, setPrice] = useState('')
    const [customerSelect, setCustomerSelect] = useState('')
    const [customerlist, setCustomerlist] = useState('')
    const [dateselect, setDateselect] = useState('')
    const [msg, setMsg] = useState('')
    const [side, setSide] = useState('خرید')
    const username = getCookie('username')

    const handleCustomerselect = (e) =>{setCustomerSelect(e.target.value)}
    const handleSymbolList = (e) =>{setSymbol(e.target.value)}
    const clean = (e) =>{e.target.value=''}
    const handldeSubmit = () =>{
    if(symbol==''){setMsg('نام نماد را وارد کنید')
    }else if(!(symbolList.indexOf(symbol)>=0)){setMsg('نام نماد را صحیح وارد کنید')
    }else if(!(customerlist.indexOf(customerSelect)>=0)){setMsg('نام مشتری را صحیح وارد کنید')
    }else if(customerSelect===''){setMsg('نام مشتری را وارد کنید')
    }else if(!(amunt>0)){setMsg('تعداد را وارد کنید')
    }else if(!(price>0)){setMsg('قیمت را وارد کنید')
    }else if(!(dateselect>0)){setMsg('تاریخ را وارد کنید')
    }else if(side===''){setMsg('موقعیت معامله را وارد کنید')
    }else{
        updateform()
        setMsg('ارسال شد')
    }
    }

    
    const getListCustomer = ()=>{
        
         axios({
            method: 'post',
            url: serverAddress+'/portfoli/customerlist',
            data: { username:username}
            }).then(Response=>{
                if (Response.data.replay){
                    setCustomerlist(Response.data.databack)
               }else{
                setCustomerlist('')
            }})}

        const getSymbolList = () =>{
            axios({
                method:"GET",
                url:serverAddress+'/portfoli/getallsymbol'
            }).then(Response=>{
                    setSymbolList(Response.data.databack)
            })        }

        const updateform = () =>{
            axios({
                method:'POST',
                url:serverAddress+'/portfoli/updateform',
                data:{
                    username:username,
                    date:dateselect,
                    side:side,
                    customer:customerSelect,
                    symbol:symbol,
                    amunt:amunt,
                    price:price,
                }}).then(Response=>{
                    console.log(Response.data)
                })}

    const handleDataselect = (date)=>{
        const yd = (date.year).toString()
        if(date.month.index+1<10){
            var md = '0'+(date.month.index+1).toString()
        }else{var md = (date.month.index+1).toString()}
        if(date.day<10){
            var dd = '0'+(date.day).toString()
        }else{var dd = (date.day).toString()}
        setDateselect(yd+md+dd)
    }



useEffect(getListCustomer,[])
useEffect(getSymbolList,[])

    return(
        <div className="portfoliwform">
            <div className="continer">
                <label>
                    مشتری:
                    <input type="input" list="optionsList" onChange={(e)=>handleCustomerselect(e)} onClick={(e)=>clean(e)} placeholder="نام مشتری"/>
                <datalist id="optionsList">
                    {customerlist.length!==0?customerlist.map((o) => (<option key={o}>{o}</option>)):null}
                </datalist>
                </label>
                <br/>
                <label>
                    نماد:
                    <input type="input" list="optionsListt" onChange={(e)=>handleSymbolList(e)} onClick={(e)=>clean(e)} placeholder="نماد"/>
                <datalist id="optionsListt">
                    {symbolList.length!==0?symbolList.map((o) => (<option key={o}>{o}</option>)):null}
                </datalist>
                </label>
                <br/>
                <label>
                    موقعیت
                    <select onChange={(e)=>setSide(e.target.value)}>
                        <option value='خرید'>خرید</option>
                        <option value='فروش'>فروش</option>
                    </select>
                </label>
                <br />
                <label>
                    تعداد
                    <input type='number' value={amunt} onChange={(e)=>setAmunt(e.target.value)}></input>
                </label>
                <br/>
                <label>
                    قیمت
                    <input type='number' value={price} onChange={(e)=>setPrice(e.target.value)}></input>
                </label>
                <br/>
                <DatePicker calendar={persian} locale={persian_fa} onChange={handleDataselect} />
                <br/>
                <button onClick={(handldeSubmit)}>ثبت</button>
                <br />
                <span>{msg}</span>
            </div>
        </div>
    )
}

export default Wform
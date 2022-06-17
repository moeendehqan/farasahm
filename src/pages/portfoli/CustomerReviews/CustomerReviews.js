import { useState, useEffect} from "react"
import { getCookie } from "../../../components/cookie"
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import PortfoliView from "./portfoliView/portfoliview"
import './customerreview.css'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import "react-multi-date-picker/styles/colors/purple.css"
import Statisticcustomerreview from "../../../components/statisticcustomerreview/statisticcustomerreview"

const CustomerReviews = () =>{
    const [customerlist, setCustomerlist] = useState('')
    const [customerselect, setCustomerselect] = useState('')

 
    const [dateselect, setDateselect] = useState('')
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

    
    const handleCustomerselect = (e)=>{setCustomerselect(e.target.value)}
    const clean = (e) =>{e.target.value=''}
    const [msg, setMsg] = useState('')
    const username = getCookie('username')

    const handleCustomerlist = () =>{
        axios({
            method: 'post',
            url: serverAddress+'/portfoli/customerupdate',
            data: { username:username}
            }).then(Response=>{
                if (Response.data.replay){
                    setCustomerlist(Response.data.databack.customerNames)
                }else{
                    setMsg(Response.data.msg)
                }            })    }

    const [portfoliview, setPortfoliview] = useState(null)
    const [tab, seTab] = useState('asset')
    const handleCustomerReview= () =>{
        if(customerlist.indexOf(customerselect)>=0 && customerselect!==''){
            setPortfoliview(<PortfoliView customer={customerselect} tab={tab} username={username} dateselect={dateselect}/>)
        }
    }

    useEffect(handleCustomerlist,[])
    useEffect(handleCustomerReview,[customerselect,tab,dateselect])


    return(
        <div className="customerreviewportfoli">
            <div className="portfolioseting">
                <div className="portfoliosetingcustomername">
                    <p>نام مشتری</p>
                    <input type="input" list="optionsList" onChange={(e)=>handleCustomerselect(e)} onClick={(e)=>clean(e)} placeholder="نام مشتری"/>
                    <datalist id="optionsList">
                        {customerlist!==''?customerlist.map((o) => (<option key={o}>{o}</option>)):null}
                    </datalist>
                </div>
                <br/>
                {portfoliview!==null?
                    <div>
                        <div className="portfolisetingtab">
                            <button className={tab==='asset'?'portfolisetingtabbtnclck':null} onClick={()=>seTab('asset')}>دارایی</button>
                            <button className={tab==='profitability'?'portfolisetingtabbtnclck':null} onClick={()=>seTab('profitability')}>عملکرد</button>
                        </div>
                        {tab==='profitability'?
                            <div className="portfolisetingdate">
                                <span className="portfolisetingdatetitle">تا تاریخ</span>
                                <DatePicker inputClass="portfolisetingdateinput" calendar={persian} className="purple" locale={persian_fa} onChange={handleDataselect} /></div>:null}
                            </div>
                    :null}
                
                <span>{msg}</span>
            </div>
            <div>
                <Statisticcustomerreview />
            </div>
            
        </div>
    )
}

export default CustomerReviews
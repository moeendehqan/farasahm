import { useState, useEffect} from "react"
import { getCookie } from "../../../components/cookie"
import axios from 'axios'
import { serverAddress } from "../../../config/config"
import PortfoliView from "./portfoliView/portfoliview"

const CustomerReviews = () =>{
    const [customerlist, setCustomerlist] = useState('')
    const [customerselect, setCustomerselect] = useState('')
    const handleCustomerselect = (e)=>{setCustomerselect(e.target.value)}
    const clean = (e) =>{e.target.value=''}
    const [msg, setMsg] = useState('')
    const handleCustomerlist = () =>{
        axios({
            method: 'post',
            url: serverAddress+'/portfoli/customerlist',
            data: { username:getCookie('username')}
            }).then(Response=>{
                if (Response.data.replay){
                    setCustomerlist(Response.data.databack)
                }else{
                    setMsg(Response.data.msg)
                }            })    }

    const [portfoliview, setPortfoliview] = useState(null)
    const handleCustomerReview= () =>{
        if(customerlist.indexOf(customerselect)>=0 && customerselect!==''){
            setPortfoliview(<PortfoliView customer={customerselect}/>)
        }
    }

    useEffect(handleCustomerlist,[])
    useEffect(handleCustomerReview,[customerselect])


    return(
        <div>
            Customer Reviews
            <input type="input" list="optionsList" onChange={(e)=>handleCustomerselect(e)} onClick={(e)=>clean(e)} placeholder="نام مشتری"/>
            <datalist id="optionsList">
                {customerlist!==''?customerlist.map((o) => (<option key={o}>{o}</option>)):null}
            </datalist>
            <br/>
            <span>{msg}</span>
            {portfoliview}
        </div>
    )
}

export default CustomerReviews
import './section.css'
import {getCookie,setCookie} from '../../components/cookie'
import { serverAddress } from '../../config/config'
import axios from 'axios'
import { useState,useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const Section = () => {
    const native = useNavigate()
    const [account, setAccount] = useState('')
    const handleAccount = () =>{
        axios({
            method: 'post',
            url: serverAddress+'/account',
            data: {
                username: getCookie('username'),
            }
            }).then(response=>{
                if(response.data.replay){
                    setAccount(response.data.databack)
                }else{
                    setCookie('username','',0)
                    setCookie('password','',0)
                    native('/')
                }})}
    useEffect(handleAccount,[])
    const handlenav = (a) =>{
        native(a)

    }

    return(
                <div className='Section'>
                    <div>
                        <button disabled={!account.stocks} onClick={()=>handlenav('/stocks/dashboard')}>مدیریت سهام</button>
                        <button disabled={!account.eft} onClick={()=>handlenav('/etf')}><p>صندوق</p><p>(بزودی)</p></button>
                        <button disabled={!account.portfoli} onClick={()=>handlenav('/portfoli')}><p>پرتفوگردانی</p><p>(بزودی)</p></button>
                    </div>
                </div>
        )

}

export default Section
import axios from 'axios'
import { getCookie,setCookie } from "./cookie"
import { serverAddress } from "../config/config"
import { useNavigate } from 'react-router-dom'



const HandleAccount = (section) =>{
    const navigate = useNavigate()
    axios({
        method: 'post',
        url: serverAddress+'/account',
        data: {
            username: getCookie('username'),
        }
        }).then(response=>{
            if(response.data.replay){
                if(!response.data.databack[section]){
                    setCookie('username','',0)
                    setCookie('password','',0)
                    navigate('/')
                }
            }else{
                setCookie('username','',0)
                setCookie('password','',0)
                navigate('/')
            }})}
export default HandleAccount
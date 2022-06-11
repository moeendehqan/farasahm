import './home.css'
import axios from 'axios'
import {useState} from 'react'
import { setCookie, getCookie } from '../../components/cookie'
import { serverAddress } from '../../config/config'
import { useNavigate } from 'react-router-dom'

const Home = () =>{
    const native = useNavigate()
    
    const cookieUsername = getCookie('username')
    const cookiePassword = getCookie('password')
    if(cookieUsername!=='' && cookiePassword!==''){
        axios({
            method: 'post',
            url: serverAddress+'/login',
            data: {
                username: cookieUsername,
                password: cookiePassword
            }
            }).then(response=>{
                if(response.data.replay){
                    setCookie('username',cookieUsername,5)
                    setCookie('password',cookiePassword,5)
                    native('/section')

                }else{
                    setMsg(response.data.msg)
                }
            })
    }


    const [username ,setUser] = useState('')
    const handleUsername = (e) =>{setUser(e.target.value)}

    const [password , setPassword] = useState('')
    const handlePassword = (e) =>{setPassword(e.target.value)}

    const [msg, setMsg] = useState('')

    const handleSubmit = ()=>{
        if (username.length <= 0){
            setMsg('نام کاربری را وارد کنید')
        }else if(password.length <= 0){
            setMsg('رمزعبور را وارد کنید')
        }else{
            axios({
                method: 'post',
                url: serverAddress+'/login',
                data: {
                    username: username,
                    password: password
                }
                }).then(response=>{
                    if(response.data.replay){
                        setCookie('username',username,5)
                        setCookie('password',password,5)
                        native('/section')

                    }else{
                        setMsg(response.data.msg)
                    }
                })
        }
    }

    return(
        <div>
            <label>
                نام کاربری
                <input type='text' onChange={(e)=>handleUsername(e)} placeholder='نام کاربری'></input>
            </label>
            <br />
            <label>
                رمزعبور
                <input type='password' onChange={(e)=>handlePassword(e)} placeholder='رمز عبور'></input>
            </label>
            <br />
            <button onClick={handleSubmit}>ورود</button>
            <br/>
            <span>{msg}</span>
        </div>
    )
}

export default Home

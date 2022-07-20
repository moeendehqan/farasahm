
import Header from "../../components/header/header"
import Menu from "../../components/menu/menu"
import '../../layout/layout.css'
import './portfolio.css'
import { getCookie } from '../../components/cookie'
import HandleAccount from "../../components/cheakaccount"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { serverAddress } from "../../config/config"

const Portfolio = () => {
    const [fullUser, setFullUser] = useState('')

    const menuProperties =[
        {key:1 ,title:'دارایی', navigate:'asset' ,icon:require('../../icon/dashboard.png')},
        {key:2 ,title:'عملکرد', navigate:'revenue' ,icon:require('../../icon/dashboard.png')},
    ]

    const HeaderButtom = [
        {key:1, navigate:'update', icon:require('../../icon/updateButtom.png')},
    ]

    HandleAccount('portfoli')
    const username = getCookie('username')

    const handleName = ()=>{
        axios({
            method:'POST',
            url:serverAddress+'/fulluser',
            data:{
                username:username,
            }
        }).then(Response=>{
            setFullUser(Response.data[0])
        })
    }

    
    useEffect(handleName,[])
    return(
        <div>
            
            <Header section='پرتفوگردانی' fullName={fullUser.fullName} HeaderButtom={HeaderButtom}/>
                <div className='LayoutBasic'>
                    <Menu menuProperties={menuProperties}/>
                    <Outlet/>
                </div>
        </div>
    )
}

export default Portfolio
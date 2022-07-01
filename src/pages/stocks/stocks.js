
import Header from "../../components/header/header"
import Menu from "../../components/menu/menu"
import '../../layout/layout.css'
import './stocks.css'
import { getCookie } from '../../components/cookie'
import HandleAccount from "../../components/cheakaccount"
import { Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { serverAddress } from "../../config/config"

const Stocks = () => {
    const [fullUser, setFullUser] = useState('')
    HandleAccount('stocks')
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

    const menuProperties =[
        {key:1 ,title:'داشبورد', navigate:'dashboard' ,icon:require('../../icon/dashboard.png')},
        {key:2 ,title:'بروزرسانی', navigate:'update' ,icon:require('../../icon/update.png')},
        {key:3 ,title:'معاملگران', navigate:'traders' ,icon:require('../../icon/traders.png')},
        {key:4 ,title:'جدیدالورود', navigate:'newbie' ,icon:require('../../icon/newbie.png')},
        {key:5 ,title:'ایستگاهای معاملاتی', navigate:'station' ,icon:require('../../icon/station.png')},
        {key:6 ,title:'رسوب', navigate:'sediment' ,icon:require('../../icon/sediment.png')}
    ]



    return(
        <div>
            
            <Header section='امور سهام' fullName={fullUser.stocksSymbol}/>
                <div className='LayoutBasic'>
                    <Menu menuProperties={menuProperties}/>
                    <Outlet/>
                </div>

                

        </div>
    )
}


export default Stocks
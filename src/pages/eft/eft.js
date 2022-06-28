import Header from "../../components/header/header"
import Menu from "../../components/menu/menu"
import { getCookie } from '../../components/cookie'
import HandleAccount from '../../components/cheakaccount'
import { Outlet } from "react-router-dom"


const Eft = () => {
    HandleAccount('eft')
    const username = getCookie('username')
    const menuProperties =[
        {key:1 ,title:'داشبورد', navigate:'dashboard' ,icon:require('../../icon/dashboard.png')},
        {key:2 ,title:'NAV', navigate:'nav' ,icon:require('../../icon/update.png')},
        {key:3 ,title:'حجم معاملات', navigate:'volume' ,icon:require('../../icon/traders.png')},
        {key:4 ,title:'بازدهی', navigate:'return' ,icon:require('../../icon/newbie.png')},
        {key:5 ,title:'دارایی کد رزور', navigate:'reserve' ,icon:require('../../icon/sediment.png')}
    ]


    return(
        <div>
            <Header section='صندوق' fullName={username} />
            <div className='LayoutBasic'>
                    <Menu menuProperties={menuProperties}/>
                    <Outlet/>
                </div>
        </div>
    )
}

export default Eft
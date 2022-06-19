
import Header from "../../components/header/header"
import Menu from "../../components/menu/menu"
import '../../layout/layout.css'
import './stocks.css'
import { getCookie } from '../../components/cookie'
import HandleAccount from "../../components/cheakaccount"
import { Outlet } from "react-router-dom"
const Stocks = () => {


    HandleAccount('portfoli')
    const username = getCookie('username')
    const menuProperties =[
        {key:1 ,title:'داشبورد', navigate:'dashboard' ,icon:require('../../icon/seting.svg').default},
        {key:2 ,title:'بروزرسانی', navigate:'update' ,icon:require('../../icon/seting.svg').default},
        {key:3 ,title:'معاملگران', navigate:'traders' ,icon:require('../../icon/seting.svg').default},
        {key:4 ,title:'جدیدالورود', navigate:'newbie' ,icon:require('../../icon/seting.svg').default},
        {key:5 ,title:'ایستگاهای معاملاتی', navigate:'station' ,icon:require('../../icon/seting.svg').default},
        {key:6 ,title:'رسوب', navigate:'sediment' ,icon:require('../../icon/seting.svg').default}
    ]


    return(
        <div>
            <Header section='امور سهام' username={username}/>
                <div className='LayoutBasic'>
                    <Menu menuProperties={menuProperties}/>
                    <Outlet/>
                </div>

                

        </div>
    )
}


export default Stocks
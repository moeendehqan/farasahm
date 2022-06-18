
import {handleAccount} from '../../components/cheakaccount'
import Menu from './menu/menu'
import { Outlet } from "react-router-dom"
import './portfoli.css'
import { getCookie } from '../../components/cookie'
import Header from '../../components/header/header'

const Portfoli = () => {
    handleAccount('portfoli')
    const username = getCookie('username')

    return(
        <div className='portfolicontiner'>
            <Header section='پرتفو گردانی' username={username} />

            <div className='continermenuportfoli'>
                <Menu />
            </div>
            <Outlet/>
        </div>
    )
}

export default Portfoli

import {handleAccount} from '../../components/cheakaccount'
import Menu from './menu/menu'
import { Outlet } from "react-router-dom"
import './portfoli.css'
import { getCookie } from '../../components/cookie'

const Portfoli = () => {
    handleAccount('portfoli')

    return(
        <div className='portfolicontiner'>
            <div className='portfoliheader'>
                <div className='portfolititle'>
                    <h1>فراسهم</h1>
                    <h4>پـرتـفـوگـردانی</h4>
                </div>
                <div className='portfoliprofile'>
                    <div className='portfoliprofiletitle'>
                        <h3>خوش آمدید</h3>
                        <h6>{getCookie('username')}</h6>
                    </div>
                    <div className='portfoliprofileimg'>
                        <img src={require('../../icon/porofile.png')}></img>   
                    </div>
                    <span className='portfoliprofilemenu'>.  .  .</span>
                </div>
            </div>

            <div className='continermenuportfoli'>
                <Menu />
            </div>
            <Outlet/>
        </div>
    )
}

export default Portfoli
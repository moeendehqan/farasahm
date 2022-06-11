
import {handleAccount} from '../../components/cheakaccount'
import Menu from './menu/menu'
import { Outlet } from "react-router-dom"
import './portfoli.css'


const Portfoli = () => {
    handleAccount('portfoli')

    return(
        <div>
            portfoli
            <div className='continermenuportfoli'>
                <Menu />
            </div>

            <Outlet/>

        </div>
    )
}

export default Portfoli
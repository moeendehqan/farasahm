
import {handleAccount} from '../../components/cheakaccount'
import Menu from './menu/menu'
import { Outlet } from "react-router-dom"

import { useNavigate } from 'react-router-dom'


const Portfoli = () => {
    handleAccount('portfoli')

    return(
        <div>
            portfoli
            <Menu />
            <Outlet/>

        </div>
    )
}

export default Portfoli
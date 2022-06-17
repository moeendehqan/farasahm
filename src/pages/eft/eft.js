import Header from "../../components/header/header"
import { getCookie } from '../../components/cookie'
import {handleAccount} from '../../components/cheakaccount'



const Eft = () => {
    handleAccount('eft')
    const username = getCookie('username')

    return(
        <div>
            <Header section='امور سهام' username={username} />
        </div>
    )
}

export default Eft
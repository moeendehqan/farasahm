
import './header.css'
import SercheStocks from './sercheStocks';
import { setCookie } from '../cookie';
import { useNavigate } from 'react-router-dom'

const Header = (props)=>{

    const navigate = useNavigate()

    const handleOut = () =>{
        setCookie('username','',0)
        setCookie('password','',0)
        navigate('/')
    }

    const handlehome = () =>{
        navigate('/section')
    }

    return(
        <div>
            <div className='Header'>
                <div className='HeaderTitle'>
                    <h1>فراسهم</h1>
                    <h4>{props.section}</h4>
                </div>
                {props.section==='امور سهام'?<SercheStocks/>:null}

                <div className='HeaderWellcom'>
                    <h1>خوش آمدید</h1>
                    <h5>{props.fullName}</h5>
                </div>
                <div className='HeaderImg'>
                    <img src={require('../../icon/porofile.png')}></img>
                </div>
                <div className='HeaderMenu'>
                    <ul>
                        <li>
                            <span className='HeaderMenuPoint'>...</span>
                            <ul>
                                <li><span onClick={handlehome}>خانه</span></li>
                                <li><span >تنظیمات</span></li>
                                <li><span onClick={handleOut}>خروج</span></li>
                            </ul>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Header
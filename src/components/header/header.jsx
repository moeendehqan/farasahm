
import './header.css'
import axios from 'axios'
import { serverAddress } from '../../config/config'
import {getCookie} from '../cookie'
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Header = (props)=>{
    const navigate = useNavigate()
    const username = getCookie('username')
    const [listTrader, setListTrader] = useState([])
    const [traderSelect, setTraderSelect] = useState('')

    const handleGetTraderList = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traderlist',
            data:{
                username:username
            }
        }).then(response =>{
            setListTrader(response.data.data)
        })

    }

    const handleGetDetails = () => {
        const inList = (listTrader.find(i => i.Account==traderSelect))
        if(inList!= undefined && inList.Account==traderSelect){
            navigate('/stocks/details',{state:traderSelect})
        }
    }

    useEffect(handleGetTraderList,[])
    useEffect(handleGetDetails,[traderSelect])
    return(
        <div>
            <div className='Header'>
                <div className='HeaderTitle'>
                    <h1>فراسهم</h1>
                    <h4>{props.section}</h4>
                </div>
                {listTrader.length===0?null:
                <div className='HeaderSerche'>
                    <input value={traderSelect}  list='browsers' onChange={(e)=>setTraderSelect(e.target.value)} />
                    <datalist id="browsers">
                    {listTrader.map(items=>{
                        return(
                            <option key={items.Account} value={items.Account}>{items.Fullname}</option>
                        )
                    })
                    }
                    </datalist>
                </div>
                }
                <div className='HeaderWellcom'>
                    <h1>خوش آمدید</h1>
                    <h5>{props.fullName}</h5>
                </div>
                <div className='HeaderImg'>
                    <img src={require('../../icon/porofile.png')}></img>
                </div>
                <div className='HeaderMenu'>
                    <span>...</span>
                </div>
            </div>
        </div>
    )
}

export default Header
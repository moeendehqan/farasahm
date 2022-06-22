
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';

const Details = () => {
    const username = getCookie('username')
    const [listTrader, setListTrader] = useState(null)
    const [traderSelect, setTraderSelect] = useState(null)
    console.log(traderSelect)

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

    useEffect(handleGetTraderList,[])


    return(
        <aside>
            details
            {listTrader===null?null:
            <div className='StocksOption'>
                <label>نام</label>
                <input  list='browsers' onChange={(e)=>setTraderSelect(e.target.value)} />
                <datalist id="browsers">
                    {listTrader.map(items=>{
                        return(
                            <option key={items.Account} value={items.Account}>{items.Fullname}</option>
                        )
                    })

                    }
                </datalist>
            </div>}
        </aside>
    )
}

export default Details
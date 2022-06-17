
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './traders.css'

const Traders = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [dataTraders, setDataTraders] = useState(null)

    const handleGetDataTraders = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traders',
            data: {
                username:username,
                fromDate:false,
                toDate:false,
                side:'buy'
            }
        }).then(response=>{
            if(response.data.replay){
                setDataTraders(response.data.data)
            }else{
                setMsg(response.data.msg)
            }        })    }

    useEffect(handleGetDataTraders,[])


    return(
        <aside>
            <div>
                <h3>معاملگران</h3>
                {dataTraders===null?null:
                <div>
                    <div className='stocksTheader'>
                        <p className='StocksTname'>نام</p>
                        <p className='StocksTvolume'>حجم</p>
                        <p className='StocksTprice'>قیمت</p>
                        <p className='StocksTinfo'>مشخصات</p>
                        <p className='StocksTbehavior'>رفتار</p>
                    </div>
                    {dataTraders.map(items=>{
                        const weg = {width :(items.w*90)+'%'}
                        return(
                            <div key={items.code} className='StocksTbody'>
                                <p className='StocksTname'>{items.name}</p>
                                <div className='StocksTvolume'>
                                    <div style={weg} className='stocksTbar'><p>{items.volume.toLocaleString()}</p></div>
                                </div>
                                <p className='StocksTprice'>{items.price.toLocaleString()}</p>
                                <div className='StocksTinfo'><button>[نمایش]</button></div>
                                <div className='StocksTbehavior'><button>نمودار</button></div>
                            </div>
                        )
                    })}
                </div>
                }
            </div>
            <div>
                jklsdjkhv
            </div>
        </aside>
    )
}

export default Traders
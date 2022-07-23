import { useState , useEffect} from "react"
import { serverAddress } from "../../../config/config"
import axios from "axios"
import { getCookie } from "../../../components/cookie"
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';

const Asset = ()=>{
    const username = getCookie('username')
    const [invester, setInvester] = useState('')
    const [investorList, setInvestorList] = useState(null)
    const [dateTrade ,setDateTrade] = useState()

    
    const handleDateTrade = (date) =>{setDateTrade(DatePickerToInt(date))}

    const handleGetInvestorList = ()=>{
        axios({method:"POST",url:serverAddress+'/portfolio/investorlist',data:{username:username}
    }).then(Response=>{setInvestorList(Response.data.df)})}

    useEffect(handleGetInvestorList,[])

    return(
        <aside>
            <div className="PortfolioAsset">
                Asset
            </div>
            <div className='PortfolioOption'>
                {investorList==null?null:
                <label>
                    <p>سرمایه گذار</p>
                    <input list='browser' onChange={(e)=>setInvester(e.target.value)}/>
                    <datalist id='browser'>
                        {investorList.map(items=>{
                        return(
                            <option key={items.code} value={items.code}>{items.name}</option>
                        )                            })                            }
                    </datalist>
                </label>}
                    <label className='PortfolioFild'>
                        <p>تا تاریخ</p>
                        <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={date => handleDateTrade(date)}/>
                    </label>
            </div>
        </aside>
    )
}

export default Asset
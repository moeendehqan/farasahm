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
    const [dateTrade ,setDateTrade] = useState('')

    
    const handleDateTrade = (date) =>{setDateTrade(DatePickerToInt(date))}

    const handleSetInvester = (e)=>{if(investorList.find(i=>i.code==e.target.value)!=undefined){setInvester(e.target.value)}}

    const handleGetInvestorList = ()=>{
        axios({method:"POST",url:serverAddress+'/portfolio/investorlist',data:{username:username}
    }).then(Response=>{setInvestorList(Response.data.df)})}

    const handleShowAsset = () =>{
        if(invester.length>0){
            axios({method:'POST',url:serverAddress+'/portfolio/asset',data:{username:username,invester:invester,date:dateTrade}
        }).then(Response=>{
            console.log(Response.data)
        })
        }
    }

    useEffect(handleGetInvestorList,[])
    useEffect(handleShowAsset,[invester,dateTrade])

    return(
        <aside>
            <div className="PortfolioAsset">
                Asset
            </div>
            <div className='PortfolioOption'>
                {investorList==null?null:
                <label>
                    <p>سرمایه گذار</p>
                    <input list='browser' onChange={(e)=>handleSetInvester(e)}/>
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
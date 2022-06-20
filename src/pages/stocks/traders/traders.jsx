
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './traders.css'
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import Popview from '../../../components/popview/popview';
const Traders = () => {
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [historiCode, setHistoriCode] = useState(null)
    const [dataTraders, setDataTraders] = useState(null)
    const [side, setSide] = useState('buy')
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const  [sorting, setsorting] = useState('zvol')


    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleGetDataTraders = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/traders',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
                side:side,
                sorting:sorting
            }
        }).then(response=>{
            if(response.data.replay){
                setDataTraders(response.data.data)
            }else{
                setMsg(response.data.msg)
                setDataTraders(null)
            }        })
        }
        

    const infoTraders = (code) =>{
        axios({
            method:'POST',
            url:serverAddress+'/stocks/infocode',
            data:{
                username:username,
                code:code
            }
        }).then(response=>{
                setMsg(response.data.msg)
                })    }
        
        const handleHistoriCode = (code , name) =>{
            axios({
                method:'POST',
                url:serverAddress+'/stocks/historicode',
                data:{
                    username:username,
                    code:code
                }
            }).then(response=>{
                    console.log(response.data.data)
                    const options = {
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: name,
                            color: "rgb(39, 59, 176)"
                          },
                        },
                      };
                    const data = {
                        labels: response.data.data.map(d=>d.date),
                        datasets: [
                          {
                            label: "حجم",
                            data: response.data.data.map(d=>d.cum),
                            fill: true,
                            backgroundColor: "rgba(198, 62, 241,0.2)",
                            borderColor: "rgba(45, 65, 253,1)"
                          }
                        ]
                      }
                      setHistoriCode(<Line options={options} data={data} />)
                    })    }


    useEffect(handleGetDataTraders,[fromDate, toDate, side,sorting])

    return(
        <aside>
            <div>
                <h3>معاملگران</h3>
                {dataTraders===null?null:
                <div>
                    <div className='stocksTheader'>
                        <p className='StocksTname'>نام</p>
                        <div className='StocksTvolume'>
                            <p>حجم</p>
                            <ul className='StocksTvolumeSort'>
                                <li onClick={()=>{setsorting('zvol')}}>بیشترین</li>
                                <li onClick={()=>{setsorting('avol')}}>کمترین</li>
                            </ul>
                        </div>
                        <div className='StocksTprice'>
                            <p>قیمت</p>
                            <ul className='StocksTpriceSort'>
                                <li onClick={()=>{setsorting('zprc')}}>بیشترین</li>
                                <li onClick={()=>{setsorting('aprc')}}>کمترین</li>
                            </ul>
                        </div>
                        <p className='StocksTbalance'>مانده</p>
                        <p className='StocksTinfo'>مشخصات</p>
                        <p className='StocksTbehavior'>رفتار</p>
                    </div>
                    {dataTraders.map(items=>{
                        const weg = {width :(items.w*85)+'%'}
                        return(
                            <div key={items.code} className='StocksTbody'>
                                <p className='StocksTname'>{items.name}</p>
                                <div className='StocksTvolume'>
                                    <div style={weg} className='stocksTbar'><p>{items.volume.toLocaleString()}</p></div>
                                </div>
                                <div className='StocksTprice'><p>{items.price.toLocaleString()}</p></div>
                                <p className='StocksTbalance'>{items.balance.toLocaleString()}</p>
                                <div className='StocksTinfo'><button onClick={()=>infoTraders(items.code)}>{'{'+'نمایش'+'}'}</button></div>
                                <div className='StocksTbehavior'><button onClick={()=>handleHistoriCode(items.code, items.name)}>نمودار</button></div>
                            </div>
                        )
                    })}
                </div>
                }
                <Alarm msg={msg} smsg={setMsg}/>
                <Popview contet={historiCode} scontent={setHistoriCode}/>

            </div>
            <div className='StocksOption'>
                <label>سمت</label>
                <select onChange={(e)=>setSide(e.target.value)}>
                    <option value='buy'>خرید</option>
                    <option value='sel'>فروش</option>
                </select>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    از تاریخ
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    تا تاریخ
                </label>

            </div>

        </aside>
    )
}

export default Traders
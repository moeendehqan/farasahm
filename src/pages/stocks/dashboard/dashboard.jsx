import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './dashboard.css'
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,defaults} from 'chart.js';
import MiniLoader from '../../../components/loader/miniloader';
import { Bar } from 'react-chartjs-2';
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"


const Dashboard = () => {
    const username = getCookie('username')
    const [lastUpdate, setLastUpdate] = useState(null)
    const [topBuy, setTopBuy] = useState(null)
    const [topSel, setTopSel] = useState(null)
    ChartJS.register(CategoryScale,LinearScale,BarElement,Title,Tooltip,Legend)
    defaults.font.family = 'peydaRegular'
    const [newBie, setNewBie] = useState(null)
    const [SedmentVolumepo, setSedmentVolumepo] = useState(null)
    const [SedmentVolumepw, setSedmentVolumepw] = useState(null)
    const [SedmentVolumept, setSedmentVolumept] = useState(null)
    const [SedmentVolumeps, setSedmentVolumeps] = useState(null)
    const [SedmentVolumepy, setSedmentVolumepy] = useState(null)
    const [tablo, setTablo] = useState(null)
    console.log(tablo)
    const [dateString, setDateString] = useState(null)

    const dateShamsi = ()=>{
        var date = (new DateObject(lastUpdate, { calendar: persian, locale: persian_fa }))
        if(date.format('dddd')=='Sunday'){var dddd = 'یکشنیه'
        }else if(date.format('dddd')=='Saturday'){var dddd = 'شنبه'
        }else if(date.format('dddd')=='Monday'){var dddd = 'دوشنبه'
        }else if(date.format('dddd')=='Tuesday'){var dddd = 'سه شنبه'
        }else if(date.format('dddd')=='Wenesday'){var dddd = 'چهارشنبه'
        }else if(date.format('dddd')=='Thursday'){var dddd = 'پنجشنبه'
        }else{var dddd = 'جمعه'}
        if(date.monthIndex==0){var mm = 'فروردین'
        }else if(date.monthIndex==1){var mm = 'اردیبهشت'
        }else if(date.monthIndex==2){var mm = 'خرداد'
        }else if(date.monthIndex==3){var mm = 'تیر'
        }else if(date.monthIndex==4){var mm = 'مرداد'
        }else if(date.monthIndex==5){var mm = 'شهریور'
        }else if(date.monthIndex==6){var mm = 'مهر'
        }else if(date.monthIndex==7){var mm = 'آبان'
        }else if(date.monthIndex==8){var mm = 'آذر'
        }else if(date.monthIndex==9){var mm = 'دی'
        }else if(date.monthIndex==10){var mm = 'بهمن'
        }else{var mm = 'اسفند'}


        if(lastUpdate!=null){
            setDateString(
                <p className='DashboardDateString'>{dddd} , {(date.day).toLocaleString()} {mm} {(date.year).toLocaleString()}</p>
            )
        }
    }

    useEffect(dateShamsi,[lastUpdate])

    const topBuyOptions = {
        responsive: true,
        plugins: {
            legend: {
                display:false,
            title: {display: true,text:'10 خریدار برتر'},
            tooltip:{backgroundColor:'#273bb0'}
                },
              },
             }

    const topSelOptions = {
        responsive: true,
        plugins: {
            legend: {
                display:false,
            title: {display: true,text:'10 فروشنده برتر'},
            tooltip:{backgroundColor:'#273bb0'}
                },
                },
                }

    const handleDashboard = () =>{
        axios({method: "POST",url: serverAddress+'/stocks/dashbord',data:{username:username}
        }).then(response=>{
            setLastUpdate(response.data.lastUpdate)
            setTopSel(response.data.topSel)
            const labelsTopBuy = response.data.topBuy.name
            setTopBuy({
                labelsTopBuy,
                datasets: [{
                    data: response.data.topBuy.Volume,
                    backgroundColor: '#5aae40',
                }]            })

            const labelsTopSel = response.data.topSel.name
            setTopSel({
                labelsTopSel,
                datasets: [{
                    data: response.data.topSel.Volume,
                    backgroundColor: '#ae4040',
                }]}            )
            
            /*جدیدالورود*/
            axios({method: "POST",url: serverAddress+'/stocks/newbie',data:{username:username,fromDate:false,toDate:false,headers:{'Content-Type':'application/json','Accept': 'application/json'}}
            }).then(resnewbie=>{
                setNewBie(resnewbie.data.ToDayNewBie)
            })

            /*رسوب1*/
            axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:1,}
            }).then(sedimentpt=>{
                if(sedimentpt.data.replay){setSedmentVolumepo(sedimentpt.data.sumSediment)}else{setSedmentVolumept(0)}
                /*رسوب2*/
                axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:2,}
                }).then(sedimentpt=>{
                    if(sedimentpt.data.replay){setSedmentVolumepw(sedimentpt.data.sumSediment)}else{setSedmentVolumept(0)}
                    /*رسوب3*/
                    axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:3,}
                    }).then(sedimentpt=>{
                        if(sedimentpt.data.replay){setSedmentVolumept(sedimentpt.data.sumSediment)}else{setSedmentVolumept(0)}
                        /*رسوب6*/
                        axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:6,}
                        }).then(sedimentps=>{if(sedimentps.data.replay){setSedmentVolumeps(sedimentps.data.sumSediment)}else{setSedmentVolumeps(0)}
                            /*رسوب12*/
                            axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:12,}
                            }).then(sedimentpn=>{if(sedimentpn.data.replay){setSedmentVolumepy(sedimentpn.data.sumSediment)}else{setSedmentVolumepy(0)}
                            })
                        })
                    })
                })
            })  
            /*تابلو بورس*/
            axios({method: 'POST',url: serverAddress+'/stocks/tablo',data: {username:username,date:response.data.lastUpdate,}
            }).then(tabloApi=>{
                if(tabloApi.data.Error!="data not found"){
                    console.log(tabloApi.data)
                    setTablo(tabloApi.data)}
            })
        })
    }


    useEffect(handleDashboard,[])
    return(
        <div className="dashboard">
            <div className='dashboardFristRow'>
                {tablo!=null?<p className='DashboardDateString'>{tablo.tablo.full_name}</p>:null}
                <p>{dateString}</p>
            </div>
            <div className='DashboardTopToday'>
                <div>
                    <h6>ده خریدار بزرگ</h6>
                    {topBuy!=null?<Bar options={topBuyOptions} data={topBuy} />:<MiniLoader/>}
                </div>
                <div>
                    <h6>ده فروشنده بزرگ</h6>
                    {topSel!=null?<Bar options={topSelOptions} data={topSel} />:<MiniLoader/>}
                </div>
            </div>
            <div className='DashboardRow2'>
                <div>
                    <h5>جدیدالورود</h5>  
                    {newBie==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>{(newBie.newvol).toLocaleString()}</td>
                                <td>{(Math.round((newBie.newvol/newBie.allvol)*10000)/100).toString()+'%'}</td>
                                <td>حجم</td>
                            </tr>
                            <tr>
                                <td>{newBie.newnum.toLocaleString()}</td>
                                <td>{(Math.round((newBie.newnum/newBie.allnum)*10000)/100).toString()+'%'}</td>
                                <td>تعداد</td>
                            </tr>
                            <tr>
                                <td>{(Math.round(newBie.newvol/newBie.newnum)).toLocaleString()}</td>
                                <td> - </td>
                                <td>حجم سرانه</td>
                            </tr>
                            <tr>
                                <td>{newBie.newmax.toLocaleString()}</td>
                                <td> - </td>
                                <td>بیشترین</td>
                            </tr>
                            <tr>
                                <td>{newBie.newmin.toLocaleString()}</td>
                                <td> - </td>
                                <td>کمترین</td>
                            </tr>
                        </tbody>
                    </table>}
                </div>
                <div>
                    <h5>رسوب</h5>
                    {SedmentVolumepy==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>{SedmentVolumepo.toLocaleString()}</td>
                                <td>یک ماهه</td>
                            </tr>
                            <tr>
                                <td>{SedmentVolumepw.toLocaleString()}</td>
                                <td>دو ماهه</td>
                            </tr>
                            <tr>
                                <td>{SedmentVolumept.toLocaleString()}</td>
                                <td>سه ماهه</td>
                            </tr>
                            <tr>
                                <td>{SedmentVolumeps.toLocaleString()}</td>
                                <td>شش ماهه</td>
                            </tr>
                            <tr>
                                <td>{SedmentVolumepy.toLocaleString()}</td>
                                <td>یکساله</td>
                            </tr>
                        </tbody>
                    </table>}
                </div>
                <div>
                    <h5>شاخص ها</h5>
                    {tablo==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p className={tablo.ind.rate.total>0?'DashboardNumPos':'DashboardNumNeg'}>
                                        {(tablo.ind.rate.total*1).toLocaleString()}%
                                    </p>
                                    </td>
                                <td>کل</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className={tablo.ind.rate.total50>0?'DashboardNumPos':'DashboardNumNeg'}>
                                        {(tablo.ind.rate.total50*1).toLocaleString()}%
                                    </p>
                                    </td>
                                <td>پنجاه شرکت</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className={tablo.ind.rate.totalw>0?'DashboardNumPos':'DashboardNumNeg'}>
                                        {(tablo.ind.rate.totalw*1).toLocaleString()}%
                                    </p>
                                    </td>
                                <td>هم وزن</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className={tablo.ind.rate.industry>0?'DashboardNumPos':'DashboardNumNeg'}>
                                        {(tablo.ind.rate.industry*1).toLocaleString()}%
                                    </p>
                                    </td>
                                <td>صنعت</td>
                            </tr>
                            <tr>
                                <td>
                                    <p className={tablo.ind.rate.company>0?'DashboardNumPos':'DashboardNumNeg'}>
                                        {(tablo.ind.rate.company*1).toLocaleString()}%
                                    </p>
                                    </td>
                                <td>نماد</td>
                            </tr>
                        </tbody>
                    </table>
                    }
                </div>
                <div>
                    <h5>تابلو نماد</h5>
                    {tablo==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    {(tablo.tablo.final_price*1).toLocaleString()}
                                </td>
                                <td>قیمت پایانی</td>
                            </tr>
                            <tr>
                                <td>
                                    {(Math.round(((tablo.tablo.real_buy_value/tablo.tablo.real_buy_count)/10000))/100).toLocaleString()} M
                                </td>
                                <td>سرانه خرید</td>
                            </tr>
                            <tr>
                                <td>
                                    {(Math.round(((tablo.tablo.real_sell_value/tablo.tablo.real_sell_count)/10000))/100).toLocaleString()} M
                                </td>
                                <td>سرانه فروش</td>
                            </tr>
                            <tr>
                                <td>
                                    {(tablo.tablo.trade_volume*1).toLocaleString()}
                                </td>
                                <td>حجم</td>
                            </tr>
                            <tr>
                                <td>
                                    {(Math.round(tablo.tablo.trade_value/10000)/100).toLocaleString()} M
                                </td>
                                <td>ارزش</td>
                            </tr>
                        </tbody>
                    </table>
                    }
                </div>
            </div>
            
            <div className='DashboardSymbolStatus'>
                {tablo==null?null:
                    tablo.symbol_industry.map(sym=>{
                    const prccls = sym.final_price_change_percent>0?'DashboardNumPos':'DashboardNumNeg'
                    return(
                        <div className='DashboardSymbolStatusItem'>
                            <p>{sym.name}</p>
                            <div>
                                <p className={prccls}>{(sym.final_price_change_percent*1).toLocaleString()} %</p>
                                <p>{(sym.final_price*1).toLocaleString()}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
            
        </div>

    )
}


export default Dashboard
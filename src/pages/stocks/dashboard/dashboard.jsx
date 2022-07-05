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
    const [SedmentVolumept, setSedmentVolumept] = useState(null)
    const [SedmentVolumeps, setSedmentVolumeps] = useState(null)
    const [SedmentVolumepy, setSedmentVolumepy] = useState(null)
    const [tablo, setTablo] = useState(null)
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
            
            /**/
            axios({method: "POST",url: serverAddress+'/stocks/newbie',data:{username:username,fromDate:false,toDate:false,}
            }).then(newbie=>{
                console.log(newbie.data.ToDayNewBie[0])
                setNewBie(newbie.data.ToDayNewBie[0])     
                /**/
                axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:3,}
                }).then(sedimentpt=>{
                    if(sedimentpt.data.replay){setSedmentVolumept(sedimentpt.data.sumSediment)}else{setSedmentVolumept(0)}
                    /**/
                    axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:6,}
                    }).then(sedimentps=>{if(sedimentps.data.replay){setSedmentVolumeps(sedimentps.data.sumSediment)}else{setSedmentVolumeps(0)}
                         /**/
                        axios({method: 'POST',url: serverAddress+'/stocks/sediment',data: {username:username,period:12,}
                        }).then(sedimentpn=>{if(sedimentpn.data.replay){setSedmentVolumepy(sedimentpn.data.sumSediment)}else{setSedmentVolumepy(0)}
                            /**/
                            axios({method: 'POST',url: serverAddress+'/stocks/tablo',data: {username:username,date:response.data.lastUpdate,}
                            }).then(tabloApi=>{
                                if(tabloApi.data.Error!="data not found"){
                                setTablo(tabloApi.data)}
                            })
                        })
                    })
                })
            })
        })
    }

    useEffect(handleDashboard,[])
    return(
        <div className="dashboard">
            {dateString}
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
                                <td>{newBie.newnum}</td>
                                <td>{(Math.round((newBie.newnum/newBie.allnum)*10000)/100).toString()+'%'}</td>
                                <td>تعداد</td>
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
                    <h5>تابلو معاملات</h5>
                    {tablo==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>{(Math.round((tablo.real_buy_value/tablo.real_buy_count)/10000)/100).toLocaleString()} M</td>
                                <td>سرانه خرید</td>
                            </tr>
                            <tr>
                                <td>{(Math.round((tablo.real_sell_value/tablo.real_sell_count)/10000)/100).toLocaleString()} M</td>
                                <td>سرانه فروش</td>
                            </tr>
                        </tbody>
                    </table>
                    }
                </div>
                <div>
                    <h5>بازار</h5>
                    {tablo==null?<MiniLoader/>:
                    <table>
                        <tbody>
                            <tr>
                                <td>{(tablo.final_price).toLocaleString()}</td>
                                <td>قیمت پایانی</td>
                            </tr>
                            <tr>
                                <td>{((tablo.all_stocks*tablo.final_price)/1000000000).toLocaleString()} B</td>
                                <td>ارزش بازار</td>
                            </tr>
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </div>

    )
}


export default Dashboard
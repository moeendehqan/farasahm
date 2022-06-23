import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './dashboard.css'
import { Chart as ChartJS,CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend} from 'chart.js';
import { Line } from "react-chartjs-2";
import Loader from '../../../components/loader/loader'

const Dashboard = () => {
    const username = getCookie('username')
    const [power, setPower] = useState(null)
    ChartJS.register(CategoryScale,LinearScale,PointElement,LineElement,Title,Tooltip,Legend);
    const [loading, setLoading] = useState(true)

    var optionsPower = {responsive: true,
                plugins: {legend: {display: false},
                    title: {display: true,
                        text: 'سرانه معاملات',
                        color: "rgb(39, 59, 176)",
                        font: {family:'peydaRegular'}},
                        tooltip:{bodyFont:{family:'peydaRegular'},
                            backgroundColor:'#22388a',
                            bodyAlign:'right'
                    }                    }};

    var optionsPrice = {responsive: true,
        plugins: {legend: {display: false},
            title: {display: true,
                text: 'قیمت',
                color: "rgb(39, 59, 176)",
                font: {family:'peydaRegular'}},
                tooltip:{bodyFont:{family:'peydaRegular'},
                    backgroundColor:'#22388a',
                    bodyAlign:'right'
            }            }};

    if(power!==null){
    var dataPower = {
        labels: power.map(items=>{return items.date}),
        datasets: [
          {
            label: "خرید",
            data: power.map(items=>{return Math.round(items.buy_power)}),
            fill: true,
            backgroundColor: "#5cac3c",
            borderColor: "#5cac3c"
          },{
            label: "فروش",
            data: power.map(items=>{return Math.round(items.sell_power)}),
            fill: true,
            backgroundColor: "#ac3c3c",
            borderColor: "#ac3c3c"
          },
        ]
      }
var dataPrice = {
    labels: power.map(items=>{return items.date}),
    datasets: [
        {
        label: "قیمت پایانی",
        data: power.map(items=>{return (items.final_price)}),
        fill: true,
        backgroundColor: "#263bb0",
        borderColor: "#263bb0"
        }    ]    }

    }

    const handleGetData = () =>{
        setLoading(true)
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/dashbord',
            data: {
                username:username,
            }
        }).then(Response=>{
            setLoading(false)
            if(Response.data.replay){
                setPower(Response.data.power)
            }

        })
    }

    useEffect(handleGetData,[])
    
    return(
        <div className="dashboard">
            <div className='DashboardTablo'>
                <div>
                    <div>{power===null?null:<Line options={optionsPrice} data={dataPrice} />}</div>
                </div>
                <div>
                    <div>{power===null?null:<Line options={optionsPower} data={dataPower} />}</div>
                </div>
            </div>
            <div>
            </div>
            {loading?<Loader />:null}
        </div>

    )
}


export default Dashboard
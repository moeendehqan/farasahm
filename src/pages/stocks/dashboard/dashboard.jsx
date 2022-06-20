import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import './dashboard.css'
const Dashboard = () => {
    const username = getCookie('username')
    const [codal, setCodal] = useState(null)

    const handleGetData = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/dashbord',
            data: {
                username:username,
            }
        }).then(Response=>{
            console.log(Response.data)
            if(Response.data.replay){
                setCodal(Response.data.codal)

            }

        })
    }

    useEffect(handleGetData,[])
    
    return(
        <aside className="Dashboard">
            <div className='DashboardRow1'>
                <div className='DashbnoardCodal'>
                    {codal===null?null:
                        codal.map(items=>{
                            return(<a key={items.date} href={items.link}>{items.title}</a>)
                        })
                    }

                </div>
                <div>
                    idea
                </div>
            </div>
            <div>
                row 2
            </div>

        </aside>

    )
}


export default Dashboard
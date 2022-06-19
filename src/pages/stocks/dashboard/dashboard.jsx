import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';

const Dashboard = () => {
    const username = getCookie('username')

    const handleGetData = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/dashbord',
            data: {
                username:username,
            }
        }).then(Response=>{
            console.log(Response.data)
        })
    }

    useEffect(handleGetData,[])
    
    return(
        <div className="dashboard">

        </div>

    )
}


export default Dashboard
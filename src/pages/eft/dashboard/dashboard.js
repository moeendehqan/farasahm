
import axios from "axios"
import { useEffect, useState } from "react"
import { serverAddress } from "../../../config/config"
import { getCookie } from "../../../components/cookie"
const DashboardEtf = () =>{

    const username = getCookie('username');

    const handleGetDashboard = () =>{
        axios({
            method:'POST',
            url: serverAddress+'/etf/dashboard',
            data: {
                username:username
            }
        }).then(response=>{
            console.log(response.data)
        })
    }

    useEffect(handleGetDashboard,[])
    
    return(
        <p>dashboard</p>
    )
}

export default DashboardEtf
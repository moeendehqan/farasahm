
import { getCookie } from "../../../components/cookie"
import axios from "axios"
import { serverAddress } from "../../../config/config"
import { useState, useEffect } from "react"
const Nav = () => {
    const username = getCookie('username')

    const handleGetNav = ()=>{
        axios({
            method:'POST',
            url:serverAddress+'/etf/nav',
            data:{
                username:username
            }
        }).then(Response=>{
            console.log(Response.data)
        })
    }

    useEffect(handleGetNav,[])

    return(
        <aside>
            <p>nav</p>
        </aside>
    )
}


export default Nav


import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';

const Sediment = () =>{
    const username = getCookie('username')
    const handleSediment = () =>{
        axios({
            method: 'POST',
            url: serverAddress+'/stocks/sediment',
            data: {
                username:username,
                period:1,
            }
        }).then(response=>{
            console.log(response.data)
        })
    }
    useEffect(handleSediment,[])
    return(
        <aside>
            sediment
        </aside>
    )

}

export default Sediment
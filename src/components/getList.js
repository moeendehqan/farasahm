import { getCookie } from "./cookie";
import axios from "axios";
import {serverAddress} from '../config/config'
import { useState } from "react"

 const getListCustomer = ()=>{
    const username = getCookie('username')
    var databack

     axios({
        method: 'post',
        url: serverAddress+'/portfoli/customerlist',
        data: { username:username}
        }).then(Response=>{
            if (Response.data.replay){
                return (Response.data.databack)
           }          })    
        }


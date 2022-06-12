import './portfoliview.css'
import axios from 'axios'
import { useState,useEffect} from 'react'
import {serverAddress} from '../../../../config/config'

const PortfoliView = (props)=>{

    const [content, setContent] = useState(null)
    const [tableasset, setTableasset] = useState(null)

    const handleContent = ()=>{
        if(props.tab==='asset'){
            if(tableasset===null){
                <h1>دارایی برای نمایش وجود ندارد</h1>
            }else{
            setContent(
                <table>
                    <thead>
                    <tr>
                        <th>نماد</th>
                        <th>تعداد</th>
                        <th>میانگین خرید</th>
                        <th>قیمت بازار</th>
                        <th>بازدهی</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tableasset.map(item=>{
                        console.log(item)
                        return(
                            <tr key={item['نماد']}>
                                <td>{item['نماد']}</td>
                                <td>{item['تعداد']}</td>
                                <td>{item['قیمت_خرید']}</td>
                                <td>{item['قیمت_بازار']}</td>
                                <td>{item['بازدهی']}</td>
                            </tr>

                        )                    })}
                    </tbody>
                </table>
                )}
            }else if(props.tab==='profitability'){
            setContent(
                <h1>سود اوری</h1>
                )
            }
    }

    const handleAsset = ()=>{
        axios({
            method: 'post',
            url: serverAddress+'/portfoli/asset',
            data: { username: props.username,
                    customer: props.customer}
            }).then(Response=>{
                if(Response.data.replay){
                    setTableasset(Response.data.databack)
                }            })    }

    useEffect(handleContent,[props.tab,props.customer])
    useEffect(handleAsset,[props.tab,props.customer])
    

    return(
        <div className="contentcustomerreviewportfoli">
            <span>content {props.customer}</span>
            {content}
        </div>
    )}

export default PortfoliView
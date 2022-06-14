import './portfoliview.css'
import axios from 'axios'
import { useState,useEffect} from 'react'
import {serverAddress} from '../../../../config/config'

const PortfoliView = (props)=>{

    const [content, setContent] = useState(null)
    const [tableasset, setTableasset] = useState(null)
    const [tablenobuy, setTablenobay] = useState(null)

    const handleContent = ()=>{
        if(props.tab==='asset'){
            if(tableasset===null){
                setContent(<h1>دارایی برای نمایش وجود ندارد</h1>)
            }else if(tableasset==='wait'){
                setContent(<h1>لطفا صبر کنید</h1>)
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
                setContent(<p>تاریخ را تنظیم کنید</p>)
                if(props.dateselect!==''){
                setContent(
                    <h1>لطفا صبر کنید</h1>
                    )
                if(tablenobuy!==null && tablenobuy!=='show'){
                    setContent(
                        <div>
                        <span>معاملات {props.customer} ناقص ثبت شده است</span>
                        <table>
                            <thead>
                                <tr>
                                    <th>نماد</th>
                                    <th>تعداد</th>
                                </tr>
                            </thead>
                            <tbody>
                            {tablenobuy.map(o=>{
                                return(
                                <tr key={o['نماد']}>
                                    <td>{o['نماد']}</td>
                                    <td>{o['تعداد']}</td>
                                </tr>)
                            })}
                            </tbody>
                        </table>

                        </div>
                        )
                    }else if(tablenobuy!==null && tablenobuy==='show'){
                        setContent(
                            <p>نمایش عملکرد</p>
                        )
                    }}
            }
    }

    const handleAsset = ()=>{
        setTableasset('wait')
        axios({
            method: 'post',
            url: serverAddress+'/portfoli/asset',
            data: { username: props.username,
                    customer: props.customer}
            }).then(Response=>{
                if(Response.data.replay){
                    setTableasset(Response.data.databack)
                }else{
                    setTableasset(null)
                }            })    }


    const handleprofitability = () =>{
        if (props.tab==='profitability' && props.dateselect!=''){
            axios({
                method: 'post',
                url: serverAddress+'/portfoli/profitability',
                data: { username: props.username,
                        customer: props.customer,
                        dateselect: props.dateselect
                    }
                }).then(Response=>{
                    if(!Response.data.replay){
                        console.log(' resp >> false')
                        setTablenobay(Response.data.databack)
                    }else{
                        console.log(' resp >> true')
                        setTablenobay('show')
                    }                })        }        }


    useEffect(handleprofitability,[props.tab, props.customer, props.dateselect])
    useEffect(handleAsset,[props.tab,props.customer])
    useEffect(handleContent,[props.tab,props.customer,(tableasset===null),(tableasset==='wait'),(tablenobuy===null),props.dateselect])

    

    return(
        <div className="contentcustomerreviewportfoli">
            <span>content {props.customer}</span>
            {content}
        </div>
    )}

export default PortfoliView
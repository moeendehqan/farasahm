import axios from "axios"
import { useEffect , useState} from "react"
import { getCookie } from "../../../components/cookie"
import { serverAddress } from "../../../config/config"
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm'
const Return = () =>{
    const username= getCookie('username')
    const [onDate, setonDate] = useState(false)
    const [msg, setMsg] = useState(null)
    const [target, setTarget] = useState(21)


    const handleOnDate = (date) =>{setonDate(DatePickerToInt(date))}


    const handleGetReturn = ()=>{
        setMsg(null)
        axios({
            method:'POST',
            url: serverAddress+'/etf/return',
            data:{
                username:username,
                onDate:onDate,
                target:target
            }
        }).then((Response)=>{
            if(Response.data.replay){
                var diff =JSON.parse(Response.data.data).map(i=>i.diff)
                var mx = Math.max(...diff)
                var mn = Math.min(...diff)
                var table = new Tabulator("#detailsTable", {
                    data:Response.data.data,
                    columnHeaderSortMulti:true,
                    columns:[
                        {title:"دوره (روز)", field:"period",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
                        {title:"(%) نقطه به نقطه", field:"ptp",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
                        {title:"تعداد دوره", field:"periodint",visible:false},
                        {title:"(%) سالانه شده", field:"yearly",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
                        {title:"(%) اختلاف با هدف", field:"diff",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,
                        formatter:function(cell, formatterParams){
                            var value = cell.getValue();
                            if (value<0){
                                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTN' style='width:"+(((value)/mn)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
                            }else{
                                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+((value/mx)*50).toString()+'%'+"'></div><p>"+ value.toString()+'%' +"</p></div>")
                            }
                        }
                          },
                    ],
                    layout: "fitColumns",
                })
            }else{
                setMsg(Response.data.msg)
            }

        })
    }

    useEffect(handleGetReturn,[onDate,target])

    return(
        <aside>
            <div id='detailsTable'></div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='EtfOption'>
                <label>تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleOnDate}/>
                <label>(%) هدف سالانه</label>
                <input value={target} type='number' className="custom-input" onChange={e=>setTarget(e.target.value)}></input>
            </div>
        </aside>
    )
}


export default Return
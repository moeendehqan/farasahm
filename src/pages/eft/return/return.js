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
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';

const Return = () =>{
    const username= getCookie('username')
    const [onDate, setonDate] = useState(false)
    const [msg, setMsg] = useState(null)
    const [target, setTarget] = useState(21)
    const [dataTable, setDataTable] = useState(null)
    const [periodList, setPeriodList] = useState([1,7,14,30,90,180,365])
    const [addPeriodList, setAddPeriodList] = useState(null)
    
    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const handlePeriodList = () =>{
        setPeriodList([...periodList,addPeriodList])
    }

    const exportPdf = () => {
        html2canvas(document.querySelector("#detailsTable")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        })}

    const handleOnDate = (date) =>{setonDate(DatePickerToInt(date))}


    const handleGetReturn = ()=>{
        setMsg(null)
        axios({
            method:'POST',
            url: serverAddress+'/etf/return',
            data:{
                username:username,
                onDate:onDate,
                target:target,
                periodList:periodList,
            }
        }).then((Response)=>{
            if(Response.data.replay){
                setDataTable(JSON.parse(Response.data.data))

            }else{
                setMsg(Response.data.msg)
            }

        })
    }
if(dataTable!=null){
    var diff =dataTable.map(i=>i.diff)
    var mx = Math.max(...diff)
    var mn = Math.min(...diff)
    var table = new Tabulator("#detailsTable", {
        data:dataTable,
        columnHeaderSortMulti:true,
        columns:[
            {title:"???????? (??????)", field:"period",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
            {title:"(%) ???????? ???? ????????", field:"ptp",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
            {title:"?????????? ????????", field:"periodint",visible:false},
            {title:"(%) ???????????? ??????", field:"yearly",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3},
            {title:"(%) ???????????? ???? ??????", field:"diff",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:3,
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
    })}

    useEffect(handleGetReturn,[onDate,target,periodList])

    return(
        <aside>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            <div id='detailsTable'></div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='EtfOption'>
                <label>??????????</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleOnDate}/>
                <label>(%) ?????? ????????????</label>
                <input value={target} type='number' step='0.1' className="custom-input" onChange={e=>setTarget(e.target.value)}></input>
                <div className="EtfAddBox">
                <label>(??????)????????</label>
                <input  type='number' step='1' className="custom-input" onChange={e=>setAddPeriodList(e.target.value)}></input>
                <button onClick={handlePeriodList}>????????????</button>
                </div>
            </div>
        </aside>
    )
}


export default Return
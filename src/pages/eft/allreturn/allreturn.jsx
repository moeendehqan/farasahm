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

const AllReturn = () =>{
    const username= getCookie('username')
    const [onDate, setonDate] = useState(false)
    const [msg, setMsg] = useState(null)
    const [etfList, setEtfList] = useState([])
    const [etfSelectm, setEtfSelect] = useState([])
    const [dataTable, setDataTable] = useState(null)

    if(dataTable!=null){
    var mx1 = Math.max(...dataTable.map(i=>i['1']))
    var mx14 = Math.max(...dataTable.map(i=>i['13']))
    var mx30 = Math.max(...dataTable.map(i=>i['30']))
    var mx90 = Math.max(...dataTable.map(i=>i['90']))
    var mx180 = Math.max(...dataTable.map(i=>i['180']))
    var mx365 = Math.max(...dataTable.map(i=>i['365']))
    var table = new Tabulator("#detailsTable", {
        data:dataTable,
        columnHeaderSortMulti:true,
        columns:[
            {title:"صندوق", field:"index",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2},
            {title:"(%)یکروزه", field:"1",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
            {title:"(%)دوهفته", field:"14",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
            {title:"(%)یکماهه", field:"30",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
            {title:"(%)سه ماهه", field:"90",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
            {title:"(%)شش ماهه", field:"180",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
            {title:"(%)یکساله", field:"365",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
            formatter:function(cell, formatterParams){
                var value = cell.getValue();
                return("<div class='EtfNavRDTContiner'><div class='EtfNavRDTP' style='width:"+(((value)/mx1)*50).toString()+'%'+"'> </div><p>"+ value.toString()+'%' +"</p></div>")
            }},
        ],
        layout: "fitColumns",
    }
    )
}
    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');
    const handleOnDate = (date) =>{setonDate(DatePickerToInt(date))}

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

        const handleEtfSelect = (ev)=>{
            const inList = (etfList.find(i => i.symbol==ev))
            if(inList.symbol==ev && inList!= undefined){
                setEtfSelect([...etfSelectm,ev])
            }
        }

        const handleGetEtfList = () =>{
            axios({
                method:'POST',
                url:serverAddress+'/etf/etflist',
                data:{
                    username:username,
                    onDate:onDate,
                }
            }).then(Response=>{
                setEtfList(Response.data)
            })
        }
        const handleGetReturn = ()=>{
            setMsg(null)
            axios({
                method:'POST',
                url: serverAddress+'/etf/allreturn',
                data:{
                    username:username,
                    onDate:onDate,
                    etfSelectm:etfSelectm,
                }
            }).then((Response)=>{
                if(Response.data.replay){
                    setDataTable((Response.data.data))
                }else{
                    setMsg(Response.data.msg)
                }})        }

    useEffect(handleGetEtfList,[])
    useEffect(handleGetReturn,[etfSelectm, onDate])
    return(
        <aside>
            <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
            <div id='detailsTable'></div>
            <Alarm msg={msg} smsg={setMsg}/>
            <div className='EtfOption'>
                <label>تاریخ</label>
                <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleOnDate}/>

                <label>قیاس</label>
                <input list='browsers' onChange={(e)=>handleEtfSelect(e.target.value)} />
                <datalist id="browsers">
                    {etfList.map(items=>{
                        return(
                            <option key={items.symbol} value={items.symbol}>{items.name}</option>
                        )
                    })
                    }
                </datalist>
            </div>
        </aside>
    )
}

export default AllReturn
import './newbie.css'
import axios from 'axios'
import { serverAddress } from '../../../config/config'
import {getCookie} from '../../../components/cookie'
import { useEffect, useState} from 'react';
import DatePicker from 'react-multi-date-picker';
import persian from "react-date-object/calendars/persian"
import persian_fa from 'react-date-object/locales/persian_fa'
import { DatePickerToInt } from '../../../components/datetoint';
import Alarm from '../../../components/alarm/alarm';
import {TabulatorFull as Tabulator} from 'tabulator-tables';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas';
import MiniLoader from '../../../components/loader/miniloader'

const Newbie = () =>{
    const username = getCookie('username')
    const [msg, setMsg] = useState(null)
    const [fromDate, setFromData] = useState(false)
    const [toDate, setToData] = useState(false)
    const [dataNewbie, setDataNewbie] = useState(null)
    
    window.XLSX = XLSX;
    window.jspdf  = require('jspdf');

    const exportPdf = () => {
        html2canvas(document.querySelector("#NewbieChart")).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgProps= pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("download.pdf");
        })}

    
    if(dataNewbie!=null){
        console.log((dataNewbie))
        var volper =dataNewbie.map(i=>i.volper)
        var vpmx = Math.max(...volper)
        
        var numper =dataNewbie.map(i=>i.numper)
        var npmx = Math.max(...numper)

        var srnper =dataNewbie.map(i=>i.sarane)
        var nsmx = Math.max(...srnper)

        var table = new Tabulator("#detailsTable", {
            data:(dataNewbie),
            columnHeaderSortMulti:true,
            columns:[
                {title:"??????????", field:"Date",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div><p>"+ (value).toLocaleString() +"</p></div>")
                }
                },
                {title:"?????????? ????", field:"allnum",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div><p>"+ (value*1).toLocaleString() +"</p></div>")
                }
                },
                {title:"?????????? ????????????????????", field:"newnum",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:1,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div><p>"+ (value*1).toLocaleString() +"</p></div>")
                }
                },
                {title:"?????? ????", field:"allvol",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div><p>"+ (value*1).toLocaleString() +"</p></div>")
                }
                },
                {title:"?????? ????????????????????", field:"newvol",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div><p>"+ (value*1).toLocaleString() +"</p></div>")
                }
                },
                {title:"%?????????? ????????????????????", field:"numper",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div class='StocksTableChartContiner'><div class='StocksTableChart' style='width:"+(((value)/npmx)*50).toString()+'%'+"'> </div><p>"+ value.toLocaleString()+'%' +"</p></div>")

                }
                },
                {title:"%?????? ????????????????????", field:"volper",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div class='StocksTableChartContiner'><div class='StocksTableChart' style='width:"+(((value)/vpmx)*50).toString()+'%'+"'> </div><p>"+ value.toLocaleString()+'%' +"</p></div>")
                }
                },
                {title:"?????? ??????????", field:"sarane",hozAlign:'center',headerHozAlign:'center',resizable:true, widthGrow:2,
                formatter:function(cell, formatterParams){
                    var value = cell.getValue();
                    return("<div class='StocksTableChartContiner'><div class='StocksTableChart' style='width:"+(((value)/nsmx)*50).toString()+'%'+"'> </div><p>"+ (Math.round(value*1)).toLocaleString() +"</p></div>")
                }
                },
            ],
            layout: "fitColumns",
        })
    }
    
    const handleFromDate = (date) =>{setFromData(DatePickerToInt(date))}
    const handleToDate = (date) =>{setToData(DatePickerToInt(date))}

    const handleNewbieData = () =>{
        axios({
            method: 'POST',
            url:serverAddress+'/stocks/newbie',
            data: {
                username:username,
                fromDate:fromDate,
                toDate:toDate,
            }
        }).then(Response=>{
            if(Response.data.replay){

                setDataNewbie(JSON.parse(Response.data.data))
            }
        })
    }

    useEffect(handleNewbieData, [fromDate, toDate])

    return(
        <aside>
            <div>
                <h3>???????? ???????????? ????</h3>
                <div className='StocksDownloadBox'>
                <img src={require('../../../icon/xlsx.png')} alt='pdf' onClick={()=>{table.download("xlsx", "data.xlsx")}}></img>
                <img src={require('../../../icon/pdf.png')} alt='xlsx' onClick={exportPdf}></img>
            </div>
                {dataNewbie==null?
                <div className='ContinerLoader'><MiniLoader/></div>
                :null}
                <div id='detailsTable'></div>


                <Alarm msg={msg} smsg={setMsg}/>
            </div>



            <div className='StocksOption'>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleFromDate}/>
                    ???? ??????????
                </label>
                <label className='StocksDateLabel'>
                    <DatePicker calendar={persian} locale={persian_fa} className="purple" inputClass="custom-input" onChange={handleToDate}/>
                    ???? ??????????
                </label>
            </div>
        </aside>
    )
}

export default Newbie
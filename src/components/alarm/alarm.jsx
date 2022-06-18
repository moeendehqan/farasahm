import './alarm.css'
import{ useEffect, useMemo,useState} from 'react'
const Alarm = (props) =>{

    if(props.msg!==null){
        return(
            <div className='Alarm'>
                <span>{props.msg}</span>
                <button onClick={()=>props.smsg(null)}>تایید</button>
            </div>
        )
    }
}

export default Alarm
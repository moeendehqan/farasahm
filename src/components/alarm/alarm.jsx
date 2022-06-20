import './alarm.css'
const Alarm = (props) =>{

    if(props.msg!==null){
        return(
            <div className='Alarm'>
                <div>{props.msg}</div>
                <button onClick={()=>props.smsg(null)}>تایید</button>
            </div>
        )
    }
}

export default Alarm
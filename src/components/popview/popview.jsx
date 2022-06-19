import './popview.css'
const Popview = (props) =>{

    if(props.contet!==null){
        return(
            <div className='Popview'>
                <span>{props.contet}</span>
                <button onClick={()=>props.scontent(null)}>تایید</button>
            </div>
        )
    }
}

export default Popview
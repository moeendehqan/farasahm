import './popview.css'
const Popview = (props) =>{

    if(props.contet!==null){
        return(
            <div className='Popview'>
                {props.contet}
                <button onClick={()=>props.scontent(null)}>تایید</button>
            </div>
        )
    }
}

export default Popview
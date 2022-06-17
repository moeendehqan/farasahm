import { useNavigate } from "react-router-dom"
import './menu.css'
const Menu = (props) =>{
    const Navigate = useNavigate()
    const handleNavigate = (a) =>{Navigate(a)}


    return(
        <div className='Menu'>
            {props.menuProperties.map(item=>{

                return(
                    <div key={item.key} onClick={()=>handleNavigate(item.navigate)}>
                        <img src={item.icon} alt={item.navigate}></img>
                        <h3 >{item.title}</h3>
                    </div>
                )
            })}

        </div>
    )
}

export default Menu
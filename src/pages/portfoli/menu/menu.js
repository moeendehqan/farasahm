import { useNavigate } from "react-router-dom"
import './menu.css'

const Menu = () =>{
    const nav = useNavigate()
    const handleMenu = (a) =>{nav(a)}

    return(
        <div className='menuportfoli'>
            <button className="portfolimenubtn" onClick={()=>handleMenu('update')}>بروزرسانی</button>
            <button className="portfolimenubtn" onClick={()=>handleMenu('customerreviews')}>مرور مشتری</button>
            <button className="portfolimenubtn" onClick={()=>handleMenu('groupreviews')}>مرور گروه</button>
        </div>
    )
}

export default Menu
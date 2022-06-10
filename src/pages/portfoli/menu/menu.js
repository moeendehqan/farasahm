import { useNavigate } from "react-router-dom"

const Menu = () =>{
    const nav = useNavigate()
    const handleMenu = (a) =>{nav(a)}

    return(
        <div>
            <button onClick={()=>handleMenu('update')}>بروزرسانی</button>
            <button onClick={()=>handleMenu('customerreviews')}>مرور مشتری</button>
            <button onClick={()=>handleMenu('groupreviews')}>مرور گروه</button>
        </div>
    )
}

export default Menu
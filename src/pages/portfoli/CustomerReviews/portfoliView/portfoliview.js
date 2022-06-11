import { useState } from "react"

const PortfoliView = (props)=>{
    const [portfoli,setPortfoli] = useState(null)
    return(
        <div>
            <button>پرتفوی</button>
            <button>عملکرد</button>
            {portfoli}
        </div>
    )
}

export default PortfoliView
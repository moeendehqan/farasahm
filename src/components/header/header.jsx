
import './header.css'

const Header = (props)=>{


    return(
        <div>
            <div className='Header'>
                <div className='HeaderTitle'>
                    <h1>فراسهم</h1>
                    <h4>{props.section}</h4>
                </div>
                <div className='HeaderWellcom'>
                    <h1>خوش آمدید</h1>
                    <h5>{props.username}</h5>
                </div>
                <div className='HeaderImg'>
                    <img src={require('../../icon/porofile.png')}></img>
                </div>
                <div className='HeaderMenu'>
                    <span>...</span>
                </div>
            </div>
        </div>
    )
}

export default Header
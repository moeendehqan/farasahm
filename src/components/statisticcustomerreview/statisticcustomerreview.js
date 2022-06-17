

import './statisticcustomerreview.css'
const Statisticcustomerreview = (props) =>{

    return(
        <div>
            <div className="statisticcustomerreview">
                <div className="statisticcustomerreview-mc">
                    <div className="statisticcustomerreview-t">
                        <h3>بیشترین بازدهی مشتریان</h3>
                    </div>
                    <div className="statisticcustomerreview-b">
                        <h3>کمترین بازدهی مشتریان</h3>
                    </div>
                </div>
                <div className="statisticcustomerreview-ms">
                    <div className="statisticcustomerreview-ta">
                        <h3>بیشترین دارایی مشتریان</h3>
                    </div>
                    <div className="statisticcustomerreview-ps">
                        <h3>سودساز ترین نماد</h3>
                    </div>
                    <div className="statisticcustomerreview-ls">
                        <h3>زیان ساز ترین نماد</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statisticcustomerreview
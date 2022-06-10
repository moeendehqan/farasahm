
import './App.css';
import Home from './pages/home/home'
import Section from './pages/section/section';
import Etf from './pages/eft/eft'
import Portfoli from './pages/portfoli/portfoli'
import Update from './pages/portfoli/update/update'
import CustomerReviews from './pages/portfoli/CustomerReviews/CustomerReviews'
import GroupReviews from './pages/portfoli/GroupReviews/GroupReviews'
import Stocks from './pages/stocks/stocks'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/section' element={<Section />}/>
        <Route path='/etf' element={<Etf />}/>
        <Route path='/portfoli' element={<Portfoli />}>
          <Route path='update' element={<Update />}/>
          <Route path='customerreviews' element={<CustomerReviews />}/>
          <Route path='groupreviews' element={<GroupReviews />}/>
        </Route>
        <Route path='/stocks' element={<Stocks />}/>
      </Routes>
    </BrowserRouter>

  )
}

export default App;


import './App.css';
import Home from './pages/home/home'
import Section from './pages/section/section'
import Etf from './pages/eft/eft'
import Nav from './pages/eft/nav/nav';
import DashboardEtf from './pages/eft/dashboard/dashboard';
import Volume from './pages/eft/volume/volume';
import Return from './pages/eft/return/return';
import Reserve from './pages/eft/reserve/reserve'
import Portfoli from './pages/portfoli/portfoli'
import Update from './pages/portfoli/update/update'
import CustomerReviews from './pages/portfoli/CustomerReviews/CustomerReviews'
import GroupReviews from './pages/portfoli/GroupReviews/GroupReviews'
import Stocks from './pages/stocks/stocks'
import Dashboard from './pages/stocks/dashboard/dashboard'
import UpdateStocks from './pages/stocks/update/update'
import Traders from './pages/stocks/traders/traders';
import Newbie from './pages/stocks/newbie/newbie';
import Station from './pages/stocks/station/station';
import Sediment from './pages/stocks/sediment/sediment';
import Details from './pages/stocks/details/details'
import NoPage from './components/nopage/nopage';

import {BrowserRouter, Routes, Route} from 'react-router-dom'
function App() {

  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/section' element={<Section />}/>
        <Route path='/etf' element={<Etf />}>
          <Route path='nav' element={<Nav />}/>
          <Route path='dashboard' element={<DashboardEtf />}/>
          <Route path='volume' element={<Volume />}/>
          <Route path='return' element={<Return />}/>
          <Route path='reserve' element={<Reserve />}/>
        </Route>
        <Route path='/portfoli' element={<Portfoli />}>
          <Route path='update' element={<Update />}/>
          <Route path='customerreviews' element={<CustomerReviews />}/>
          <Route path='groupreviews' element={<GroupReviews />}/>
        </Route>
        <Route path='/stocks' element={<Stocks />}>
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='update' element={<UpdateStocks />} />
          <Route path='traders' element={<Traders />} />
          <Route path='newbie' element={<Newbie />} />
          <Route path='station' element={<Station />} />
          <Route path='sediment' element={<Sediment />} />
          <Route path='details' element={<Details />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;

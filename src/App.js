import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from "./pages/Home";
import Dashboard from './pages/Dashboard';
import CoinPage from './pages/CoinPage';
import ComparePage from './pages/ComparePage';
import WatchlistPage from './pages/WatchlistPage';
import Footer from './components/Common/Footer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="app-shell">
          <main className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/coin/:id" element={<CoinPage />} />
              <Route path="/compare" element={<ComparePage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

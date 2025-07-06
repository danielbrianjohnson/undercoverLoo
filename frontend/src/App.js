import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import AddLooPage from './pages/AddLooPage';
import ListPage from './pages/ListPage';
import LooDetailPage from './pages/LooDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/add" element={<AddLooPage />} />
          <Route path="/list" element={<ListPage />} />
          <Route path="/loo/:id" element={<LooDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

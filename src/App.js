// App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* İhtiyacınıza göre farklı yönlendirmeler ekleyebilirsiniz */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

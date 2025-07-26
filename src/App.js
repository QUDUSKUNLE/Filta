import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './contexts/UserContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import AuthManager from './components/AuthManager';
import SubscriptionModal from './components/SubscriptionModal';
// import TrialExpiredModal from './components/TrialExpiredModal';
import './App.css';

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Features />
                <Pricing />
              </>
            } />
          </Routes>
        </main>
        <Footer />
        <AuthManager />
        <SubscriptionModal />
        {/* <TrialExpiredModal /> */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#667eea',
              color: '#fff',
              borderRadius: '10px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500'
            },
            success: {
              style: {
                background: '#10b981',
              }
            },
            error: {
              style: {
                background: '#ef4444',
              }
            }
          }}
        />
      </div>
    </Router>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
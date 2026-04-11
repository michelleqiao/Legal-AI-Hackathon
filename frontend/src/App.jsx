import React, { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import IncorporationPage from './components/IncorporationPage.jsx';
import AgreementsPage from './components/AgreementsPage.jsx';
import PatentsPage from './components/PatentsPage.jsx';
import FundraisingPage from './components/FundraisingPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function navigate(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  function goHome() {
    navigate('home');
  }

  switch (currentPage) {
    case 'incorporation':
      return <IncorporationPage onBack={goHome} />;

    case 'service-agreements':
      return <AgreementsPage type="service" onBack={goHome} />;

    case 'employment-agreements':
      return <AgreementsPage type="employment" onBack={goHome} />;

    case 'patents':
      return <PatentsPage onBack={goHome} />;

    case 'fundraising':
      return <FundraisingPage onBack={goHome} />;

    case 'home':
    default:
      return <HomePage onNavigate={navigate} />;
  }
}

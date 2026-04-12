import React, { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import IncorporationPage from './components/IncorporationPage.jsx';
import AgreementsPage from './components/AgreementsPage.jsx';
import PatentsPage from './components/PatentsPage.jsx';
import FundraisingPage from './components/FundraisingPage.jsx';
import NDAPage from './components/NDAPage.jsx';
import DocumentRepositoryPage from './components/DocumentRepositoryPage.jsx';
import MeetingNotesPage from './components/MeetingNotesPage.jsx';
import FloatingChat from './components/FloatingChat.jsx';

const PAGE_MODULES = {
  incorporation: 'incorporation',
  'service-agreements': 'service-agreements',
  'employment-agreements': 'employment-agreements',
  nda: 'nda',
  patents: 'patents',
  fundraising: 'fundraising',
  'meeting-notes': 'general',
  documents: 'general',
  home: 'general',
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  function navigate(page) {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  }

  function goHome() {
    navigate('home');
  }

  let pageContent;
  switch (currentPage) {
    case 'incorporation':
      pageContent = <IncorporationPage onBack={goHome} />; break;
    case 'service-agreements':
      pageContent = <AgreementsPage type="service" onBack={goHome} />; break;
    case 'employment-agreements':
      pageContent = <AgreementsPage type="employment" onBack={goHome} />; break;
    case 'nda':
      pageContent = <NDAPage onBack={goHome} />; break;
    case 'patents':
      pageContent = <PatentsPage onBack={goHome} />; break;
    case 'fundraising':
      pageContent = <FundraisingPage onBack={goHome} />; break;
    case 'meeting-notes':
      pageContent = <MeetingNotesPage onBack={goHome} />; break;
    case 'documents':
      pageContent = <DocumentRepositoryPage onBack={goHome} />; break;
    case 'home':
    default:
      pageContent = <HomePage onNavigate={navigate} />;
  }

  return (
    <>
      {pageContent}
      <FloatingChat currentModule={PAGE_MODULES[currentPage] || 'general'} />
    </>
  );
}

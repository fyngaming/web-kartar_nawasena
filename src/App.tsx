import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public Sections
import { HeroSection } from './components/public/HeroSection';
import { AboutSection } from './components/public/AboutSection';
import { StatsSection } from './components/public/StatsSection';
import { ProgramsSection } from './components/public/ProgramsSection';
import { NewsSection } from './components/public/NewsSection';
import { AgendaSection } from './components/public/AgendaSection';
import { GallerySection } from './components/public/GallerySection';
import { StructureSection } from './components/public/StructureSection';
import { SocialMediaSection } from './components/public/SocialMediaSection';
import { FAQSection } from './components/public/FAQSection';
import { FeedbackSection } from './components/public/FeedbackSection';
import { ContactSection } from './components/public/ContactSection';

// Registration Pages
import { JoinInfoPage } from './components/registration/JoinInfoPage';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { CheckStatusPage } from './components/registration/CheckStatusPage';

// Admin CMS Components
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { activeTab, isAdminMode, loading } = useApp();
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Loading screen saat ambil data dari Supabase
  if (loading) {
    return (
      <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center gap-6">
        <div className="w-16 h-16 border-4 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
        <div className="text-center">
          <p className="text-white font-bold text-lg">Karang Taruna Nawasena</p>
          <p className="text-slate-400 text-sm mt-1">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (isAdminMode) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#022c22] text-slate-100 flex flex-col font-sans relative selection:bg-amber-400 selection:text-slate-950">
      {/* Background Mesh Gradient Glows for Frosted Glass Theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-600/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-emerald-700/15 rounded-full blur-[140px]" />
      </div>

      {/* Main Sticky Glass Navigation Bar */}
      <Navbar onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Main Dynamic View Content */}
      <main className="flex-1 relative z-10">
        {activeTab === 'home' && (
          <>
            <HeroSection />
            <StatsSection />
            <AboutSection />
            <ProgramsSection />
            <NewsSection />
            <AgendaSection />
            <GallerySection />
            <StructureSection />
            <SocialMediaSection />
            <FAQSection />
            <FeedbackSection />
            <ContactSection />
          </>
        )}

        {activeTab === 'tentang' && (
          <div className="pt-12">
            <AboutSection />
            <StructureSection />
          </div>
        )}

        {activeTab === 'program' && (
          <div className="pt-12">
            <ProgramsSection />
          </div>
        )}

        {activeTab === 'berita' && (
          <div className="pt-12">
            <NewsSection />
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="pt-12">
            <AgendaSection />
          </div>
        )}

        {activeTab === 'galeri' && (
          <div className="pt-12">
            <GallerySection />
          </div>
        )}

        {activeTab === 'struktur' && (
          <div className="pt-12">
            <StructureSection />
          </div>
        )}

        {activeTab === 'prestasi' && (
          <div className="pt-12">
            <SocialMediaSection />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="pt-12">
            <FAQSection />
            <FeedbackSection />
          </div>
        )}

        {activeTab === 'kontak' && (
          <div className="pt-12">
            <ContactSection />
            <FeedbackSection />
          </div>
        )}

        {/* Membership Registration Sub-routes */}
        {activeTab === 'join-info' && (
          <div className="pt-12">
            <JoinInfoPage />
          </div>
        )}

        {activeTab === 'register' && (
          <div className="pt-12">
            <RegistrationForm />
          </div>
        )}

        {activeTab === 'check-status' && (
          <div className="pt-12">
            <CheckStatusPage />
          </div>
        )}
      </main>

      {/* Main Glass Footer */}
      <Footer onOpenAdminLogin={() => setIsAdminLoginOpen(true)} />

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

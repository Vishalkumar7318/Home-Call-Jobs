/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/public/Hero';
import { AboutUs } from './components/public/AboutUs';
import { WhyChooseUs } from './components/public/WhyChooseUs';
import { ContactSection } from './components/public/ContactSection';
import { EmployeeLogin } from './components/employee/EmployeeLogin';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { getSettings, DEFAULT_SETTINGS } from './services/db';
import type { SiteSettings } from './types';

function MainApp() {
  const { isEmployee, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<'public' | 'employee' | 'admin'>('public');

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [dataLoading, setDataLoading] = useState(true);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const fetchedSettings = await getSettings();
      setSettings(fetchedSettings);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNavigateSection = (sectionId: string) => {
    setActiveView('public');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: Public Home Portal - Clean, without Available Jobs section */}
        {activeView === 'public' && (
          <div className="space-y-0">
            {/* 1. Home / Hero */}
            <div id="home">
              <Hero
                settings={settings}
                onNavigateSection={handleNavigateSection}
              />
            </div>

            {/* 2. About Us Section (With required statement & no payment buttons) */}
            <AboutUs />

            {/* 3. Why Choose Us Section */}
            <WhyChooseUs />

            {/* 4. Contact Section */}
            <ContactSection settings={settings} />
          </div>
        )}

        {/* VIEW 2: Employee Experience (Login or Dashboard) */}
        {activeView === 'employee' && (
          <div>
            {isEmployee ? (
              <EmployeeDashboard
                onBackToJobs={() => setActiveView('public')}
                onReturnToAdmin={() => setActiveView('admin')}
              />
            ) : (
              <EmployeeLogin
                onSuccess={() => setActiveView('employee')}
                onSwitchToPublic={() => setActiveView('public')}
                onSwitchToAdmin={() => setActiveView('admin')}
              />
            )}
          </div>
        )}

        {/* VIEW 3: Admin Experience (Login or Dashboard) */}
        {activeView === 'admin' && (
          <div>
            {isAdmin ? (
              <AdminDashboard
                onBackToJobs={() => setActiveView('public')}
                onViewEmployeePortal={(emp) => setActiveView('employee')}
              />
            ) : (
              <AdminLogin
                onSuccess={() => setActiveView('admin')}
                onSwitchToPublic={() => setActiveView('public')}
                onSwitchToEmployee={() => setActiveView('employee')}
              />
            )}
          </div>
        )}

      </main>

      {/* Footer */}
      {activeView === 'public' && (
        <Footer
          settings={settings}
          onNavigateSection={handleNavigateSection}
          onOpenPortal={(portal) => setActiveView(portal)}
        />
      )}

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}

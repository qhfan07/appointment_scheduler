import React from 'react';
import AppointmentScheduler from './components/AppointmentScheduler';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Appointment Scheduler</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <AppointmentScheduler />
      </main>
      <footer className="bg-white border-t mt-8">
        <div className="max-w-7xl mx-auto py-4 px-4 text-center text-gray-600">
          © {new Date().getFullYear()} Appointment Scheduler. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;
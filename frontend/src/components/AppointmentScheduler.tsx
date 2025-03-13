import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentForm from './AppointmentForm';
import AppointmentSearch from './AppointmentSearch';
import AppointmentList from './AppointmentList';

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });

  // Generate available time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send the new appointment data to backend
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Fetch the updated list of appointments from the backend
        const updatedAppointments = await fetch('/api/appointments').then(res => res.json());
        // Update the appointments state with the latest data
        setAppointments(updatedAppointments);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          notes: ''
        });
      } else {
        // Log an error if the appointment creation fails
        console.error('Fail to update appointment:', response.statusText)
      }
    } catch (error) {
      // Log an error if the request fails
      console.error('Updating new appointment error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <AppointmentForm 
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        timeSlots={timeSlots}
      />
      
      <AppointmentSearch appointments={appointments} />

      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList appointments={appointments} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;
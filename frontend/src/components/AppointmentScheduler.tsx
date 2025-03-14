import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentForm from './AppointmentForm';
import AppointmentSearch from './AppointmentSearch';
import AppointmentList from './AppointmentList';

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const LIMIT = 5;

  // Fetch data for each page
  const fetchAppointments = async (pageToFetch: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments?page=${pageToFetch}&limit=${LIMIT}`);
      if (!response.ok) {
        throw new Error('Fail to fetch appointments.');
      }
      const result = await response.json();
      // Return format：{ total, page, limit, data }
      setAppointments(result.data);
      const computedTotalPages = Math.ceil(result.total / result.limit);
      setTotalPages(computedTotalPages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  // Fetch appointments for the first page when the component mounts
  useEffect(() => {
    fetchAppointments(1);
  }, []); // An empty dependency array ensures it only runs once on mount

  // Generate available time slots from 9 AM to 5 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send the new appointment data to backend
      const response = await fetch('http://localhost:3000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        // Get the updated appointment data
        await fetchAppointments(1);
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
        console.error('Fail to update appointment:', response.statusText);
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fail to submit appointment.');
      }
    } catch (error) {
      // Log an error if the request fails
      console.error('Updating new appointment error:', error);
    }
  };

  // Fetch data for next page when clicking next page button
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchAppointments(pageNumber);
  };


  return (
    <div className="max-w-4xl mx-auto p-4">
      <AppointmentForm 
        formData={formData}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        timeSlots={timeSlots}
      />
      <AppointmentSearch/>
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <AppointmentList appointments={appointments} />
          {/* pagination component */}
          {totalPages > 0 && (
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={`px-3 py-1 rounded ${pageNumber === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {pageNumber}
                    </button>
                ))}
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;
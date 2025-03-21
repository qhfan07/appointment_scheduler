import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentForm from './AppointmentForm';
import AppointmentSearch from './AppointmentSearch';
import AppointmentList from './AppointmentList';

// Define the Appointment interface for type safety
export interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
}

const AppointmentScheduler = () => {
  // State to hold appointments data and pagination info
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    notes: ''
  });
  const LIMIT = 5; // Number of appointments per page

  // Fetch appointments for a given page
  const fetchAppointments = async (pageToFetch: number = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/api/appointments?page=${pageToFetch}&limit=${LIMIT}`);
      if (!response.ok) {
        throw new Error('Fail to fetch appointments.');
      }
      const result = await response.json();
      setAppointments(result.data);
      const computedTotalPages = Math.ceil(result.total / result.limit);
      setTotalPages(computedTotalPages);
      return computedTotalPages;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return 0;
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

  // Update formData state when an input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission for creating or updating an appointment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAppointment) {
        // Send the new appointment data to backend
        const response = await fetch(`http://localhost:3000/api/appointments/${editingAppointment.id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          // Get the updated first page appointment data
          setPage(1);
          await fetchAppointments(1);
          setEditingAppointment(null);
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
      } else {
        // Make a new appointment
        const response = await fetch('http://localhost:3000/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          // Reload first page
          setPage(1);
          await fetchAppointments(1);
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            notes: ''
          });
        } else {
          console.error('Fail to create appointment:', response.statusText);
          const errorData = await response.json();
          throw new Error(errorData.error || 'Fail to create appointment.');
        }
      }
    } catch (error) {
      // Log an error if the request fails
      console.error('Updating new appointment error:', error);
    }
  };

  // Delete existing appointments and refresh the list
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:3000/api/appointments/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }
      const newTotalPages = await fetchAppointments(page);
      // If the current page exceeds the new total number of pages, then switch to the first page
      if (page > newTotalPages) {
        setPage(1);
        await fetchAppointments(1);
      }
    } catch (error) {
      console.error('Delete appointment error:', error);
    }
  };

  // Set the appointment to be edited and populate formData with its values
  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setFormData({
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes || ''
    });
  };

  // Handle page change in pagination
  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
    fetchAppointments(pageNumber);
  };

  // Generate a pagination range for display
  const getPaginationRange = (current: number, total: number, siblingCount = 2): (number | string)[] => {
    const totalPageNumbers = siblingCount * 2 + 5;
    if (totalPageNumbers >= total) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const leftSiblingIndex = Math.max(current - siblingCount, 1);
    const rightSiblingIndex = Math.min(current + siblingCount, total);
    const showLeftEllipsis = leftSiblingIndex > 2;
    const showRightEllipsis = rightSiblingIndex < total - 1;

    const pages: (number | string)[] = [];
    if (!showLeftEllipsis && showRightEllipsis) {
      // No left ellipsis, but right ellipsis needed:
      const leftRange = Array.from({ length: rightSiblingIndex }, (_, i) => i + 1);
      pages.push(...leftRange);
      pages.push('...');
      pages.push(total);
    } else if (showLeftEllipsis && !showRightEllipsis) {
      // Left ellipsis needed, but not right ellipsis:
      pages.push(1);
      pages.push('...');
      const rightRange = Array.from({ length: total - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      pages.push(...rightRange);
    } else if (showLeftEllipsis && showRightEllipsis) {
      pages.push(1);
      pages.push('...');
      const middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      pages.push(...middleRange);
      pages.push('...');
      pages.push(total);
    } else {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    return pages;
  };

  const paginationRange = getPaginationRange(page, totalPages, 2);

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
          <AppointmentList
              appointments={appointments}
              onDelete={handleDelete}
              onEdit={handleEdit}
          />
          {/* pagination component */}
          {totalPages > 0 && (
              <div className="flex flex-col items-center mt-4">
                <div className="flex justify-center space-x-2">
                  {paginationRange.map((item, index) =>
                      typeof item === 'number' ? (
                          <button
                              key={index}
                              onClick={() => handlePageChange(item)}
                              className={`px-3 py-1 rounded ${item === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                          >
                            {item}
                          </button>
                      ) : (
                          <span key={index} className="px-3 py-1">
                            {item}
                          </span>
                      )
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Total pages: {totalPages}
                </div>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduler;
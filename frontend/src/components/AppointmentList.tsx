import React from 'react';
import { CalendarDays } from 'lucide-react';

interface Appointment {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  notes?: string;
}

interface AppointmentListProps {
  appointments: Appointment[];
  emptyMessage?: string;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments,
  emptyMessage = "No appointments scheduled yet"
}) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CalendarDays className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map(appointment => (
        <div
          key={appointment.id}
          className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
        >
          <div className="grid grid-cols-2 gap-2">
            <p><span className="font-medium">Name:</span> {appointment.name}</p>
            <p><span className="font-medium">Email:</span> {appointment.email}</p>
            <p><span className="font-medium">Phone:</span> {appointment.phone}</p>
            <p><span className="font-medium">Date:</span> {appointment.date}</p>
            <p><span className="font-medium">Time:</span> {appointment.time}</p>
          </div>
          {appointment.notes && (
            <p className="mt-2">
              <span className="font-medium">Notes:</span> {appointment.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
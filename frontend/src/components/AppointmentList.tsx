import React from 'react';
import {CalendarDays, Edit2, Trash2} from 'lucide-react';

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
  onDelete?: (id: number) => void;
  onEdit?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ 
  appointments,
  emptyMessage = "No appointments scheduled yet",
  onDelete,
  onEdit,
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
              className="relative p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
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
            <div className="absolute bottom-2 right-2 flex space-x-2">
              {onEdit && (
                  <button
                      onClick={() => onEdit(appointment)}
                      className="p-2 text-blue-600 hover:text-blue-800"
                      title="Edit"
                  >
                    <Edit2 className="w-5 h-5"/>
                  </button>
              )}
              {onDelete && (
                  <button
                      onClick={() => onDelete(appointment.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title="Delete"
                  >
                    <Trash2 className="w-5 h-5"/>
                  </button>
              )}
            </div>
          </div>
      ))}
    </div>
  );
};

export default AppointmentList;
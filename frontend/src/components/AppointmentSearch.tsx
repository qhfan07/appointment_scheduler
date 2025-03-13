import React, {useEffect, useState} from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import AppointmentList from './AppointmentList';

const AppointmentSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  useEffect(() => {
    const searchAppointments = async () => {
      if (!searchTerm) {
        setFilteredAppointments([]);
        return;
      }
      try {
        const response = await fetch(
            `http://localhost:3000/api/appointments/search?term=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Search failure');
        }
        const data = await response.json();
        setFilteredAppointments(data);
      } catch (error) {
        console.error('Fail to search appointment:', error);
      }
    };
    searchAppointments();
  }, [searchTerm]);
  return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-6 h-6" />
            Search Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <input
                type="text"
                placeholder="Search by any field..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {searchTerm && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-3">Search Results</h3>
                  <AppointmentList
                      appointments={filteredAppointments}
                      emptyMessage="No appointments found matching your search criteria"
                  />
                </div>
            )}
          </div>
        </CardContent>
      </Card>
  );
};

export default AppointmentSearch;
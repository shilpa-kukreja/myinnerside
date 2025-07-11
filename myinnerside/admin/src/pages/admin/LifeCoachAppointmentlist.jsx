import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  MagnifyingGlassIcon,
  TrashIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

const LifeCoachAppointmentlist = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [AllAppointments, setAllAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`https://myinnerside.com/api/lifecoach/all`, {
        params: {
          page: currentPage,
          limit: appointmentsPerPage,
           search: ''
        }
      });
      setAllAppointments(data.appointments);
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
      setTotalAppointments(data.totalAppointments);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch life coach appointments');
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = AllAppointments.filter(app =>
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.number?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setAppointments(filtered);
    setCurrentPage(1);
  }, [searchTerm, AllAppointments]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(`https://myinnerside.com/api/lifecoach/${id}`);
        toast.success('Appointment deleted successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to delete appointment');
      }
    }
  };

  const openAppointmentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Life Coach Appointments</h1>
          
          <div className="relative mt-4 md:mt-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search appointments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{appointment.name}</div>
                          <div className="text-sm text-gray-500 capitalize">{appointment.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {appointment.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <PhoneIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {appointment.number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(appointment.date)}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {appointment.slot}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">Language:</span> {appointment.language}
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Reason:</span> {appointment.bookingReason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openAppointmentModal(appointment)}
                          className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(appointment._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? 'No matching appointments found' : 'No life coach appointments scheduled yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalAppointments > appointmentsPerPage && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * appointmentsPerPage) + 1} to{' '}
              {Math.min(currentPage * appointmentsPerPage, totalAppointments)} of {totalAppointments} appointments
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`px-3 py-1 rounded-md ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Life Coach Session Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Client Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Name:</span>
                        <span className="ml-2">{selectedAppointment.name}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Email:</span>
                        <span className="ml-2">{selectedAppointment.email}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{selectedAppointment.number}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium">Gender:</span>
                        <span className="ml-2 capitalize">{selectedAppointment.gender}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Session Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-3">
                        <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{formatDate(selectedAppointment.date)}</span>
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-5 w-5 text-gray-500 mr-2" />
                        <span className="font-medium">Time Slot:</span>
                        <span className="ml-2">{selectedAppointment.slot}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Session Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="mb-3">
                        <div className="flex items-center">
                          <InformationCircleIcon className="h-5 w-5 text-gray-500 mr-2" />
                          <span className="font-medium">Booking Reason:</span>
                        </div>
                        <p className="mt-1 ml-7 capitalize">{selectedAppointment.bookingReason}</p>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">Preferred Language:</span>
                          <span className="ml-2 capitalize">{selectedAppointment.language}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">System Information</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">Created At:</span>
                        <span>
                          {new Date(selectedAppointment.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Last Updated:</span>
                        <span>
                          {new Date(selectedAppointment.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LifeCoachAppointmentlist;
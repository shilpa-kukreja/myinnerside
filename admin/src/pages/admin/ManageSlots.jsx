import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { AdminContext } from '../../context/AdminContext';
import '../../assets/Css/Appointment.css';

const timeSlots = [
    "8:00AM - 8:55AM", "9:00AM - 9:55AM",
    "11:00AM - 11:55AM", "12:00PM - 12:55PM", "1:00PM - 1:55PM",
    "2:00PM - 2:55PM", "3:00PM - 3:55PM", "4:00PM - 4:55PM",
    "6:00PM - 6:55PM", "7:00PM - 7:55PM", "8:00PM - 8:55PM", "9:00PM - 9:55PM",
];

const parseTimeTo24Hour = (timeStr) => {
    const [time, period] = timeStr.split(/(AM|PM)/i).filter(Boolean);
    let [hours, minutes] = time.split(':').map(Number);
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;
    return { hours, minutes };
};

const ManageSlots = () => {
    const {
        selectedDate,
        setSelectedDate,
        generateDates,
        getBookedSlotss,
        selectedSlot,
        setSelectedSlot,
        getDisabledSlots,
        toggleSlotAvailability
    } = useContext(AdminContext);

    const [bookedSlots, setBookedSlots] = useState([]);
    const [disabledSlots, setDisabledSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const now = new Date();

    useEffect(() => {
        const fetchSlotData = async () => {
            if (!selectedDate) return;

            setIsLoading(true);
            try {
                const booked = await getBookedSlotss(selectedDate);
                const disabled = await getDisabledSlots(selectedDate);
                setBookedSlots(booked);
                setDisabledSlots(disabled);
            } catch (error) {
                toast.error("Failed to load slot data");
                console.error("Slot data error:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlotData();
    }, [selectedDate]);




    const isSlotOver = (slot) => {
        if (!dayjs(selectedDate).isSame(dayjs(), 'day')) return false;
        const slotTime = parseTimeTo24Hour(slot.split(' - ')[0]);
        const slotDate = new Date(selectedDate);
        slotDate.setHours(slotTime.hours, slotTime.minutes, 0, 0);
        return now > slotDate;
    };

    const handleToggleSlot = async (slot) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            await toggleSlotAvailability(selectedDate, slot);

            setDisabledSlots(prev =>
                prev.includes(slot)
                    ? prev.filter(s => s !== slot)
                    : [...prev, slot]
            );

            toast.success(`Slot ${disabledSlots.includes(slot) ? 'enabled' : 'disabled'} successfully`);
        } catch (error) {
            toast.error("Failed to update slot status");
            console.error("Toggle slot error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const getSlotStatus = (slot) => {
        if (bookedSlots.includes(slot)) return 'Booked';
        if (isSlotOver(slot)) return 'Time Over';
        if (disabledSlots.includes(slot)) return 'Disabled';
        return 'Available';
    };

    const getSlotStatusColor = (status) => {
        switch (status) {
            case 'Booked': return 'bg-red-100 text-red-800';
            case 'Time Over': return 'bg-gray-100 text-gray-800';
            case 'Disabled': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Time Slots</h2>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Date Selection */}
                <div className="mb-8 w-full md:w-2/4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-3">Select Date</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {generateDates().map((date, index) => (
                            <button
                                key={index}
                                className={`p-3 rounded-lg text-center transition-all ${dayjs(date).isSame(selectedDate, 'day')
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                onClick={() => setSelectedDate(date)}
                            >
                                <div className="text-xs font-medium uppercase">{dayjs(date).format('ddd')}</div>
                                <div className="text-lg font-bold">{dayjs(date).format('D')}</div>
                                <div className="text-xs">{dayjs(date).format('MMM')}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Slots - Right Side */}
                <div className="w-full md:w-2/4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold text-gray-700">Time Slots</h3>
                        {selectedDate && (
                            <span className="text-sm text-gray-500">
                                {dayjs(selectedDate).format('MMMM D, YYYY')}
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {timeSlots.map((slot, index) => {
                                const status = getSlotStatus(slot);
                                const isSelectable = !['Booked', 'Time Over'].includes(status);

                                return (
                                    <div
                                        key={index}
                                        className={`p-3 rounded-lg border transition-all cursor-pointer ${selectedSlot === slot
                                                ? 'border-blue-500 ring-2 ring-blue-200'
                                                : 'border-gray-200 hover:border-gray-300'
                                            } ${!isSelectable ? 'opacity-70 cursor-not-allowed' : ''
                                            }`}
                                        onClick={() => isSelectable && setSelectedSlot(slot)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="font-medium text-gray-800 text-sm">{slot}</div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getSlotStatusColor(status)}`}>
                                                {status}
                                            </span>
                                        </div>
                                        {selectedSlot === slot && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <button
                                                    className="w-full py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleSlot(slot);
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    {disabledSlots.includes(slot) ? 'Enable Slot' : 'Disable Slot'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageSlots;
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, UserCheck } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

interface Provider {
  _id: string;
  name: string;
  workingHours: {
    start: string;
    end: string;
  };
  slotDuration: number;
}

interface TimeSlot {
  _id: string;
  startTime: string;
  endTime: string;
  price: number;
  status?: string;
}

const fetchProviderById = async (providerId: string): Promise<Provider | null> => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}providers/get/id/${providerId}`
    );
    return response.data;
  } catch (error) {
    toast.error("Failed to fetch provider details");
    return null;
  }
};

const generateSlots = (provider: Provider, date: string): TimeSlot[] => {
  if (!provider.workingHours) return [];

  const { start, end } = provider.workingHours;
  const duration = provider.slotDuration || 60;

  const slots: TimeSlot[] = [];
  const startTime = new Date(`${date}T${start}:00`);
  const endTime = new Date(`${date}T${end}:00`);

  let slotStart = new Date(startTime);
  let i = 1;

  while (slotStart < endTime) {
    const slotEnd = new Date(slotStart.getTime() + duration * 60000);
    if (slotEnd > endTime) break;

    slots.push({
      _id: `slot-${i}`,
      startTime: slotStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: slotEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      price: 50,
    });

    slotStart = slotEnd;
    i++;
  }

  return slots;
};

const SlotSelectionPage: React.FC = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [loadingProvider, setLoadingProvider] = useState<boolean>(true);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  useEffect(() => {
    if (providerId) {
      setLoadingProvider(true);
      fetchProviderById(providerId)
        .then((data) => setSelectedProvider(data))
        .finally(() => setLoadingProvider(false));
    }
  }, [providerId]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        day: date.toLocaleDateString("en-US", { day: "numeric" }),
        month: date.toLocaleDateString("en-US", { month: "short" }),
      });
    }
    return dates;
  };

  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setLoadingSlots(true);
    setAvailableSlots([]);

    if (providerId && selectedProvider) {
      try {
        const allSlots = generateSlots(selectedProvider, date);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}slots/${providerId}/${date}`
        );
        const bookedSlots = response.data;

        const mergedSlots = allSlots.map((slot) => {
          const booked = bookedSlots.find(
            (b: any) =>
              b.startTime === slot.startTime &&
              b.endTime === slot.endTime &&
              b.status === "booked"
          );
          return booked ? { ...slot, status: "booked" } : slot;
        });

        setAvailableSlots(mergedSlots);
      } catch (error) {
        console.error("Failed to fetch slots", error);
      } finally {
        setLoadingSlots(false);
      }
    }
  };
const handleSlotSelect = async (slot: TimeSlot) => {
  if (!selectedProvider || !selectedDate) return;

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}slots/create`,
      {
        providerId: selectedProvider._id,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
      }
    );

    if (response.status === 201) {
      const createdSlot = response.data; 

      toast.success("Slot created successfully!");
      navigate("/user-info", {
        state: {
          provider: selectedProvider,
          date: selectedDate,
          slot: createdSlot,
        },
      });
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || "Error booking slot");
  }
};


  if (loadingProvider) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8 bg-white p-6 rounded-xl shadow-sm">
        <div className="text-center">
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline mb-4 inline-block"
          >
            ← Back to providers
          </button>
          <div className="flex justify-center items-center gap-3">
            <UserCheck className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl font-bold text-gray-800">Select Date & Time</h2>
          </div>
          <p className="text-gray-600 mt-2">
            Book a slot with{" "}
            <span className="font-semibold">
              {selectedProvider?.name || "your provider"}
            </span>
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Select Date</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {getAvailableDates().map((date) => (
              <button
                key={date.value}
                onClick={() => handleDateSelect(date.value)}
                className={`p-3 rounded-lg border text-center transition-all duration-200 ${
                  selectedDate === date.value
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className="text-xs font-medium">{date.label}</div>
                <div className="text-lg font-bold mt-1">{date.day}</div>
                <div className="text-xs font-medium">{date.month}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedDate && (
          <div className="space-y-4 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-800">Available Time Slots</h3>

            {loadingSlots ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 text-gray-600">Loading available slots...</p>
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No available slots for this date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {availableSlots.map((slot) => (
                  <button
                    key={slot._id}
                    onClick={() => slot.status !== "booked" && handleSlotSelect(slot)}
                    disabled={slot.status === "booked"}
                    className={`p-4 border rounded-lg text-center transition-all duration-200 ${
                      slot.status === "booked"
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "hover:border-blue-500 hover:bg-blue-50 hover:shadow-md focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2 font-semibold">
                      <Clock className="w-4 h-4" />
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <div className="text-sm mt-1 font-medium">
                      {slot.status === "booked" ? "Booked" : `$${slot.price}`}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotSelectionPage;

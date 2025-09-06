import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Provider {
  service: string;
  name: string;
}

interface Slot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

interface UserInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const ReviewBookingPage: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // values passed from UserInformationPage
  const { userId, providerId, slotId, notes } = state || {};

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  // Fetch booking preview details
  useEffect(() => {
    const fetchPreview = async () => {
      if (!userId || !providerId || !slotId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}bookings/preview`,
          {
            params: { userId, providerId, slotId },
          }
        );

        setSelectedProvider(res.data.selectedProvider);
        setSelectedSlot(res.data.selectedSlot);
        setUserInfo(res.data.userInfo);
      } catch (err) {
        console.error("Error fetching preview:", err);
        toast.error("Failed to fetch booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [userId, providerId, slotId]);

const handleConfirm = async () => {
  if (!userId || !providerId || !slotId) return;

  setConfirming(true);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}bookings/confirm`,
      { userId, providerId, slotId, notes }
    );

    const bookingId = res.data.booking._id;
    toast.success("Booking confirmed!");
    navigate(`/success/${bookingId}`);
  } catch (err: any) {
    console.error("Error confirming booking:", err);

    if (err.response?.status === 400 && err.response?.data?.message === "Slot already booked") {
      toast.error("Sorry, this slot has already been booked. Please select another one.");
      navigate("/"); 
    } else {
      toast.error(err.response?.data?.message || "Error confirming booking");
    }
  } finally {
    setConfirming(false);
  }
};


  if (loading)
    return <p className="text-center text-gray-600">Loading booking details...</p>;
  if (!selectedProvider || !selectedSlot || !userInfo)
    return <p className="text-center text-red-500">Booking details not found</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6 p-4">
      <div className="text-center">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:underline mb-2"
        >
          ← Back to details
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Review Your Booking
        </h2>
        <p className="text-gray-600">
          Make sure everything looks good before confirming
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-6 space-y-4 bg-white shadow">
        {/* Service & Provider */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            Service & Provider
          </h3>
          <p className="text-gray-700">
            {selectedProvider.service} with {selectedProvider.name}
          </p>
        </div>

        {/* Date & Time */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800">Date & Time</h3>
          <p className="text-gray-700">
            {selectedSlot.date} at {selectedSlot.startTime} – {selectedSlot.endTime}
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800">Contact Info</h3>
          <p className="text-gray-700">
            {userInfo.name} | {userInfo.email} | {userInfo.phone}
          </p>
          {userInfo.address && (
            <p className="text-gray-700">Address: {userInfo.address}</p>
          )}
        </div>

        {/* Notes */}
        {notes && (
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Notes</h3>
            <p className="text-gray-700">{notes}</p>
          </div>
        )}

        {/* Price */}
        <div>
          <h3 className="font-semibold text-lg text-gray-800">Price</h3>
          <p className="text-green-600 font-semibold">${selectedSlot.price}</p>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        disabled={confirming}
        className={`w-full py-3 font-semibold rounded-lg transition ${
          confirming
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700 text-white"
        }`}
      >
        {confirming ? "Confirming..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default ReviewBookingPage;

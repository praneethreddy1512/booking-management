import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

interface Provider {
  service: string;
  name: string;
}

interface Slot {
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

  // Destructure values passed from UserInformationPage
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
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [userId, providerId, slotId]);

  // Confirm booking
  const handleConfirm = async () => {
    if (!userId || !providerId || !slotId) return;

    setConfirming(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}bookings`,
        { userId, providerId, slotId, notes }
      );

      alert("Booking confirmed successfully!");
      console.log("Booking saved:", res.data);

      navigate("/"); // ✅ redirect to home (or success page)
    } catch (err) {
      console.error("Error confirming booking:", err);
      alert("Error confirming booking");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <p className="text-center">Loading booking details...</p>;
  if (!selectedProvider || !selectedSlot || !userInfo)
    return <p className="text-center text-red-500">Booking details not found</p>;

  return (
    <div className="max-w-xl mx-auto space-y-6">
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

      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
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
            {selectedSlot.date} at {selectedSlot.startTime} -{" "}
            {selectedSlot.endTime}
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
          <p className="text-green-600 font-semibold">
            ${selectedSlot.price}
          </p>
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

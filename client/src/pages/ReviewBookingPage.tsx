import React, { useEffect, useState } from "react";

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

const ReviewBookingPage: React.FC<{ userId: string; providerId: string; slotId: string }> = ({
  userId,
  providerId,
  slotId,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [notes, setNotes] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  // Fetch booking preview
  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}bookings/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, providerId, slotId }),
        });

        if (!res.ok) throw new Error("Failed to fetch booking details");
        const data = await res.json();

        setSelectedProvider(data.selectedProvider);
        setSelectedSlot(data.selectedSlot);
        setUserInfo(data.userInfo);
        setNotes(data.notes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [userId, providerId, slotId]);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, providerId, slotId, notes }),
      });

      if (!res.ok) throw new Error("Failed to confirm booking");
      const data = await res.json();
      alert("Booking confirmed successfully!");
      console.log("Booking saved:", data);
    } catch (err) {
      console.error(err);
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
          onClick={() => window.history.back()}
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
            {selectedSlot.date} at {selectedSlot.startTime} - {selectedSlot.endTime}
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

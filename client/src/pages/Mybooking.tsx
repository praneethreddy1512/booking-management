import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";

interface Booking {
  _id: string;
  status: string;
  notes?: string;
  providerId: { name: string; service: string };
  slotId: { date: string; startTime: string; endTime: string };
}

const Mybooking: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams] = useSearchParams();
  const bookingIdFromUrl = searchParams.get("bookingId");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}bookings/user/${userId}`
      );
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}bookings/cancel/${bookingId}`
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (error) {
      console.error("Error cancelling booking:", error);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">My Bookings</h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">No bookings yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div
              key={b._id}
              className={`border rounded-lg p-4 shadow-md bg-white flex justify-between items-center ${
                b._id === bookingIdFromUrl ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <div>
                <p className="font-semibold">{b.providerId?.name}</p>
                <p className="text-sm text-gray-600">{b.providerId?.service}</p>
                <p className="text-sm">
                  {b.slotId?.date} ({b.slotId?.startTime} - {b.slotId?.endTime})
                </p>
                <p
                  className={`text-sm font-semibold ${
                    b.status === "cancelled" ? "text-red-500" : "text-green-600"
                  }`}
                >
                  {b.status}
                </p>
              </div>
              {b.status !== "cancelled" && (
                <button
                  onClick={() => handleCancel(b._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mybooking;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { CheckCircle } from "lucide-react";

const BookingSuccessPage: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}bookings/${bookingId}`
        );
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) return <p className="text-center">Loading booking details...</p>;
  if (!booking) return <p className="text-center text-red-500">Booking not found</p>;

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
      <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
      <p className="text-gray-600">
        Your booking with <strong>{booking.providerId.name}</strong> is confirmed.
      </p>
      <div className="bg-gray-50 p-4 rounded-lg text-left">
        <p>
          <strong>Date:</strong> {booking.slotId.date}
        </p>
        <p>
          <strong>Time:</strong> {booking.slotId.startTime} - {booking.slotId.endTime}
        </p>
        <p>
          <strong>Price:</strong> ${booking.slotId.price}
        </p>
        <p>
          <strong>Booked By:</strong> {booking.userId.name} ({booking.userId.email})
        </p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Book Another Service
      </button>

      <Link to={`/mybooking/${booking.userId._id}?bookingId=${booking._id}`}>
        <button
          className="mt-6 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg ml-2 hover:bg-green-700 transition"
        >
          View My Bookings
        </button>
      </Link>
    </div>
  );
};

export default BookingSuccessPage;

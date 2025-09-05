import BookingModel from "../models/booking.model.js";

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await BookingModel.find({ userId, status: "confirmed" })
      .populate("slotId")
      .populate("providerId");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};


export const previewBooking = async (req, res) => {
  try {
    const { userId, providerId, slotId } = req.query; // now using query params

    const latestBooking = await BookingModel.findOne({ userId, providerId, slotId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email phone address")
      .populate("providerId", "name service")
      .populate("slotId", "date startTime endTime price");

    if (!latestBooking) {
      return res.status(404).json({ message: "Booking details not found" });
    }

    res.status(200).json({
      userInfo: latestBooking.userId,
      selectedProvider: latestBooking.providerId,
      selectedSlot: latestBooking.slotId,
      notes: latestBooking.notes || null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching preview", error });
  }
};

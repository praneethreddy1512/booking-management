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
    const { userId, providerId, slotId } = req.body;

    const user = await UserModel.findById(userId).select("name email phone address");
    const provider = await ProviderModel.findById(providerId).select("name service");
    const slot = await SlotModel.findById(slotId).select("date startTime endTime price");

    if (!user || !provider || !slot) {
      return res.status(404).json({ message: "Details not found" });
    }

    res.status(200).json({
      userInfo: user,
      selectedProvider: provider,
      selectedSlot: slot,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching preview", error });
  }
};
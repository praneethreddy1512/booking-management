import BookingModel from "../models/booking.model.js";
import UserModel from "../models/user.model.js";
import ProviderModel from "../models/provider.model.js";
import SlotModel from "../models/slot.model.js";

export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await BookingModel.find({ userId })
      .populate("slotId")
      .populate("providerId");

    if (!bookings || bookings.length === 0) {
      return res.status(200).json([]); 
    }

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings", error });
  }
};

export const previewBooking = async (req, res) => {
  try {
    const { userId, providerId, slotId } = req.query;

    const user = await UserModel.findById(userId).select("name email phone address");
    const provider = await ProviderModel.findById(providerId).select("name service");
const slot = await SlotModel.findById(slotId);

    if (!user || !provider || !slot) {
      return res.status(404).json({ message: "Preview data not found" });
    }

    res.status(200).json({
      userInfo: user,
      selectedProvider: provider,
      selectedSlot: slot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching preview", error });
  }
};




export const confirmBooking = async (req, res) => {
  try {
    const { userId, providerId, slotId, notes } = req.body;
    console.log("Incoming body:", req.body);

    if (!userId || !providerId || !slotId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const slot = await SlotModel.findById(slotId);
    console.log("Slot before booking:", slot);

    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    if (slot.status !== "booked") {
      return res.status(400).json({ message: "Slot already booked" });
    }

    slot.status = "booked";
    await slot.save();

    const booking = await BookingModel.create({
      userId,
      providerId,
      slotId,
      status: "confirmed",
      notes: notes || "",
    });

    const populatedBooking = await BookingModel.findById(booking._id)
      .populate("userId", "name email phone address")
      .populate("providerId", "name service")
      .populate("slotId");

    return res.status(201).json({
      message: "Booking confirmed successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Slot already booked" });
    }
    console.error("Confirm booking error:", error);
    return res.status(500).json({ message: "Error confirming booking", error });
  }
};




export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId)
      .populate("userId", "name email phone address")
      .populate("providerId", "name service")
      .populate("slotId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({ message: "Error fetching booking", error });
  }
};


export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await BookingModel.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // free up slot again
    await SlotModel.findByIdAndUpdate(booking.slotId, { status: "available" });

    // mark booking as cancelled
    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


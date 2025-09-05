import SlotModel from "../models/slot.model.js";


export const createSlot = async (req, res) => {
  try {
    const { providerId, date, startTime, endTime, price } = req.body;

    // prevent duplicate booking for same slot
    const existing = await SlotModel.findOne({
      providerId,
      date,
      startTime,
      endTime
    });

    if (existing && existing.status === "booked") {
      return res.status(400).json({ message: "Slot already booked" });
    }

    let slot;
    if (existing) {
      existing.status = "booked";
      slot = await existing.save();
    } else {
      slot = await SlotModel.create({
        providerId,
        date,
        startTime,
        endTime,
        price,
        status: "booked"
      });
    }

    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: "Error creating slot", error });
  }
}

export const getSlotsByProvider = async (req, res) => {
  try {
    const { providerId, date } = req.params;
    const slots = await SlotModel.find({ providerId, date });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error });
  }}
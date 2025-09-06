import Router from "express";
import { getUserBookings,previewBooking,confirmBooking,getBookingById,cancelBooking } from "../controller/booking.controller.js";

const bookingrouter = Router();

bookingrouter.get("/user/:userId", getUserBookings);
bookingrouter.get("/preview", previewBooking);
bookingrouter.post("/confirm", confirmBooking);
bookingrouter.get("/confirmation/:bookingId", getBookingById);
bookingrouter.post("/cancel/:bookingId", cancelBooking);
export default bookingrouter;



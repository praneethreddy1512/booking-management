import Router from "express";
import { getUserBookings,previewBooking,confirmBooking,getBookingById } from "../controller/booking.controller.js";

const bookingrouter = Router();

bookingrouter.get("/user/:userId", getUserBookings);
bookingrouter.get("/preview", previewBooking);
bookingrouter.post("/confirm", confirmBooking);
bookingrouter.get("/confirmation/:bookingId", getBookingById);

export default bookingrouter;



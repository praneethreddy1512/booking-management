import Router from "express";
import { getUserBookings,previewBooking } from "../controller/booking.controller.js";

const bookingrouter = Router();

bookingrouter.get("/user/:userId", getUserBookings);
bookingrouter.post("/preview", previewBooking);


export default bookingrouter;



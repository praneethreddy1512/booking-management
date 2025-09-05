import Router from "express";
import { getUserBookings,previewBooking } from "../controller/booking.controller.js";

const bookingrouter = Router();

bookingrouter.get("/user/:userId", getUserBookings);
bookingrouter.get("/preview", previewBooking);


export default bookingrouter;



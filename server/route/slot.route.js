import { createSlot,getSlotsByProvider } from "../controller/slot.controller.js";
import { Router } from "express";

const slotRouter = Router();

slotRouter.post("/create", createSlot);
slotRouter.get("/:providerId/:date", getSlotsByProvider);

export default slotRouter;

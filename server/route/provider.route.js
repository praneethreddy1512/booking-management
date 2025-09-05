import { createProvider,getProviderById, getProvidersByCategory} from "../controller/provider.controller.js";
import { Router } from "express";

const providerRouter = Router();

providerRouter.post("/create", createProvider);
providerRouter.get("/get/id/:id", getProviderById);
providerRouter.get("/get/category/:category", getProvidersByCategory);


export default providerRouter;

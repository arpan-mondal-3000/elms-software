import express from "express";
import { getOrganizationData } from "../controllers/organizationController.js";

const orgRouter = express.Router();

orgRouter.get("/org-data", getOrganizationData);

export default orgRouter;
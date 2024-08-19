import { Router } from "express";
import { refreshAccessToken } from "../controllers/common.controller";

export const commonRouter = Router();

commonRouter.route("/refresh-token").post(refreshAccessToken);

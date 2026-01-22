import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapi } from "../docs/openapi.js";

const router = express.Router();

router.use("/", swaggerUi.serve, swaggerUi.setup(openapi));

export default router;

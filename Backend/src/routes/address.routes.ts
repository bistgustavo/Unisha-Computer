// routes/user.routes.ts
import { Router } from "express";
import { setAddress , getUserAddress } from "../controllers/address.controller";
import { verifyJWT } from "../middlewares/auth";

const router = Router();

router.post("/setaddress", verifyJWT, setAddress);

router.get("/getaddress", verifyJWT, getUserAddress);

export default router;

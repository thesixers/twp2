import express from "express";
import {
  emailverify_get,
  forgotpassword_post,
  google_auth,
  login_post,
  logout,
  otp_post,
  resetpassword_post,
  signup_post,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/emailverify/:id", emailverify_get);

router.get("/logout", logout);

router.post("/signup", signup_post);

router.post("/google-auth", google_auth);

router.post("/login", login_post);

router.post("/sendotp", forgotpassword_post);

router.post("/otp", otp_post);

router.put("/resetpassword", resetpassword_post);
export default router;

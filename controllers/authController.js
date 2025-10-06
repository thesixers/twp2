import User from "../model/users.js";
import bcrypt from "bcrypt";
import {
  calculateAge,
  createJwt,
  errHandler,
  generateOTP,
} from "../middlewares/tokencheckers.js";
import { otpMail, sendEmails } from "../middlewares/mailSender.js";
import OTP from "../model/otp.js";
import { OAuth2Client } from "google-auth-library";

const clientID =
  "222580688721-1rdmd4tadv6reuad2s2nsad5krm635kq.apps.googleusercontent.com";
const client = new OAuth2Client(clientID);

export const emailverify_get = async (req, res) => {
  let id = req.params.id;

  try {
    let user = await User.findById(id);
    await user.updateOne({ verifyStatus: true });
    res.render("verifypage", {
      M: "Your account has been verified",
      title: "verification page",
    });
  } catch (err) {
    console.log(err);
  }
};

export const logout = (req, res) => {
  res.cookie("twpAccount", "", { httpOnly: true, maxAge: 1 });
  res.json({ M: "Logged out" });
};

export const signup_post = async (req, res) => {
  let { password, name, email, dob } = req.body;
  let [age, month] = calculateAge(dob);
  console.log({ password, name, email, age });

  if (age < 14) {
    return res.status(400).json({ E: "Users have to be 14yrs and above" });
  }

  try {
    const user = await User.create({
      password: password.trim(),
      name: name.trim(),
      email: email.trim(),
      dob,
    });
    sendEmails(user);
    res.status(200).json({
      M: "Your account has been created. You have 24hrs to verify your email; please check your email for the link.",
    });
  } catch (err) {
    let errs = errHandler(err);
    let { name, email, password } = errs;
    let message = name ? name : email ? email : password;
    res.status(400).json({ E: message }); // Assuming errHandler processes validation errors
  }
};

export const google_auth = async (req, res) => {
  let gToken = req.headers["authorization"].split(" ")[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: gToken,
      audience: clientID,
    });
    const payload = ticket.getPayload();

    let { email, given_name, family_name, picture, jti } = payload;

    // check if email exists in db
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ 
        password: email,
        name: `${given_name} ${family_name}`,
        email: email,
        picture,
        signupOpt: "google", 
      });
    }

    const id = user.id;
    const token = createJwt(id);
    const time = 1 * 24 * 60 * 60 * 1000;
    res.cookie("twpAccount", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: time,
    });

    return res.status(200).json({ M: "Login Successful !!!", user: {...user._doc, password: "pwd"} });
  } catch (error) {
    return res
      .status(500)
      .json({ E: "An unexpected error occurred during login." });
  }
};

export const login_post = async (req, res) => {
  let { email, password } = req.body;

  try {
    let user = await User.login({ email, password });

    const token = createJwt(user.id);
    const time = 1 * 24 * 60 * 60 * 1000;
    res.cookie("twpAccount", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: time,
    });

    res.status(200).json({ M: "Login Successful !!!", user: {...user._doc, password: "pwd"} });
  } catch (err) {
    let errors = errHandler(err);
    if (errors.email) {
      return res.status(401).json({ E: errors.email });
    }
    if (errors.password) {
      return res.status(401).json({ E: errors.password });
    }
    return res
      .status(500)
      .json({ E: "An unexpected error occurred during login." });
  }
};

export const forgotpassword_post = async (req, res) => {
  let { email } = req.body;

  email = email.trim();
  if (email === "")
    return res
      .status(400)
      .json({ E: "Please enter an email to help us find your Account" });

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ E: "Twp account not found" });
    let otp = generateOTP();
    let otptime = new Date(Date.now() + 10 * 60 * 1000);
    let createOtp = await OTP.create({ email, otpcode: otp, otptime });
    otpMail(user, otp);
    res.status(200).json({ M: "Otp has been sent to your email" });
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .json({ E: "Oops! An error occurred. Please try resending." });
  }
};

export const otp_post = async (req, res) => {
  let { otp, email } = req.body;
  let currentTime = new Date(Date.now());

  try {
    let otp$ = await OTP.findOne({ email, otpcode: otp });
    if (!otp$) {
      // Check if the OTP record itself was found
      // It's better to throw an error that will be caught and handled with a status code
      return res
        .status(400)
        .json({ E: "Incorrect OTP. Please check the OTP that was entered." });
    }

    if (otp$.otptime < currentTime) {
      await OTP.deleteOne({ email });
      return res
        .status(400)
        .json({
          E: "OTP has expired. Please request another one using the resend button.",
        });
    }

    res.status(200).json({ M: "Otp Confirmed" });
  } catch (err) {
    // This catch block will now primarily handle unexpected server errors
    // as specific client errors (incorrect/expired OTP) are handled above.
    console.error("Error in otp_post:", err.message);
    res
      .status(500)
      .json({ E: "An unexpected error occurred while verifying OTP." });
  }
};

export const resetpassword_post = async (req, res) => {
  let { password, email } = req.body;
  if (!password || !email) {
    return res.status(400).json({ E: "Email and password are required." });
  }
  try {
    let otp = await OTP.findOne({ email: email });
    if (!otp) {
      return res
        .status(400)
        .json({ E: "Invalid or expired OTP. Please request another." });
    }
    let salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    await User.findOneAndUpdate({ email }, { password });

    await OTP.deleteOne({ email });

    res.status(200).json({ M: "Password changed successfully." });
  } catch (err) {
    console.error("Error in resetpassword_post:", err.message);
    res
      .status(500)
      .json({ E: "An error occurred while resetting the password." });
  }
};

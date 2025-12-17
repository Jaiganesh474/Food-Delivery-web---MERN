import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodemailer.createTransport({
  service: "gmail",
  // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS, //lnvv xbki noyr bqbl
  },
});

export const sendOtpMail=async(to,otp)=>{
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:to,
        subject:"Reset Your Password",
        html:`<p>Your OTP for password reset is <b>${otp}</b>. It expires in 5 minutes.</p>`
    })
}

export const sendDeliveryOtpMail=async(user,otp)=>{
    await transporter.sendMail({
        from:process.env.EMAIL,
        to:user.email,
        subject:"OTP for Delivery From EatSure",
        html:`<p>Your OTP for your delivery is <b>${otp}</b>. Kindly Share the OTP to the delivery
        partner and receive your delivery. Thank you for ordering with us.</p>`
    })
}

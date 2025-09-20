import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getUserByEmail, getUserByUsername, createUser, generateOtpForUser, updateUserPass } from '../models/userModel.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (email.trim() === '' || password === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }

    try {
        const existingUserEmail = await getUserByEmail(email);
        const existingUserName = await getUserByUsername(username);
        if (existingUserEmail || existingUserName) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = await createUser(username, email, hashedPassword);
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: "User Register Successfull", token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    if (username.trim() === '' || password === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'No account is found with this username' });
        }
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ userId: user.ID }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: "Login Successfull",token });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const generateOtp = async (req, res) => {
    const { username } = req.body;

    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if (username.trim() === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'No account is found with this username' });
        }

        let otp = '';
        for(let i =0;i<6;i++){
            otp += Math.floor(Math.random() * 10);
        }
        const isGenerated = generateOtpForUser(user.ID, otp);
        if (!isGenerated) {
            return res.status(500).json({ message: 'Could not generate OTP' });
        }

        res.json({ message: "OTP generated and sent to your email" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkOtp = async (req, res) => {
    const { username, otp } = req.body;
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if (username.trim() === '' || otp.trim() === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'No account is found with this username' });
        }
        if (!user.Otp_Expiry || new Date() > new Date(user.Otp_Expiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        if (user.Otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        res.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};

export const checkOtpAndResetPass = async (req, res) => {
    const { username, otp, password } = req.body;
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(username.trim())) {
        return res.status(400).json({ message: 'Invalid username format' });
    }
    if (username.trim() === '' || otp.trim() === '') {
        return res.status(400).json({ message: 'Fields cannot be empty' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ message: 'No account is found with this username' });
        }
        if (!user.Otp_Expiry || new Date() > new Date(user.Otp_Expiry)) {
            return res.status(400).json({ message: 'OTP has expired' });
        }
        if (user.Otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedRows = updateUserPass(hashedPassword, user.ID)
        if(updatedRows === 0) return res.json({ message: "Something Went Wrong" });
        res.json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};





// FOR TESTING PURPOSE ONLY
export const getOtp = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await getUserByUsername(username);
        res.json({ otp: user.Otp });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
}
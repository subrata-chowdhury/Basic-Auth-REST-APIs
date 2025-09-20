import pool from '../config/db.js';

export const getUserByEmail = async (email) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM User_Details WHERE Email = ?', [email]);
        return rows?.[0] ?? null;
    } finally {
        connection.release();
    }
};

export const getUserByUsername = async (username) => {
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM User_Details WHERE Username = ?', [username]);
        return rows?.[0] ?? null;
    } finally {
        connection.release();
    }
}

export const createUser = async (username, email, hashedPassword) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            'INSERT INTO User_Details (Username, Email, Password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );
        return result?.insertId ?? null;
    } finally {
        connection.release();
    }
};

export const updateUserPass = async (password, userId) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            'UPDATE User_Details SET Password = ? WHERE ID = ?',
            [password, userId]
        );
        await connection.query(
            'UPDATE User_Details SET Otp = NULL, Otp_Expiry = NULL WHERE ID = ?',
            [userId]
        );
        return result?.affectedRows ?? 0;
    } finally {
        connection.release();
    }
};

export const generateOtpForUser = async (userId, otp) => {
    const connection = await pool.getConnection();
    try {
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        await connection.query(
            'UPDATE User_Details SET Otp = ?, Otp_Expiry = ? WHERE ID = ?',
            [otp, otpExpiry, userId]
        );
        return true;
    } finally {
        connection.release();
    }
};

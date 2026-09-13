import User from '../models/User.js';
import OTP from '../models/OTP.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'doctor'
        });

        if (user) {
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid user data'
            });
        }
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
        });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create access token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' } // Changed to 7 days
            );

            // Create refresh token
            const refreshToken = jwt.sign(
                { id: user._id },
                process.env.JWT_REFRESH_SECRET || 'refreshSecret123',
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                message: 'User logged in successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token,
                    refreshToken
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get new access token using refresh token
// @route   POST /api/auth/refresh
// @access  Public
export const refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token is required' });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refreshSecret123', async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
            }

            // Find user just to be sure they still exist and get their role
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ success: false, message: 'User no longer exists' });
            }

            // Generate a new access token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            // Optionally generate a new refresh token to rotate it
            const newRefreshToken = jwt.sign(
                { id: user._id },
                process.env.JWT_REFRESH_SECRET,
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: {
                    token,
                    refreshToken: newRefreshToken
                }
            });
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during token refresh'
        });
    }
};

// @desc    Update user profile (Doctor/Admin/Staff)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            if (req.body.email) {
                const emailExists = await User.findOne({ email: req.body.email });
                if (emailExists && emailExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ success: false, message: 'Email is already in use' });
                }
                user.email = req.body.email;
            }
            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role,
                }
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during profile update',
            error: error.message
        });
    }
};

// @desc    Send Forgot Password OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Generate 6-digit OTP
        let otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.create({ email, otp });

        res.status(200).json({
            success: true,
            message: 'Password reset OTP sent successfully'
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ success: false, message: 'Server error during forgot password' });
    }
};

// @desc    Verify OTP for Password Reset
// @route   POST /api/auth/verify-reset-otp
// @access  Public
export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        // Find recent OTP
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        
        if (recentOtp.length === 0) {
            return res.status(400).json({ success: false, message: 'OTP expired or not found' });
        } else if (recentOtp[0].otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        // Generate a temporary reset token valid for 15 minutes
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: { resetToken }
        });
    } catch (error) {
        console.error('Verify reset OTP error:', error);
        res.status(500).json({ success: false, message: 'Server error during OTP verification' });
    }
};

// @desc    Reset Password using Reset Token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, resetToken, newPassword } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({ success: false, message: 'Email, reset token, and new password are required' });
        }

        // Verify the reset token
        try {
            const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
            if (decoded.email !== email) {
                return res.status(400).json({ success: false, message: 'Invalid token for this email' });
            }
        } catch (err) {
            return res.status(400).json({ success: false, message: 'Reset token expired or invalid' });
        }

        // Update user password
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error during reset password' });
    }
};

const express = require('express');
const User = require('../Schema/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { isAuth } = require('./auth');

// --------------------------------------------------------------------------------------------------------------------------------------------------------

const routes = express.Router();

// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //Email verify
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            res.send({ message: "Wrong User" })
        }
        //Password verify
        const verifyPassword = await bcrypt.compare(password, existingUser.hashPassword);
        if (verifyPassword) {
            const token = await jwt.sign({ email: existingUser.email }, process.env.SCERET_KEY)
            res.cookie('accessToken', token, { expire: new Date() + 86400000 });
            return res.status(200).send({ message: 'User signed-in successfully.', token, redirectUrl: '/textArea' });
        }
        else {
            res.send({ message: "Wrong Password" })
        }
    } catch (error) {
        res.status(500).send({ message: 'Internal Error', error: error })
    }
})


// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.post('/Signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ message: "User Already Exists" })
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name: name, email: email, hashPassword: hashPassword })
        await newUser.save().then((data) => {
            res.status(200).send({
                message: "New user was added Sucessfully................",
                data: data
            })
        }).catch((err) => {
            res.status(400).send({ message: 'There is a error while adding a New User' })
        })
    } catch (error) {
        res.status(500).send({ message: "Internal Error", error: error })
    }

})


// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send password reset email
        const transporter = nodemailer.createTransport({
            // Configure your email provider settings
            service: 'gmail',
            auth: {
                user: process.env.user,
                pass: process.env.pass
            }
        });

        const mailOptions = {
            from: process.env.user,
            to: user.email,
            subject: 'Password Reset',
            text: `Click the following link to reset your password:${process.env.API_URL}/Reset-password/${resetToken}`,
        };

        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return false;
            } else {
                console.log('Email sent:', info.response);
                return true
            }
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.post('/Reset-password/:resetToken', async (req, res) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() }

        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.hashPassword = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.get('/logout', isAuth, async (req, res) => {
    try {
        await res.clearCookie('accessToken');
        res.status(200).send({ message: 'User signed-out!', redirectUrl: "/" });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

// --------------------------------------------------------------------------------------------------------------------------------------------------------


routes.delete('/deleteUser/:userId', async (req, res) => {
    const { userId } = req.params;
    await User.findByIdAndDelete({ _id: userId }).then(user => {
        if (user) {
            return res.status(200).send({ message: 'User was deleted successfully.' });
        }
        return res.status(400).send({ message: 'No user was found' });
    }).catch(error => {
        res.status(200).send({ message: 'User was not deleted due to error.', error: error });
    })
})

// --------------------------------------------------------------------------------------------------------------------------------------------------------

routes.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        await User.findById({ _id: userId }).then(user => {
            if (user) {
                return res.status(200).send({ message: 'User was retrived successfully.', data: user });
            }
            return res.send(400).send({ message: "No user Found" })
        }).catch(error => {
            res.status(400).send({ message: 'Error while retrieving user.' })
        });
    } catch (error) {
        res.status(200).send({ message: 'Internal Server Error', error: error });
    }

})


module.exports = routes;
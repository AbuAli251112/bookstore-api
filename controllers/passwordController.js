const asyncHandler = require("express-async-handler");
const { User, validateChangePassword } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

/**
 *  @desc    Get Forgot Password View
 *  @route   /password/forgot-password
 *  @method  GET
 *  @access  public
 */
module.exports.getForgotPasswordView = asyncHandler ((req,res) => {
    res.render('forgot-password');
});

/**
 *  @desc    Send Forgot Password View
 *  @route   /password/forgot-password
 *  @method  POST
 *  @access  public
 */
module.exports.sendForgotPasswordLink = asyncHandler (async (req,res) => {
	let user = await User.findOne({ email: req.body.email });
	if (!user) {
		res.status(404).json({ message: "User Not Found" });
	}
	const secret = process.env.JWT_SECRET_KEY + user.password;
	const token = jwt.sign({ email: user.email, id: user.id }, secret, {
		expiresIn: '10m'
	});
	const link = `http://localhost:8000/password/reset-password/${user._id}/${token}`;
	// let testAccount = await nodemailer.createTestAccount();
	// let transporter = nodemailer.createTransport({
	//     host: "smtp.ethereal.email",
	//     port: 587,
	//     secure: false,
	//     auth: {
	//       user: testAccount.user,
	//       pass: testAccount.pass,
	//     },
	// });
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.USER_EMAIL,
			pass: process.env.USER_PASS
		}
	});
	// let info = await transporter.sendMail({
	//     from: testAccount.user,
	//     to: user.email,
	//     subject: "Reset Password",
	//     // text: "Hello world?",
	//     html: `<div>
	// 		<h4>Click On The Link Below To Reset Your Password</h4>
	// 		<p>${link}</p>
	// 	</div>`
	// });
	const mailOptions = {
		from: process.env.USER_EMAIL,
		to: user.email,
		subject: "Reset Password",
		html: `<div>
			<h4>Click On The Link Below To Reset Your Password</h4>
			<p>${link}</p>
		</div>`
	};
	// console.log("Message sent: %s", info.messageId);
	// console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
	transporter.sendMail(mailOptions, function(error, success) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email Sent: " + success.response);
			res.render("link-send");
		}
	});
});

/**
 *  @desc    Get Reset Password View
 *  @route   /password/reset-password/:userId/:token
 *  @method  GET
 *  @access  public
 */
module.exports.getResetPasswordView = asyncHandler (async (req,res) => {
	let user = await User.findById(req.params.userId);
	if (!user) {
		res.status(404).json({ message: "User Not Found" });
	}
	const secret = process.env.JWT_SECRET_KEY + user.password;
	try {
		jwt.verify(req.params.token, secret);
		res.render('reset-password', {email: user.email});
	} catch(e) {
		console.log(e);
		res.json({ message: "Error" });
	}
});

/**
 *  @desc    Reset The Password
 *  @route   /password/reset-password/:userId/:token
 *  @method  POST
 *  @access  public
 */
module.exports.resetThePassword = asyncHandler (async (req,res) => {
	const { error } = validateChangePassword(req.body);
	if (error) {
		return res.status(400).json({ message: error.details[0].message });
	}
	let user = await User.findById(req.params.userId);
	if (!user) {
		res.status(404).json({ message: "User Not Found" });
	}
	const secret = process.env.JWT_SECRET_KEY + user.password;
	try {
		jwt.verify(req.params.token, secret);
		const salt = await bcrypt.genSalt(10);
		req.body.password = await bcrypt.hash(req.body.password, salt);
		user.password = req.body.password;
		await user.save();
		res.render('success-password');
	} catch(e) {
		console.log(e);
		res.json({ message: "Error" });
	}
});


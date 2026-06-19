const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { enrollmentTemplate } = require("../utils/emailTemplates");

exports.capturePayment = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        if (!courseId) {
            return res.status(400).json({ error: 'Course ID is required' });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (course.StudentsEnrolled.includes(userId)) {
            return res.status(400).json({ error: 'You are already enrolled in this course' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: course.courseName,
                        description: course.courseDescription,
                        images: course.thumbnail ? [course.thumbnail] : [],
                    },
                    unit_amount: course.price * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            // {CHECKOUT_SESSION_ID} is a Stripe template variable — replaced automatically
            success_url: `${process.env.CLIENT_URL}/courses/${courseId}?payment=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url:  `${process.env.CLIENT_URL}/courses/${courseId}?payment=cancelled`,
            metadata: {
                courseId: courseId.toString(),
                userId:   userId.toString(),
            },
        });

        return res.status(200).json({
            message: 'Payment session created successfully',
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create payment session' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { courseId, userId } = session.metadata;

            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            if (!course.StudentsEnrolled.includes(userId)) {
                course.StudentsEnrolled.push(userId);
                await course.save();

                const user = await User.findById(userId);
                user.courses.push(courseId);
                await user.save();

                // Send enrollment confirmation email
                mailSender(
                    user.email,
                    `You're enrolled in ${course.courseName}!`,
                    enrollmentTemplate(user.firstname, course.courseName, courseId)
                ).catch((err) => console.error("Enrollment email failed:", err.message));
            }

            return res.status(200).json({
                message: 'Payment verified and enrollment successful',
                enrolled: true
            });
        } else {
            return res.status(400).json({
                message: 'Payment not completed',
                enrolled: false
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to verify payment' });
    }
};

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await stripe.charges.list({
            limit: 100,
        });

        return res.status(200).json({
            message: 'All payments retrieved successfully',
            payments: payments.data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve payments' });
    }
};

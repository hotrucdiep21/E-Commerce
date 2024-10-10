import stripeCreate from "../lib/stripe.js";
import Coupon from "../model/coupon.model.js";
import dotenv from "dotenv";

dotenv.config();

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ message: 'No products in cart' });
        }

        let totalAmount = 0;

        const lineitems = products.map((product) => {
            const amount = Math.round(product.price * 100); //stripe requires amount in cents
            totalAmount += amount * product.quantity;

            return {
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: product.name,
                        images: product.image
                    },
                    unit_amount: amount,
                }
            }
        })

        let coupon = null;

        if (couponCode) {
            coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
            if (!coupon) {
                totalAmount -= Math.round(coupon.discountPercentage * totalAmount / 100);
            }
        }

        const session = await stripeCreate.checkout.sessions.create({
            payment_method_types: ['card', 'paypal'],
            line_items: lineitems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cart`,
            discounts: coupon ? [{
                coupon: await createStripeCoupon(coupon.discountPercentage)
            }]
                : [],
            metadata: {
                userId: req.user._id.toString(),
                couponCode: couponCode || "",
                products: JSON.stringify(
                    products.map((product) => ({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        quantity: product.quantity
                    }))
                )
            }
        });

        // > 200$
        if (totalAmount > 20000) {
            await createNewCoupon(req.user._id);
        }

        res.json({
            url: session.url,
            totalAmount: totalAmount / 100
        });
    } catch (error) {

    }
}
//====checkout success======
export const checkoutSuccess = async (req, res) => {
    // 1. Delete coupon from db
    try {
        const { sessionId } = req.body;
        const session = await stripeCreate.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate({
                    code: session.metadata.couponCode,
                    userId: session.metadata.userId
                },
                    {
                        isActive: false
                    })
            }
            //2. Save order to db
            //create a new order
            const products = JSON.parse(session.metadata.products);
            const newOrder = new Order({
                user: session.metadata.userId,
                products: products.map((product) => ({
                    product: product.id,
                    quantity: product.quantity,
                    price: product.price
                })),
                totalAmount: session.amount_total / 100, //convert from cent tp dollar
                stripeSessionId: sessionId

            })

            await newOrder.save();
            return res.status.json({
                success: true,
                message: "Order created successfully",
                order: newOrder
            })
        }
    } catch (error) {
        console.log("Error processing  successful checkout  ", error.message);
        res.status(500).json({ message: "Error processing  successful checkout", error: error.message });
    }
}

async function createStripeCoupon(discountPercentage) {
    const coupon = await stripeCreate.coupons.create({
        percent_off: discountPercentage,
        duration: 'once',

    })
    return coupon.id;
}

async function createNewCoupon(userId) {
    const newCoupon = new Coupon({

        discountPercentage: 10,
        expirationDate: Date.now() + 7 * 24 * 60 * 60 * 1000, //7 days
        userId: userId,
        isActive: true
    })

    await newCoupon.save();

    return newCoupon;
}




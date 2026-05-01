import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let discountPercent = 0;
		if (couponCode) {
			const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
			if (coupon) {
				discountPercent = coupon.discountPercentage;
			}
		}

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			const finalAmount = discountPercent > 0 
				? Math.round(amount * (1 - discountPercent / 100)) 
				: amount;

			return {
				price_data: {
					currency: "usd",
					product_data: { 
						name: product.name, 
						images: [product.image] 
					},
					unit_amount: finalAmount,
				},
				quantity: product.quantity || 1,
			};
		});

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			customer_email: req.user.email,
			phone_number_collection: { enabled: true },
			shipping_address_collection: {
				allowed_countries: ["UA", "US", "PL", "GB", "CA"], 
			},
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(products.map(p => ({ id: p._id, q: p.quantity, p: p.price })))
			},
		});

		res.status(200).json({ id: session.id, url: session.url });
	} catch (error) {
		console.error("Error creating checkout session:", error);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) return res.status(400).json({ message: "Session ID is required" });

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        if (session.payment_status === "paid") {
            const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
            if (existingOrder) return res.status(200).json({ success: true, orderId: existingOrder._id });

            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode },
                    { $inc: { uses: 1 } }
                );
            }

            const productsData = JSON.parse(session.metadata.products);

            const shipping = session.shipping_details;
            const customer = session.customer_details;

            let stripeName = shipping?.name || customer?.name || "Client";
            let addressStr = "The address is not specified";

            const addr = shipping?.address || customer?.address;

            if (addr) {
                addressStr = [
                    addr.line1, 
                    addr.line2, 
                    addr.city, 
                    addr.state, 
                    addr.postal_code, 
                    addr.country
                ]
                .filter(Boolean)
                .join(", ");
            }

            const newOrder = new Order({
                user: session.metadata.userId,
                products: productsData.map((p) => ({
                    product: p.id,
                    quantity: p.q,
                    price: p.p,
                })),
                totalAmount: session.amount_total / 100,
                stripeSessionId: sessionId,
                status: "Paid",
                phone: session.customer_details.phone || session.metadata.phone,
                shippingAddress: `${stripeName} | ${addressStr}`
            });

            await newOrder.save();
            res.status(200).json({ success: true, orderId: newOrder._id });
        }
    } catch (error) {
        console.error("CRITICAL ERROR IN CHECKOUT SUCCESS:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
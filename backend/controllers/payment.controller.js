import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const { products, couponCode } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Invalid or empty products array" });
        }

        const baseTotalAmount = products.reduce((sum, product) => {
            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 1;
            return sum + (price * quantity);
        }, 0);

        let discountPercent = 0;
        let appliedCouponCode = "";

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
            
            if (coupon) {
                const isExpired = new Date() > new Date(coupon.expirationDate);
                
                const minAmountRequired = Number(coupon.minimumPurchaseAmount) || 0;

                if (!isExpired && baseTotalAmount >= minAmountRequired) {
                    discountPercent = Number(coupon.discountPercentage) || 0;
                    appliedCouponCode = couponCode;
                } else if (isExpired) {
                    console.log(`Coupon ${couponCode} has expired`);
                } else {
                    console.log(`The sum of ${baseTotalAmount.toFixed(2)} is less than the minimum of (${minAmountRequired})`);
                }
            }
        }

        let totalOrderAmount = 0;

        const lineItems = products.map((product) => {
            const originalPriceInCents = Math.round(Number(product.price) * 100);
            
            const finalPriceInCents = discountPercent > 0 
                ? Math.round(originalPriceInCents * (1 - discountPercent / 100)) 
                : originalPriceInCents;

            totalOrderAmount += (finalPriceInCents / 100) * (Number(product.quantity) || 1);

            return {
                price_data: {
                    currency: "usd",
                    product_data: { 
                        name: product.name, 
                        images: product.image ? [product.image] : [] 
                    },
                    unit_amount: finalPriceInCents,
                },
                quantity: Number(product.quantity) || 1,
            };
        });

        const newOrder = new Order({
            user: req.user._id,
            products: products.map((p) => ({
                product: p._id || p.id,
                quantity: Number(p.quantity) || 1,
                price: Number(p.price),
            })),
            totalAmount: Number(totalOrderAmount.toFixed(2)),
            stripeSessionId: "temp_" + Date.now(), 
            phone: "Pending", 
            status: "Pending", 
        });

        await newOrder.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            customer_email: req.user.email,
            phone_number_collection: { enabled: true },
            shipping_address_collection: {
                allowed_countries: ["US", "UA", "GB", "PL", "CA"], 
            },
            success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
            metadata: {
                userId: req.user._id.toString(),
                orderId: newOrder._id.toString(), 
                couponCode: appliedCouponCode, 
            },
        });

        newOrder.stripeSessionId = session.id;
        await newOrder.save();

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
            const orderId = session.metadata.orderId;
            const order = await Order.findById(orderId);

            if (!order) {
                return res.status(404).json({ message: "Order not found" });
            }

            if (order.status === "Paid") {
                return res.status(200).json({ success: true, orderId: order._id });
            }

            const shipping = session.shipping_details;
            const customer = session.customer_details;
            const addr = shipping?.address || customer?.address;

            let addressStr = "Address not specified";
            if (addr) {
                addressStr = [
                    addr.line1,
                    addr.line2,
                    addr.city,
                    addr.state,
                    addr.postal_code,
                    addr.country
                ].filter(Boolean).join(", ");
            }

            const stripeName = shipping?.name || customer?.name || "Client";

            order.shippingAddress = `${stripeName} | ${addressStr}`;
            order.phone = customer?.phone || shipping?.phone || "No phone";
            order.status = "Paid";
            order.stripeSessionId = sessionId;

            await order.save();

            if (session.metadata.couponCode) {
                await Coupon.findOneAndUpdate(
                    { code: session.metadata.couponCode },
                    { $inc: { uses: 1 } }
                );
            }

            res.status(200).json({ success: true, orderId: order._id });
        } else {
            res.status(400).json({ message: "Payment not confirmed" });
        }
    } catch (error) {
        console.error("CRITICAL ERROR IN CHECKOUT SUCCESS:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
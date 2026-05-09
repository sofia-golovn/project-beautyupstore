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
            if (coupon) discountPercent = coupon.discountPercentage;
        }

        let totalOrderAmount = 0;

        const lineItems = products.map((product) => {
            const amount = Math.round(product.price * 100);
            const finalAmount = discountPercent > 0 
                ? Math.round(amount * (1 - discountPercent / 100)) 
                : amount;

            totalOrderAmount += (finalAmount / 100) * (product.quantity || 1);

            return {
                price_data: {
                    currency: "usd",
                    product_data: { 
                        name: product.name, 
                        images: product.image ? [product.image] : [] 
                    },
                    unit_amount: finalAmount,
                },
                quantity: product.quantity || 1,
            };
        });

        // 1. Створюємо замовлення як "Pending" (Чернетка)
        // Воно збережеться в базі, але завдяки фільтрації в getAllOrders 
        // адмін його не побачить, поки статус не зміниться на "Paid"
        const newOrder = new Order({
            user: req.user._id,
            products: products.map((p) => ({
                product: p._id || p.id,
                quantity: p.quantity,
                price: p.price,
            })),
            totalAmount: totalOrderAmount,
            stripeSessionId: "temp_" + Date.now(), 
            phone: "Pending", 
            status: "Pending", // ВАЖЛИВО: статус Pending
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
                orderId: newOrder._id.toString(), // Передаємо тільки ID, щоб не було помилок ліміту символів
                couponCode: couponCode || "",
            },
        });

        // Оновлюємо тимчасовий ID на реальний ID сесії Stripe
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

            // Якщо замовлення вже оброблено, просто повертаємо успіх
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

            // ОНОВЛЕННЯ: Тепер замовлення стає "Paid" і з'являється в адмінці
            order.shippingAddress = `${stripeName} | ${addressStr}`;
            order.phone = customer?.phone || shipping?.phone || "No phone";
            order.status = "Paid";
            order.stripeSessionId = sessionId;

            await order.save();

            // Використання купона
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
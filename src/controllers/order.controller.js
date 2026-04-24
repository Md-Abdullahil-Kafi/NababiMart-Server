import mongoose from "mongoose";
import Order from "../models/order.model.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userEmail,
      items,
      shippingInfo,
      totalAmount,
      paymentMethod,
    } = req.body;
    const authEmail = req.auth?.email;
    const authUid = req.auth?.uid;

    if (!userId || !userEmail || !authEmail || !authUid) {
      return res.status(400).json({
        success: false,
        message: "User information is required",
      });
    }

    if (authEmail !== userEmail || authUid !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to place order for another user.",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one order item is required",
      });
    }

    if (
      !shippingInfo?.fullName ||
      !shippingInfo?.email ||
      !shippingInfo?.phone ||
      !shippingInfo?.address ||
      !shippingInfo?.city
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete shipping information is required",
      });
    }

    if (shippingInfo.email !== userEmail) {
      return res.status(400).json({
        success: false,
        message: "Shipping email must match signed-in user email",
      });
    }

    if (typeof totalAmount !== "number" || totalAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    const order = await Order.create({
      userId,
      userEmail,
      items,
      shippingInfo,
      totalAmount,
      paymentMethod: paymentMethod || "cash_on_delivery",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get orders by user email
export const getUserOrders = async (req, res) => {
  try {
    const { email } = req.params;
    const requester = req.auth?.email;

    if (!requester) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (requester !== email) {
      return res.status(403).json({
        success: false,
        message: "You can only view your own orders.",
      });
    }

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// User can cancel only pending order
export const cancelOrderByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.auth?.email;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (!userEmail || order.userEmail !== userEmail) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to cancel this order",
      });
    }

    if (order.orderStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This order can no longer be cancelled by the user",
      });
    }

    order.orderStatus = "cancelled";
    order.cancelRequested = false;
    order.cancelledBy = "user";

    await order.save();

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin updates order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const updateData = {
      orderStatus,
    };

    if (orderStatus === "cancelled") {
      updateData.cancelledBy = "admin";
    }

    const order = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Admin updates payment status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "paid", "failed"];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order id",
      });
    }

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Payment status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

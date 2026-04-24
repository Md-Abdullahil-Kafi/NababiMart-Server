import Banner from "../models/banner.model.js";
import mongoose from "mongoose";

// get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1 });

    res.json({
      success: true,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// create banner
export const createBanner = async (req, res) => {
  try {
    if (!req.body?.title) {
      return res.status(400).json({
        success: false,
        message: "Banner title is required",
      });
    }

    const banner = await Banner.create(req.body);

    res.status(201).json({
      success: true,
      message: "Banner created",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// update banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid banner id",
      });
    }

    const banner = await Banner.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      message: "Banner updated",
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid banner id",
      });
    }

    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      message: "Banner deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

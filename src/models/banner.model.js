import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    badge: String,
    title: String,
    subtitle: String,
    image: String,
    buttonText: String,
    buttonLink: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

export default Banner;
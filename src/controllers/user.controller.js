import User from "../models/user.model.js";

// create or update user
export const createUser = async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ uid, name, email, photoURL });
    }

    res.status(200).json({
      success: true,
      message: "User saved",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user by email
export const getUserByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
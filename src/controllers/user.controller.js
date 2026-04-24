import User from "../models/user.model.js";

// create or update user
export const createUser = async (req, res) => {
  try {
    const { uid, name, email, photoURL } = req.body;
    const authEmail = req.auth?.email;
    const authUid = req.auth?.uid;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: "uid and email are required",
      });
    }

    if (authEmail !== email || authUid !== uid) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create or update another user",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ uid, name, email, photoURL });
    } else {
      user.name = name || user.name;
      user.photoURL = photoURL || user.photoURL;
      user.uid = uid;
      await user.save();
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
    const requestedEmail = req.params.email;
    const authEmail = req.auth?.email;

    if (!authEmail || requestedEmail !== authEmail) {
      return res.status(403).json({
        success: false,
        message: "You can only access your own profile.",
      });
    }

    const user = await User.findOne({ email: requestedEmail });

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

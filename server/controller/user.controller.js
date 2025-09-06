import UserModel from '../models/user.model.js';

export const createUser = async (req, res) => {
  try {
    const { name, email, phone, address, additionalInfo } = req.body;

    if (!name || !email || !phone || !address) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // ✅ check if user exists by email or phone
    let existingUser = await UserModel.findOne({ 
      $or: [{ email }, { phone }] 
    });

    if (existingUser) {
      return res.status(200).json({
        message: "User already exists",
        user: existingUser
      });
    }

    // create new user
    const user = new UserModel({ name, email, phone, address, additionalInfo });
    const savedUser = await user.save();

    if (!savedUser) {
      return res.status(400).json({ error: "User not created" });
    }

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

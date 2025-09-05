import UserModel from '../models/user.model.js';

export const createUser = async (req, res) => {
  try {
    const {name, email, phone, address, additionalInfo} = req.body;
    if(!name || !email || !phone || !address){
      return res.status(400).json({error: "Please provide all required fields"});
    }
    const user = new UserModel({name, email, phone, address, additionalInfo});
   const saveuser= await user.save();
   if(!saveuser){
    return res.status(400).json({error: "User not created"});
   }
    res.status(201).json(saveuser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

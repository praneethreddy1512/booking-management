import ProviderModel from "../models/provider.model.js";

export const createProvider = async (req, res) => {
    try {
        const { name, email, phone, service, hourlyRate, workingHours } = req.body;

        if (!name || !email || !phone || !service || !hourlyRate || !workingHours) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newProvider = new ProviderModel({
            name,
            email,
            phone,
            service,
            hourlyRate,
            workingHours: {
                start: workingHours.start,
                end: workingHours.end
            }
        });
        const savedProvider = await newProvider.save();

        
        if (savedProvider) {
            res.status(201).json({message: "Provider created successfully", provider: savedProvider});
        }
    } catch (error) {
        res.status(500).json({ message: "Error creating provider", error });
    }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;
    const provider = await ProviderModel.findById(id);

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: "Error fetching provider", error: error.message });
  }
};


export const getProvidersByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        console.log("Category param:", req.params);
        const providers = await ProviderModel.find({ service: { $regex: new RegExp(category, "i") } });

        if (!providers || providers.length === 0) {
            return res.status(404).json({ message: `No providers found for category: ${category}` });
        }

        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching providers by category", error: error.message });
    }
};




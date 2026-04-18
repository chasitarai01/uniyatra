import CostConfig from "../model/CostConfig.js";

export const getCostConfigs = async (req, res) => {
  try {
    const configs = await CostConfig.find();
    
    // Seed data if empty
    if (configs.length === 0) {
      const seed = [
        { 
          country: "United States", 
          rates: { tuition: 25000, living: 12000, visa: 510, medical: 1500, flights: 1200, insurance: 2000 } 
        },
        { 
          country: "United Kingdom", 
          rates: { tuition: 18000, living: 10000, visa: 450, medical: 1000, flights: 800, insurance: 1200 } 
        },
        { 
          country: "Australia", 
          rates: { tuition: 22000, living: 14000, visa: 420, medical: 800, flights: 1100, insurance: 1500 } 
        },
        { 
          country: "Canada", 
          rates: { tuition: 16000, living: 9000, visa: 150, medical: 600, flights: 1000, insurance: 800 } 
        }
      ];
      await CostConfig.insertMany(seed);
      return res.json({ success: true, data: await CostConfig.find() });
    }

    res.json({ success: true, data: configs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCostConfig = async (req, res) => {
  try {
    const { country, rates } = req.body;
    const config = await CostConfig.findOneAndUpdate(
      { country },
      { rates, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );
    res.json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import DocumentChecklist from '../model/DocumentChecklist.js';

export const createChecklists = async (req, res) => {
  try {
    const userId = req.user._id; 

    const checklistsData = [
      {
        category: "Offer Letter",
        items: [
          { label: "Academic documents till date" },
          { label: "IELTS/TOEFL Score" },
          { label: "Passport" },
          { label: "Work Experience (If any)" },
          { label: "University/College Application form" },
          { label: "Skype/phone interview may be conducted..." }
        ]
      },
      {
        category: "Visa Documentation",
        items: [
          { label: "Visa Documentation" },
          { label: "All academic documents (Transcript, Provisional, Character)" },
          { label: "2 recent passport-size color photos with white background." },
          { label: "IELTS/TOEFL Score" },
          { label: "Financial documents" },
          { label: "Income sources with supporting documents" },
          { label: "Valuation of Property with supporting documents" },
          { label: "Tax Clearance Certificate" },
          { label: "CA Report" },
          { label: "Relationship certificate with sponsors and family members" }
        ]
      },
      {
        category: "Applying with a Spouse",
        items: [
          { label: "Marriage certificate" },
          { label: "Evidence of cohabitation" },
          { label: "Evidence of joint financial assets or liabilities" },
          { label: "157A Visa Application form" },
          { label: "Visa Application charge (Demand Draft)" }
        ]
      }
    ];

    const checklists = await Promise.all(
      checklistsData.map(async ({ category, items }) => {
        // Calculate completion percentage based on number of completed items
        const totalItems = items.length;
        const completedItems = items.filter(item => item.completed).length;
        const completionPercent = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;

        // Create the checklist with the completionPercent
        const checklist = new DocumentChecklist({
          userId,
          category,
          items,
          completionPercent
        });

        return await checklist.save();
      })
    );

    res.status(201).json({ message: "Checklists created", checklists });

  } catch (error) {
    console.error("Error creating checklists:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getUserChecklists = async (req, res) => {
//   try {
//     const userId = req.user.id; // Assuming `req.user` is populated by isAuthenticated middleware

//     const checklists = await DocumentChecklist.find({ userId }).populate('userId', 'name email');

//     res.status(200).json({ success: true, checklists });
//   } catch (error) {
//     console.error('Error fetching user checklists:', error);
//     res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };


export const toggleChecklistItem = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const { itemIndex } = req.body;

    const checklist = await DocumentChecklist.findById(checklistId);
    if (!checklist) return res.status(404).json({ message: "Checklist not found" });

    checklist.items[itemIndex].completed = !checklist.items[itemIndex].completed;

    const total = checklist.items.length;
    const completed = checklist.items.filter(item => item.completed).length;
    checklist.completionPercent = Math.round((completed / total) * 100);

    await checklist.save();
    res.json(checklist);
  } catch (error) {
    res.status(500).json({ message: "Failed to toggle item" });
  }
};

export const markChecklistComplete = async (req, res) => {
  try {
    const checklistId = req.params.id;
    const checklist = await DocumentChecklist.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({ message: 'Checklist not found' });
    }

    checklist.completed = true;
    await checklist.save();

    res.status(200).json({
      message: 'Checklist marked as complete',
      checklist,
    });
  } catch (error) {
    console.error('Error marking checklist as complete:', error);
    res.status(500).json({ message: 'Failed to mark checklist as complete' });
  }
};
// Delete a checklist by checklistId
export const deleteChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    const checklist = await DocumentChecklist.findByIdAndDelete(checklistId); // 🔄 changed this line

    if (!checklist) {
      return res.status(404).json({ message: "Checklist not found or already deleted" });
    }

    res.status(200).json({ message: "Checklist deleted successfully" });
  } catch (error) {
    console.error("Error deleting checklist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllChecklists = async (req, res) => {
  try {
    // Fetch all checklists and populate user data from the 'User' model
    const checklists = await DocumentChecklist.find()
    .populate('userId');  // Populate only the 'username' and 'email'
    

    res.status(200).json({ checklists });
  } catch (error) {
    console.error("Error fetching checklists:", error);
    res.status(500).json({ message: "Server error" });
  }
};
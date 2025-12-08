import Contact from "../models/contact.model.js";
import QueryCounter from "../models/QueryCounter.js";

async function generateQRPId() {
  const counter = await QueryCounter.findOneAndUpdate(
    { name: "QRP" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `QRP-${String(counter.value).padStart(5, "0")}`;
}

export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message)
      return res
        .status(400)
        .json({ success: false, message: "All the fields are required." });

    const newContact = new Contact({
      full_name: name,
      email: email,
      subject: subject,
      message: message,
      status: "Open",
      QRP: await generateQRPId(),
    });
    await newContact.save();
    return res.status(201).json({
      success: true,
      message: "Query created successfully.",
      data: newContact,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getContact = async (req, res) => {
  try {
    const { data } = req.query;
    const obj = JSON.parse(data);

    const { page = 1, status, search } = obj;
    console.log(page, search, status);

    const query = {};

    // Filtering
    if (status && status !== "All") query.status = status;

    // Search filter
    if (search) {
      query.$or = [
        { full_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { subject: new RegExp(search, "i") },
        { message: new RegExp(search, "i") },
        { QRP: new RegExp(search, "i") },
      ];
    }

    const limit = 20;
    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(query).skip(skip).limit(limit),
      Contact.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "contacts fetched successfully",
      meta: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
      },
      data: contacts,
    });
  } catch (error) {
    console.error("Get contacts Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status, contactId } = req.query;

    if (!contactId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Query ID format",
      });
    }

    // Check if lead exists
    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Query not found",
      });
    }

    const updatedQuery = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: {
          status: status,
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Query updated successfully",
      data: updatedQuery,
    });
  } catch (error) {
    console.error("Update Query Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

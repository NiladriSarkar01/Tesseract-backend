import cloudinary from "../lib/cloudinary.js";
import Application from "../models/Application.models.js";
import ApplicationCounter from "../models/applicationCounter.js";

const VALID_EVENTS = [
  "FIGMA",
  "LINE FOLLOWER",
  "PHOTO STORY",
  "TREASURE HUNT",
  "CARROM",
  "CAPTURE THE FLAG",
  "PAINTBALL",
  "LAP RACE",
  "E-FOOTBALL",
  "MODEL DISPLAY",
  "TERRANOVA",
  "NAVIN VIDYARTHI",
  "ROBO WAR (8 KG)",
  "CHESS",
  "TECH QUIZ",
  "SUPER CODER",
  "ROBO SOCCER",
  "PHOTOGRAPHY",
  "GRAFFITI",
  "DRONE",
  "BGMI",
];

async function generateDRPId() {
  const counter = await ApplicationCounter.findOneAndUpdate(
    { name: "DRP" },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  return `DRP-${String(counter.value).padStart(5, "0")}`;
}

export const createApplication = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      event,
      eventId,
      paymentMode,
      paymentProof,
      registrationType,
      teamName,
      teamMembers,
    } = req.body;

    console.log(
      name,
      email,
      phone,
      event,
      eventId,
      paymentMode,
      paymentProof,
      registrationType,
      teamName,
      teamMembers
    );

    if (
      !name ||
      !email ||
      !phone ||
      !event ||
      !eventId ||
      !paymentMode ||
      !paymentProof ||
      !registrationType
    )
      return res
        .status(400)
        .json({ success: false, message: "All the fields are required" });

    if (
      !VALID_EVENTS.includes(event) ||
      !["online", "offline"].includes(paymentMode) ||
      !["solo", "team"].includes(registrationType)
    ) {
      return res.status(400).json({ success: false, message: "Invalid Data." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email format." });
    }
    const uploadRes = await cloudinary.uploader.upload(paymentProof);

    const application = {
      name: name,
      email: email,
      phone: phone,
      event: event,
      eventId: eventId,
      paymentMode: paymentMode,
      paymentProof: uploadRes.secure_url,
      registrationType: registrationType,
      teamName: teamName,
      teamMembers: teamMembers,
      status: "Pending",
      DRP: await generateDRPId(),
    };

    const newApplication = new Application(application);
    const response = await newApplication.save();
    console.log(response);

    return res.status(201).json({
      success: true,
      message: "Application created successfully.",
      data: newApplication,
    });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { data } = req.query;
    const obj = JSON.parse(data);

    const { page = 1, event, status, search } = obj;
    const limit = 20;

    console.log(page, limit, event, status, search);

    const query = {};

    // query.user_id=userId;

    // Filtering
    if (event && event !== "All") query.event = event;
    if (status && status !== "All") query.status = status;

    // Search filter
    if (search) {
      query.$or = [
        { first_name: new RegExp(search, "i") },
        { last_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(query).skip(skip).limit(Number(limit)),
      Application.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Appliactions fetched successfully",
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      data: applications,
    });
  } catch (error) {
    console.error("Get Leads Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { status, applicationId } = req.query;

    if (!applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Application ID format",
      });
    }

    // Check if lead exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      applicationId,
      {
        $set: {
          status: status,
        },
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error("Update Application Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

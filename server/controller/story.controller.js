const sharp = require("sharp");
const Story = require("../model/story.model");
const Cloudinary = require("../config/Cloudinary");
const User = require("../model/user.model");
const { getDataUri } = require("../config/DataUri");
const cron = require("node-cron");

// Upload Story
const addStory = async (req, res) => {
  try {
    const image = req.file;
    const authorId = req.id;

    if (!image) return res.status(400).json({ message: "Please upload an image", success: false });

    const resizedBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800 })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    const fileUri = getDataUri({
      originalname: "story.jpeg",
      buffer: resizedBuffer
    });

    const uploadRes = await Cloudinary.uploader.upload(fileUri);

    const story = await Story.create({
      image: uploadRes.secure_url,
      public_id: uploadRes.public_id,
      author: authorId,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Story uploaded", story, success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Fetch Stories (from user + following)
const getStories = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("following");

    const allStoryAuthors = [...user.following, userId];

    const stories = await Story.find({ author: { $in: allStoryAuthors } })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    res.status(200).json({ message: "Stories fetched", success: true, stories });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", success: false });
  }
};


// Fetch stories of a specific user
const getUserStories = async (req, res) => {
  try {
    const { userId } = req.params;

    const stories = await Story.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate("author", "username profilePicture");

    res.status(200).json({ success: true, message: "User stories fetched", stories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// CRON: delete stories after 1 minute (testing only)
cron.schedule("* * * * *", async () => {
  const expiryTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // ✅ 24 hours ago
 // 1 minute ago
  try {
    const expiredStories = await Story.find({ createdAt: { $lt: expiryTime } });

    for (const story of expiredStories) {
      // Delete from Cloudinary
      if (story.public_id) {
        await Cloudinary.uploader.destroy(story.public_id);
      }

      // Delete from DB
      await Story.findByIdAndDelete(story._id);
      console.log(`🗑️ Story by user ${story.author} deleted from DB & Cloudinary`);
    }
  } catch (error) {
    console.error("❌ Failed to clean expired stories:", error);
  }
});

module.exports = {
  addStory,
  getStories,
    getUserStories
};

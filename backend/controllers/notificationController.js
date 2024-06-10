import Notification from "../models/notificationmodel.js";

export const getNotications = async (req, res) => {
  try {
    const notification = await Notification.find({ to: req.user.id }).populate(
      "from",
      "username profilePic"
    );
    await Notification.updateMany(
      { to: req.user.id },
      { $set: { read: true } }
    );
    return res.json(notification);
  } catch (error) {
    console.log("error in getNotications", error);
    return res.status(500).json({ error: error.message });
  }
};
export const deleteNotications = async (req, res) => {
  try {
    await Notification.deleteMany({ to: req.user.id });
    return res.json({ message: "Notifications deleted" });
  } catch (error) {
    console.log("error in getNotications", error);
    return res.status(500).json({ error: error.message });
  }
};



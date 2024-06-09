import Notification from "../models/notificationmodel.js";

export const getNotications = async (req, res) => {
  try {
    const Notification = await Notification.find({ to: req.user.id }).populate(
      "from",
      "username profilePic"
    );
    await Notification.updateMany(
      { to: req.user.id },
      { $set: { read: true } }
    );
    return res.json(Notification);
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

//not important

// export const deleteNotication = async (req, res) => {
//   try {
//     const notification = await Notification.findById(req.params.id);
//     if (!notification)
//       return res.status(404).json({ error: "Notification not found" });
//     if (notification.to.toString() !== req.user.id)
//         return res.status(403).json({ error: "Unauthorized" });
//     await Notification.findByIdAndDelete(req.params.id);
//     return res.json({ message: "Notification deleted" });
//   } catch (error) {
//     console.log("error in getNotications", error);
//     return res.status(500).json({ error: error.message });
//   }
// };

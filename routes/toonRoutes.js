import { Router } from "express";
import Toonz from "../model/webtoonz.js";
import Episode from "../model/episode.js";
import {
  authRoute,
  uploadEp,
  localSeriesUpload,
  dltEp,
} from "../middlewares/tokencheckers.js";
import Comment from "../model/comments.js";
import User from "../model/users.js";
import { deleteFileFromFtp } from "../middlewares/ftpupload.js";

const router = Router();

// get toons 20 at a time
router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 20;
  let skip = (page - 1) * limit;
  let total = await Toonz.countDocuments({ status: "approved" });
  let pages = Math.ceil(total / limit);

  let toonz = await Toonz.find({ status: "approved" })
    .sort({ releaseDate: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    toonz,
    pages,
  });
});

// add toonz
router.post("/", authRoute, async (req, res) => {
  let { title, author, genre, illustrator, description } = req.body;
  let { id, type } = req.user;
  let date = new Date().toDateString();

  if (!req.files || !req.files.coverImage)
    return res.status(400).json({ E: "The cover image is required" });

  try {
    let isUpload = await localSeriesUpload(req.files.coverImage, title);

    if (!isUpload) throw new Error("Upload failed please retry");

    if (Array.isArray(genre)) genre = genre.join(",");
    let isToonz = await Toonz.create({
      title,
      author,
      genre,
      illustrator,
      description,
      coverImage: isUpload.url,
      fileCode: isUpload.code,
      status: type.includes("admin") ? "approved" : "pending",
      uploadAcc: id,
      uploader: type.includes("admin") ? "admin" : "regular",
      releaseDate: date,
      twporiginal: type.includes("admin") ? true : false,
    });
    let user = await User.findByIdAndUpdate(id, { isAuthor: true });
    return res.status(201).json({
      M: "file uploaded succesful",
      toonzId: isToonz.id,
      user: {
        name: user.name,
        type: user.type,
        email: user.email,
        favourites: user.favourites,
        isAuthor: user.isAuthor,
        subcriptions: user.subcriptions,
        _id: user._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ E: err.message });
  }
});

// get single toon
router.get("/:id", async (req, res) => {
  const { id } = req.params; 
  if (!id) res.sendStatus(400);

  try {
    const toon = await Toonz.findById(id)
      .populate("comments")
      .populate("chapters");

    if (!toon) res.status(404).json({ E: "webtoon not found" });

    res.json({ toon });
  } catch (err) {
    console.log(err);
    res.status(500).json({ E: err.message });
  }
});

// update toonz
router.put("/like/:id", authRoute, async (req, res) => {
  let toonId = req.params.id;
  let { id } = req.user;
  const user = await User.findById(id);
  let toon = await Toonz.findById(toonId);
  if (!toon) return res.sendStatus(404);

  if (!toon?.likesArray.includes(id)) {
    toon.likes += 1;
    await toon.updateOne({ $push: { likesArray: id } });
    await user.updateOne({ $push: { likesArray: toonId } });
    await toon.save();
    return res.sendStatus(200);
  }

  if (toon?.likesArray.includes(id)) {
    if (toon.likes >= 0) toon.likes -= 1;
    await toon.updateOne({ $pull: { likesArray: id } });
    await user.updateOne({ $pull: { likesArray: toonId } });
    await toon.save();
    return res.sendStatus(200);
  }
});

// delete toonz
router.delete("/:id", authRoute, async (req, res) => {
  const toonId = req.params.id;
  const { id, type } = req.user;
  if (!toonId) res.sendStatus(400);

  try {
    let toon = await Toonz.findById(toonId);
    if (!toon) res.status(404).send("webtoon not found");
    if (!type.includes("admin") && toon.uploadAcc !== id)
      res.status(401).send("this user can not delete this webtoonz");

    let eps = toon.chapters;
    eps.forEach(async (ep, index) => {
      await Episode.findByIdAndDelete(ep);
    });

    const coverLink = toon.coverImage;
    let stringArr = coverLink.split("/").slice(3, 5);
    let joinPath = `/${stringArr[0]}/${stringArr[1]}`;

    deleteFileFromFtp(joinPath);
    await toon.deleteOne({ fileCode: toon.fileCode });
    res.status(200).send("Webtoonz has been deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/comment", async (req, res) => {
  const { seriesId, userId, username, comment } = req.body;

  try {
    if (!seriesId)
      res
        .status(400)
        .json({ E: "An error occured try refreshing the page and try again" });

    let createComment = await Comment.create({ userId, username, comment });
    const toon = await Toonz.findById(seriesId);
    if (!toon) res.sendStatus(404);
    await toon.updateOne({ $push: { comments: createComment.id } });
    const toons = await Toonz.findById(seriesId);
    let commentz = await Comment.find({ _id: { $in: toons.comments } });

    res.status(200).json({ commentz, M: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ E: err.message });
  }
});

router.delete("/comment/:id", authRoute, async (req, res) => {
  const commentId = req.params.id;
  const { seriesId } = req.query;
  const { id, type } = req.user;

  try {
    if (!seriesId) res.status(400).json({ E: "Invalid request" });

    // delete the comment
    let createComment = await Comment.findByIdAndDelete(commentId);

    // remove the comment from its toon
    const toon = await Toonz.findById(seriesId);
    if (!toon) res.sendStatus(404);
    await toon.updateOne({ $pull: { comments: commentId } });

    // fetch all the comment
    const toons = await Toonz.findById(seriesId);
    let commentz = await Comment.find({ _id: { $in: toons.comments } });

    res.status(200).json({ commentz, M: "success" });
  } catch (err) {
    res.status(500).json({ E: err.message });
  }
});

/****************** episodes routes *********************/
// get an episode
router.get("/episode/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let toons = await Toonz.findOne({ chapters: id })
      .select("title _id")
      .populate("comments")
      .populate("chapters");
    if (!toons) res.status(404).json({ E: "webtoon not found" });
    res.json({ toons });
  } catch (err) {
    console.log(err.message);
  }
});

router.post("/episode", authRoute, async (req, res) => {
  let { seriesid, eptitle } = req.body;
  if (!req.files)
    return res
      .status(400)
      .json({ E: "Please add a cover image and at least 4 pages" });

  let releaseDate = new Date().toDateString();
  let toon = await Toonz.findById(seriesid);

  if (!toon)
    return res
      .status(404)
      .json({ E: "not webtoon with this id please consider reuploading" });

  let { title, status, fileCode, twporiginal } = toon;
  const filename = `${title}-${fileCode}`;

  try {
    let findDuplicate = await Episode.findOne({
      title: eptitle,
      _id: { $in: toon.chapters },
    });
    if (findDuplicate)
      res.status(400).json({ E: "you already have an episode with this name" });

    let ep = await Episode.create({
      title: eptitle,
      releaseDate,
      twporiginal,
      isToonVerified: status === "approved" ? true : false,
    });

    const uploads = await uploadEp(req.files, filename, eptitle, res);
    if (!uploads)
      throw new Error(
        "error occured while uploading this episode pls try again"
      );

    await ep.updateOne({
      coverImage: uploads.coverImage,
      pages: uploads.pages,
    });
    await toon.updateOne({ $push: { chapters: ep.id } });

    if (toon.status === "pending") {
      return res.status(200).json({
        M: `Episode uploaded successfully!!🎉🎉. \n Thank You For uploading Your Webtoon. Your webtoon is under review, Please note that this may take up to 3 to 4 working days and You will be notified if it is approved`,
      });
    } else {
      // function to send an email to subcribed users to update them on the new episode

      return res.status(200).json({ M: "Episode uploaded successfully!!🎉🎉" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ E: err.message });
  }
});

router.delete("/episode/:id", authRoute, async (req, res) => {
  console.log("delete req came in");
  const epId = req.params.id;
  const { id, type } = req.user;

  try {
    if (!epId) return res.sendStatus(400);

    let ep = await Episode.findById(epId);
    if (!ep) return res.status(404).send("episode not found");
    const toon = await Toonz.findOne({ chapters: epId });
    if (
      (toon.uploadAcc !== id && type === "regular") ||
      (ep.twporiginal && type === "regular")
    )
      return res.status(403).send("You account cant perform this action");

    dltEp(ep);
    await ep.deleteOne();
    await toon.updateOne({ $pull: { chapters: epId } });
    res.status(200).send("episode has been deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;

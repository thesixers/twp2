import Toonz from "../model/webtoonz.js";
import Episode from "../model/episode.js";
import Scripture from "../model/scripture.js";
import Message from "../model/messages.js";

export const slash_get = (req, res) => res.redirect("/twp/home");

export const get_me = (req, res) => {
  if (!req.user) return res.status(401).json({ E: "Not authorized" });
  res.json({ user: req.user });
};

export const home_get = async (req, res) => {
  const newToonsNo = req.query.nwebtoons;
  const trendingToonsNo = req.query.twebtoons;
  const episodesNo = req.query.episodes;

  const nWebtoons = await Toonz.find({ status: "approved" }).limit(newToonsNo);

  const tWebtoons = await Toonz.find({ status: "approved" })
    .sort({ likes: -1 })
    .limit(trendingToonsNo);

  const episodes = await Episode.find()
    .sort({ releaseDate: -1 })
    .limit(episodesNo);

  const scripture = await Scripture.find();

  res.json({ tWebtoons, nWebtoons, episodes, scripture: scripture[0] });
};

export const author_get = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ E: "Not authorized" });
    if (!req.user.isAuthor) return res.status(403).json({ E: "Not an author" });
    let toonz = await Toonz.find({ uploadAcc: req.user._id });
    return res.json({ webtoons: toonz });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ E: error.message });
  }
};

function formatDate(date) {
  const options = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}

export const complaint_post = async (req, res) => {
  const { name, email, message } = req.body;
  let date = new Date();
  let createdAt = formatDate(date);

  try {
    let createMessage = await Message.create({
      name,
      email,
      message,
      createdAt,
    });
    res.status(200).json({ M: "Message sent" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ E: err.message });
  }
};

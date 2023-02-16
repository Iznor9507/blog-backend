import PostModel from "../models/Post.model.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ" + error.message });
  }
};
export const update = async (req, res) => {
  try {
    const posts = await PostModel.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
    });
    return res.json(posts);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ СТАТЬЮ" + error.message });
  }
};
export const remove = async (req, res) => {
  try {
    // const postId = req.params.id;
    await PostModel.findByIdAndDelete(req.params.id);
    //   {
    //     _id: postId,
    //   },
    //   (err, doc) => {
    //     if (err) {
    //       console.log(err);
    //       return res.status(500).json({
    //         message: "Не удалось удалить статью1",
    //       });
    //     }
    //     if (!doc) {
    //       return res.status(404).json({
    //         message: "СТАТЬЯ НЕ НАЙДЕНА2",
    //       });
    //     }
    //   }
    // );
    res.json("DELETED");
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ УДАЛИТЬ СТАТЬЮ." + error.message });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },

      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },

      (err, doc) => {
        if (err) {
          console.log(error.message);
          return res.status(500).json({
            message: "НЕ УДАЛОСЬ ВЕРНУТЬ СТАТЬЮ" + error.message,
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "СТАТЬЯ НЕ НАЙДЕНА",
          });
        }
        res.json(doc);
      }
    ).populate('user')
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ ВСЕ СТАТЬИ" + error.message });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });
    const post = await doc.save();
   
    return res.json(post);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ СОЗДАТЬ СТАТЬЮ" + error.message });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();
    const  tags = posts.map(item => item.tags).flat().slice(0, 5)
    res.json(tags);
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "НЕ УДАЛОСЬ ПОЛУЧИТЬ ТЕГИ" + error.message });
  }
};

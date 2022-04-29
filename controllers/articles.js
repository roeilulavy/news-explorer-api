const Article = require('../models/article');
const { BadRequestError, NotFoundError, ForbiddentError } = require('../utils/errorHandler');

const getArticles = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const articles = await Article.find({}).select('+owner');

    if (articles) {
      const userSavedArticles = articles.filter((article) => article.owner.toHexString() === _id);

      res.status(200).send(userSavedArticles);
    } else {
      throw new Error();
    }
  } catch (err) {
    next(err);
  }
};

const createArticle = async (req, res, next) => {
  const { _id } = req.user;

  const {
    keyword, title, text, date, source, link, image,
  } = req.body;

  try {
    const article = await Article.create({
      keyword, title, text, date, source, link, image, owner: _id,
    });

    if (article) {
      res.status(201).send(article);
    } else {
      throw new Error();
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data provided...'));
      return;
    }
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  const { articleId } = req.params;
  const { _id } = req.user;

  try {
    const articleForDelete = await Article.findById(articleId).select('+owner');

    if (articleForDelete === null) {
      next(new NotFoundError('Article not found!'));
      return;
    }

    const articlesOwner = articleForDelete.owner.toHexString();

    if (articlesOwner !== _id) {
      next(new ForbiddentError('You dont own this article!'));
      return;
    }

    const deletedArticle = await Article.findByIdAndDelete(articleId);

    if (deletedArticle) {
      res.status(200).send(deletedArticle);
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Invalid data provided...'));
      return;
    }
    next(err);
  }
};

module.exports = { getArticles, createArticle, deleteArticle };

import express from 'express';
const router = express.Router();
import Idea from '../models/Idea.js';
import mongoose from 'mongoose';

// @route           GET /api/ideas
// @description     Get all ideas
// @access          Public
router.get('/', async (req, res, next) => {
  try {
    const ideas = await Idea.find();
    res.json(ideas);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           GET /api/ideas/:id
// @description     Get single idea
// @access          Public
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(404);
      throw new Error('Idea Not Found');
    }

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      res.status(404);
      throw new Error('Idea Not Found');
    }
    res.json(idea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// @route           POST /api/ideas
// @description     Create new idea
// @access          Public
router.post('/', async (req, res, next) => {
  try {
    const { title, summary, description, tags } = req.body;

    if (!title?.trim() || !summary?.trim() || !description?.trim()) {
      res.status(400);
      throw new Error('Title, summary and description are required');
    }

    const newIdea = new Idea({
      title,
      summary,
      description,
      tags:
        typeof tags === 'string'
          ? tags
              .split(',')
              .map((tag) => tag.trim())
              .filter(Boolean)
          : Array.isArray(tags)
          ? tags
          : [],
    });

    const savedIdea = await newIdea.save();
    res.status(201).json(savedIdea);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

export default router;

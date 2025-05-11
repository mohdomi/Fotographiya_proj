import { Router } from "express";
import Category from "../db/schemas/category.js";
import Wedding from "../db/schemas/wedding.js";

const router = Router();


router.post('/create-category', async (req, res) => {
  try {
    const { weddingId, title, unlockThreshhold } = req.body;

    if (!weddingId || !title || unlockThreshhold === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxOrder = await Category.find({ weddingId }).sort({ order: -1 }).limit(1);

    const newOrder = maxOrder.length ? (maxOrder[0].order || 0) + 1 : 1;

    const result = await Category.create({
      weddingId,
      title,
      createdAt: new Date(),
      order: newOrder,
      unlockThreshhold: Number(unlockThreshhold),
    });

    await Wedding.findByIdAndUpdate(weddingId, {
      $addToSet: {
        categories: result._id,
      },
    });

    res.status(200).json({
      message: "Category Created",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error in /create-category",
      error: error.message,
    });
  }
});


router.get('/categories/:categoryId', async (req, res) => {

    try {
        const categoryId = req.params.categoryId;

        const categoryDetails = await Category.find({
            _id: categoryId
        }).populate('images');

        return res.status(200).json({
            categoryDetails
        })

    } catch (error) {
        return res.status(400).json({
            message: "error in categories get.",
            error
        })

    }
})


router.patch('/update-category-threshold/:categoryId', async (req, res) => {
  const { categoryId } = req.params;
  const { unlockThreshhold } = req.body;

  try {
    if (unlockThreshhold === undefined) {
      return res.status(400).json({ message: "unlockThreshhold is required" });
    }

    const updated = await Category.findByIdAndUpdate(
      categoryId,
      { unlockThreshhold: Number(unlockThreshhold) },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Threshold updated successfully",
      category: updated,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// left these two for now

router.put('/update-category', async (req, res) => {

    return res.status(200).json({
        message: ""
    })

})

router.delete('delete-category', async (req, res) => {

    return res.status(200).json({
        message: ""
    })

})



export default router;
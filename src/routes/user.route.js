import { Router } from "express";
import User from "../db/schemas/user.js";
import pin_generator from "../random/random.js";
import jwt from 'jsonwebtoken';
import authMiddleware from "../auth/index.auth.js";
import Category from "../db/schemas/category.js";
import Image from "../db/schemas/image.js";

const router = Router();


router.post('/create_user', async (req, res) => {

    try {
        const { weddingId } = req.body;
        const newUser = new User({ pin: pin_generator(), weddingId });
        const result = await newUser.save();

        res.status(200).json({
            message: 'User created.',
            result
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error
        })
    }

})

router.post('/login', async (req, res) => {
    try {
        const { pin } = req.body;

        const verified = await User.findOne({
            pin
        });

        if (!verified) {
            console.log("invalid pin");
            return res.status(403).json({
                message: "Invalid pin."
            });
        }

        const token = jwt.sign({
            userId: verified._id
        }, "some random password for jwt.")

        res.status(200).json({
            message: "Successfull login.",
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'some error in /login route'
        })
    }


})

router.post('/click-image', authMiddleware, async (req, res) => {
    const { categoryId, imageId } = req.body;
    const userId = req.userId;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        let interaction = user.interactions.find((i) => i.categoryId.toString() === categoryId);
        if (!interaction) {
            interaction = { categoryId, clickedImages: [] };
            user.interactions.push(interaction);
        }

        const currentCategory = await Category.findById(categoryId);

        const image = await Image.findById(imageId);
        if (!image || image.categoryId.toString() !== categoryId) {
            return res.status(400).json({
                error: "This image does not belong to the specified category."
            });
        }


        const currentOrder = currentCategory.order;
        const threshold = currentCategory.unlockThreshhold || 0;

        const prevCategory = await Category.findOne({ order: currentOrder - 1, weddingId: currentCategory.weddingId });

        if (prevCategory) {
            const prevInteraction = user.interactions.find(
                (i) => i.categoryId.toString() === prevCategory._id.toString()
            );

            if (!prevInteraction || prevInteraction.clickedImages.length < prevCategory.unlockThreshhold) {
                return res.status(400).json({
                    error: "You must interact with the previous category first to unlock this category."
                });
            }
        }

        const alreadyClicked = interaction.clickedImages.some((img) => img.imageId.toString() === imageId);
        if (alreadyClicked) {
            return res.status(400).json({ error: "You have already clicked this image." });
        }

        interaction.clickedImages.push({ imageId });

        if (interaction.clickedImages.length >= threshold) {
            const nextCategory = await Category.findOne({ order: currentCategory.order + 1 });

            if (nextCategory) {
                const alreadyUnlocked = user.interactions.some(
                    (i) => i.categoryId.toString() === nextCategory._id.toString()
                );

                if (!alreadyUnlocked) {
                    user.interactions.push({ categoryId: nextCategory._id, clickedImages: [] });
                }
            }
        }

        await user.save();

        res.status(200).json({
            message: "Interaction updated and next category checked",
            interactions: user.interactions
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router;
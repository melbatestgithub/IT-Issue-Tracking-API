const express=require("express")
const router=express.Router()
const Category=require("../models/Category")
router.post("/add", async (req, res) => {
    const { categoryName } = req.body; // Destructure categoryName from req.body

    // Create a new category instance
    const newCategory = new Category({
        categoryName: categoryName
    });

    try {
        // Save the new category to the database
        await newCategory.save();
        // Send a success response
        res.status(201).json({ message: 'Category added successfully', category: newCategory });
    } catch (error) {
        console.error('Error saving category:', error);
        // Send an error response
        res.status(500).json({ message: 'Internal Server Error occurred' });
    }
});

router.get("/get", async (req, res) => {
    try {
        const categories = await Category.find();

        if (!categories.length) {
            return res.status(200).json({ success: true, message: "No category found" });
        }

        res.status(200).json({
            success: true,
            categories
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ success: false, message: "Internal Server Error occurred" });
    }
});
module.exports=router

const express = require('express')
const UserRecipeRate = require('../models/userreciperate')
const Recipe = require('../models/recipe')
const auth = require('../middlefunctions/auth')
const router = new express.Router()

router.post('/api/user/recipe/:recipe_id/rate', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    // we can check if the recipe exist at all, for now we trust the application
    const userRecipeRate = new UserRecipeRate({
        ...req.body,
        user: user_id,
        recipe: recipe_id
    })

    try {
        await userRecipeRate.save()
        const recipe = await Recipe.findById({ _id: recipe_id})
        res.status(201).send({rate :recipe.rate})
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/api/user/recipe/:recipe_id/rate', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    try {
        const rate = await UserRecipeRate.findOne({user: user_id,recipe: recipe_id})
        
        if (!rate) {
            res.status(404).send()
        }
       
        res.send({rate:rate.rate})
    } catch (e) {
        res.status(500).send()
    }
})
router.patch('/api/user/recipe/:recipe_id/rate', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['rate']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    
    try {
        const rate = await UserRecipeRate.findOne({user: user_id,recipe: recipe_id})

        if (!rate) {
            return res.status(404).send()
        }

        updates.forEach((update) => rate[update] = req.body[update])
        await rate.save()
        const recipe = await Recipe.findById({ _id: recipe_id})
        res.send({rate:recipe.rate})
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/api/user/recipe/:recipe_id/rate', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    try {
        const rate = await UserRecipeRate.findOneAndDelete({user: user_id,recipe: recipe_id})

        if (!rate) {
            res.status(404).send()
        }
        const recipe = await Recipe.findById({ _id: recipe_id})
        res.send({rate:recipe.rate})
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router

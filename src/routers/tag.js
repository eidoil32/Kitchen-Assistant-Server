const express = require('express')
const Tag = require('../models/tag')
const RecipeTagConnection = require('../models/recipetagconnection')
const auth = require('../middlefunctions/auth')
const { create } = require('../models/recipetagconnection')
const router = new express.Router()

router.post('/api/user/recipe/:recipe_id/create/tags', auth, async(req, res)=>{
    const recipe_id = req.params.recipe_id
    const tags = JSON.parse(req.body.tags);

    for (let i = 0; i < tags.length; i++) {
        try {
            let tag = await Tag.findTagByName(tags[i].title);
            if (!tag) {
                tag = new Tag({title: tags[i].title});
                await tag.save();
            }
             
            const recipeTagConnection = new RecipeTagConnection({
                recipe: recipe_id,
                tag: tag._id
            });
        
            await recipeTagConnection.save();
        } catch (e) {
            return res.status(400).send(e);
        }
    }

    res.status(200).send(tags)
});

router.get('/api/community/tags',auth,async(req,res)=>{
    try {
        const tags = await Tag.find({})
        res.status(200).send(tags)
    } catch (error) {
        res.status(500).send(e)
    }
    
    
})

module.exports = router
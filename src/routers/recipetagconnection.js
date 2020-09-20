const express = require('express')
const auth = require('../middlefunctions/auth')
const RecipeTagConnection = require('../models/recipetagconnection')

const router = new express.Router()
router.post('/api/user/recipe/:recipe_id/tags', auth, async (req, res) => {
    
    recipe_id = req.params.recipe_id
    // we can check if the tags exists at all, for now we trust the application
    for(let i=0;i<req.body.length;i++){
        const tagId = req.body[i].tag_id

        const recipeTagConnection = new RecipeTagConnection({
       
            tag:tagId,
            recipe: recipe_id
        })
        
        try {
            await recipeTagConnection.save()
        
            
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    res.status(200).send({success: true})
})


router.delete('/api/user/recipe/:recipe_id/tags/:tag_id', auth, async (req, res) => {
    recipe_id = req.params.recipe_id;
    tag_id = req.params.tag_id;
    try {
        const connection = await RecipeTagConnection.findOneAndDelete({tag: tag_id, recipe: recipe_id});
        if (!connection) {
            res.status(404).send();
        }

        res.status(200).send({success: true});
    } catch (e) {
       return res.status(500).send();
    }
});

module.exports = router

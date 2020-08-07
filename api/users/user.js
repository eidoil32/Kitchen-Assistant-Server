const express = require("../../server/server").express;
const app = require("../../server/server").server;
const router = express.Router();

router.param('name', function(request, response, next, name) {
    request.name = name;
    next();
})

router.get('/add/:name', function(request, response) {
    response.send("in add user: " + request.name);
});

router.post('/login', function(request, response) {
    console.log("here");
    console.log(request.params);
    response.send("In login"); 
});

module.exports = {
    user_api: router
}
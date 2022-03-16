const {Router} = require("express");
const userController = require("./controller/userController");
const termController = require("./controller/termController");

const routes = Router();

routes.get('/', (req, res) =>{
    return res.json({message: 'Hello World'});
});

routes.post('/users/new', userController.post);
routes.put('/users/edit/:id', userController.put);
routes.get('/users/:id', userController.get);

routes.post('/term/new', termController.post);
routes.get('/term/get/last', termController.getLastTerm);

module.exports = routes;
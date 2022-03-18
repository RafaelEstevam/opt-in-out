const {Router} = require("express");
const userController = require("./controller/userController");
const termController = require("./controller/termController");
const historicController = require("./controller/historicController");

const routes = Router();

routes.get('/', (req, res) =>{
    return res.json({message: 'Hello World'});
});

routes.post('/users/new', userController.post);
routes.put('/users/edit/:id', userController.put);
routes.get('/users/:id', userController.get);
routes.get('/users/get/all', userController.getAllUsers);
routes.post('/users/recieveNotifications', userController.getByAcceptServices);

routes.post('/term/new', termController.post);
routes.get('/term/get/last', termController.getLastTerm);

routes.get('/historics', historicController.getHistorics);
routes.get('/historics/:user_id', historicController.getHistoricsByUser);

module.exports = routes;
let express = require('express');
let router = express.Router();
import CommondityModel from '../models/commondityModel.js';



/* GET home page. */
router.get('/', async (req, res, next) => {
 	let query = req.query;
 	try {
 		await CommondityModel.create({
 			name: query.name
 		});
 		res.end(JSON.stringify(query));
 	} catch (e) {
 		res.end(e.toString());
 	}
});

module.exports = router;

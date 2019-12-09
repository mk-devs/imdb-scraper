const express = require('express'),
	  router = express.Router(),
	  scavenger = require('scavenger');

const extractInfo = scavenger.createExtractor({
    scope: 'div.lister-list > .lister-item:first-child',
    fields: {
    	image: {
    		selector: '.lister-item-image a img',
    		attribute: 'src'
    	},
    	link: {
    		selector: '.lister-item-image a',
    		attribute: 'href'
    	},
    	title: 'h3.lister-item-header a',
    	rating: '.ratings-bar strong',
    	runtime: '.runtime',
    	genre: '.genre',
    	desc: '.lister-item-content p:nth-of-type(2)'
    }
});


router.get('/:category', (req, res, next) => {
	try {
		const category = req.params.category;
		let rand = Math.floor(Math.random() * 20) + 1;
		const url = `https://www.imdb.com/search/title/?genres=${category}&sort=user_rating,desc&start=${rand}&title_type=feature&num_votes=25000,`;		

		scavenger.scrape(url, extractInfo)
		.then((movieInfo) => {
			res.send({data: movieInfo});					    
		});
	} catch (err) {
		res.send({ message: "Error", error: err })
	}
})


module.exports = router;
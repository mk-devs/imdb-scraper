const express = require('express'),
	  router = express.Router(),
      Nightmare = require('nightmare'),
      nightmare = new Nightmare(),
      cheerio = require('cheerio');

router.get('/:category', (req, res, next) => {
	try {
		const category = req.params.category;
		let rand = Math.floor(Math.random() * 20) + 1;
		const url = `https://www.imdb.com/search/title/?genres=${category}&sort=user_rating,desc&start=${rand}&title_type=feature&num_votes=25000,`;		

        nightmare.goto(url)
                 .evaluate(() => document.querySelector('body').outerHTML)
                 .then(function (html) {
                    let $ = cheerio.load(html);
                    let movie = $('div.lister-list > .lister-item:first-child')                    
                    let data = {
                        image: $(movie).find('.lister-item-image a img').attr('src'),
                        link: $(movie).find('.lister-item-image a').attr('href'),
                        title: $(movie).find('h3.lister-item-header a').text(),
                        rating: $(movie).find('.ratings-bar strong').text(),
                        runtime: $(movie).find('.runtime').text(),
                        genre: $(movie).find('.genre').text(),
                        desc: $(movie).find('.lister-item-content p:nth-of-type(2)').text(),
                    }
                    return res.send({data: data});                        
                 })
                 .catch(function (error) {
                    console.error('Error:', error);
                    res.send({ message: "Error", error: error })                    
                 });

	} catch (err) {
        console.log(err)
		res.send({ message: "Error", error: err })
	}
})


module.exports = router;
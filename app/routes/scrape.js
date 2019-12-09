const express = require('express'),
      router = express.Router(),
      rp = require('request-promise'),      
      cheerio = require('cheerio');

router.get('/movie', (req, res, next) => {
    try {
        const category = req.query.category;
        const sort = req.query.sort;
        let rand = Math.floor(Math.random() * 10) + 1;
        const url = `https://www.imdb.com/search/title/?title_type=feature&num_votes=25000,&genres=${category}&sort=${sort}&start=${rand}`

        rp(url)
            .then(function (html) {
                let $ = cheerio.load(html);
                let link = $('div.lister-list > .lister-item:first-child').find('.lister-item-image a').attr('href');
                    link = 'https://www.imdb.com' + link;

                rp(link).then(function (movieHtml) {
                        let $ = cheerio.load(movieHtml);
                        let movie = $('#main_top');
                        let data = {
                            image: $(movie).find('.poster img').attr('src'),
                            link: link,
                            title: $(movie).find('.title_wrapper h1').text(),
                            subtext: $(movie).find('.subtext').text(),
                            desc: $(movie).find('.plot_summary .summary_text').text(),
                        }

                        return res.send({data: data});                        
                    })
                    .catch(function (err) {
                        console.log(err)
                    });
            })
            .catch(function (err) {
                console.log(err)
            });
    } catch (err) {
        console.log(err)
        res.send({ message: "Error", error: err })
    }
})


module.exports = router;
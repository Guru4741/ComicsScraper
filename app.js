const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

request('http://www.sjcomics.com/chacha-chaudhary-aur-aaj-ka-robinhood/', function (error, response, body) {
    if (error) {
        console.log('Error : ', error);
    } else {
        const $ = cheerio.load(body);
        const images = [];
        $('img.attachment-thumbnail').each(function (i, elem) {
            const image = $(this).attr('src').replace(/'/g, "");
            const queryStringIndex = image.indexOf('?');
            images[i] = image.substring(0, queryStringIndex);
        })

        //Consoling the images array
        console.log(images);
    }
});
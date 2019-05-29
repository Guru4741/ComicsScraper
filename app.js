var fs = require('fs')
var request = require('request-promise');
var PDFDocument = require('pdfkit');
const rp = require('request-promise');
const cheerio = require('cheerio');

const doc = new PDFDocument;
const images = [];

const comicsName = '';

doc.pipe(fs.createWriteStream(`${comicsName}.pdf`));

function getComics() {

    rp({
        uri: `http://www.sjcomics.com/${comicsName}/`,
        timeout: 60000
    })
        .then(function (data) {
            const $ = cheerio.load(data);

            $('img').each(function (i, elem) {

                if ($(this).attr('class') !== undefined) {

                    if ($(this).attr('class').match(/^wp-image-/)) {

                        const image = $(this).attr('src').replace(/'/g, "");
                        const queryStringIndex = image.indexOf('?');
                        images[i] = image.substring(0, queryStringIndex);
                    }
                    if ($(this).attr('class').match(/^attachment-thumbnail/)) {

                        const image = $(this).attr('src').replace(/'/g, "");
                        const queryStringIndex = image.indexOf('?');
                        images[i] = image.substring(0, queryStringIndex);
                    }
                }
            })
            console.log(images);
            downloadImgs(images);
        })
        .catch(function (err) {
            console.log(err)
        })
}

function downloadImgs(imageurls) {
    var promises = [];
    for (var i = 0; i <= imageurls.length; i++) {

        if (typeof imageurls[i] !== "undefined") {
            img = './images/' + i + '.jpg';
            let req = request(imageurls[i]);
            req.pipe(fs.createWriteStream(img));
            promises.push(req);
        }

    }

    Promise.all(promises).then(function (data) {
        images.forEach((each, index) => {
            doc.image(`./images/${index}.jpg`, 0, 0, { fit: [816, 816] }).addPage()
        })
        doc.end();
    });


};

getComics();



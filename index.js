const fs = require('fs-extra');
const hbs = require('handlebars');
const path = require('path');
const puppeteer = require('puppeteer');
const data = require('./database.json');
const moment = require('moment');

const compile = async function(templateName, data) {
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');
    console.log(data);
    
    const template = hbs.compile(html)
    return template(data);
};

hbs.registerHelper('dateFormat', function(value, format) {
    return moment(value).format(format);
});

(async function() {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('shot-list', data);
        console.log(content);
        

        await page.setContent(content);
        await page.emulateMediaType('screen');
        await page.pdf({
            path: 'mypdf.pdf',
            format: 'A4'
        });

        console.log("done");
        
        await browser.close();
        process.exit();
    } catch (error) {
        console.error(error);
    }
})();

const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules.js/replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tmplOverview = fs.readFileSync(`${__dirname}/templates/tmpl-overview.html`, 'utf-8');
const tmplProduct = fs.readFileSync(`${__dirname}/templates/tmpl-product.html`, 'utf-8');
const tmplCard = fs.readFileSync(`${__dirname}/templates/tmpl-card.html`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true}));

const server = http.createServer((req, res) => {
    const { query, pathname} = url.parse(req.url, true)

//Overview Page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})

       const cardsHtml = dataObj.map(el => replaceTemplate(tmplCard, el)).join('');
       const output = tmplOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.end(output);
//Product Page
    } else if(pathname === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemplate(tmplProduct, product);

        res.end(output);
//API        
    } else if(pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);
//Not Found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello world'

        });
        res.end('<h1>Page not found!</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
  });
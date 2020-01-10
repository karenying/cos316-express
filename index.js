const express = require('express');
var mcache = require('memory-cache');
const app = express();
const port = 3000

var cache = (duration) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cachedBody = mcache.get(key)
        if (cachedBody) {
            res.send(cachedBody)
            return
        } else {
            res.sendResponse = res.send
            res.send = (body) => {
                mcache.put(key, body, duration);
                res.sendResponse(body)
            }
            next()
        }
    }
}

app.get('/', cache(10000), (req, res) => {
    setTimeout(() => {
        res.send('Hello world!');
    }, 5000)
});

app.listen(port, () => console.log('Listening on port 3000...'));
import MergeImages from 'merge-images-v2'
import Express from 'express'
const App = Express()
import { createWriteStream, unlink } from 'fs'
import Canvas from 'canvas'
import Jimp from 'jimp'
import { resolve as _resolve } from 'path'
import Axios from 'axios'
import { unescape } from 'querystring'

const IMAGE_WIDTH = 400
const IMAGE_X = 82
const IMAGE_Y = 230
const TEXT_MARGIN = 20
const TEXT_X = 82
const TEXT_Y = 646
const FONT_SIZE = 16
const PORT = 3000

const mime = {
    png: 'image/png'
}

async function downloadImage(url, path) {
    const writer = createWriteStream(path)
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    })
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

App.get('/wantedframe', async function (req, res) {
    try {
        let message = req.query.message || ''
        let imageWidth = req.query.imageWidth || IMAGE_WIDTH
        let imageX = req.query.imageX || IMAGE_X
        let imageY = req.query.imageY || IMAGE_Y
        let textMargin = req.query.textMargin || TEXT_MARGIN
        let textX = req.query.textX || TEXT_X
        let textY = req.query.textY || TEXT_Y
        let fontSize = req.query.fontSize || FONT_SIZE
        let imagePath = _resolve(__dirname, 'media', 'picture-' + new Date().getTime())

        await downloadImage(unescape(req.query.uri), imagePath)

        let b64 = await MergeImages([
            { src: _resolve(__dirname, 'media', 'wanted-frame.png'), x: 0, y: 0 },
            { src: imagePath, x: imageX, y: imageY }
        ], { Canvas: Canvas, format: 'image/png' })
        let mergedImage = new Buffer.from(b64.split('base64,').pop(), 'base64')
        let jimpMergedImage = await Jimp.read(mergedImage)
        let font = await Jimp.loadFont(Jimp['FONT_SANS_' + fontSize + '_BLACK'])
        let bufferedImageWithText = await jimpMergedImage.print(font, textX, textY, message, imageWidth - textMargin).getBufferAsync(mime.png)
        res.writeHead(400, {
            'Content-Type': mime.png,
            'Content-Length': bufferedImageWithText.length
        })
        res.end(bufferedImageWithText)

        // cleanup
        unlink(_resolve(imagePath), async (err) => { console.log(err) })
    }
    catch (err) {
        console.log(err)
    }
})

App.listen(PORT, function () {
    console.log('Listening ' + PORT)
})

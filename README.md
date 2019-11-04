# Wanted Frame
Puts a wanted frame on a given static encoded url image and allows to add text and setup a few things.

### Install
`git clone https://github.com/lcassa/wanted-poster.git`

`npm install`

`npm start`

A server at `http://localhost:3000` with the route `/wantedframe` is available to frame your images.

### Setup

The wanted frame is 564 × 793 pixels that lives in the server side. By sending the `uri` as a `GET` http request is enough to get a resulting image.

### Parameters

`uri` the *encoded* uri to the static image 
`message` the *encoded* message to be on top of the image
`imageWidth` the width of the incoming image to adjust size etc
`imageX` the X position you want the incoming image to be placed on the wanted frame
`imageY` the Y position you want the incoming image to be placed on the wanted frame
`textMargin` margin to start the text
`textX` the X position you want the text to be placed on the wanted frame
`textY` the X position you want the text to be placed on the wanted frame
`fontSize` the size of the font, limited to  8, 10, 12, 14, 16, 32, 64 and 128
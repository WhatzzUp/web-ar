# web-ar

## OpenCV - WASM
OpenCV 4.4 is already compiled and located under "static/opencv.js". Please dont be confused by .js, wasm code is included in opencv.js as a base64 encoded string
### Change opencv version
Its not neccessary to build opencv by your own, just download a pre-compiled version from https://docs.opencv.org/{opencv-version}/opencv.js e.g. https://docs.opencv.org/4.4.0/opencv.js

### Compile 
May you have some special case to build a version by your own, take a look on following instructions:

To compile OpenCV to webassembly we can follow the official documentation at: https://docs.opencv.org/3.4.10/d4/da1/tutorial_js_setup.html | Building OpenCV.js with Docker

1. You need docker installed: https://docs.docker.com/get-docker/
2. Run script:
   1. Mac/Linux: ```npm run openCV:mac```
   2. Window: ```npm run openCV:windows```
Previous scripts clone and compile from official openCV repo on Github.
It takes up to 30 minutes till compiled version is ready to use in js - based on your internet connection and cpu.
You can find opencv.js under "static/opencv.js" and can remove "opencv" folder on root if compilation has been finished


## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

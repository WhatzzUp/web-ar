
# emotion-detection
Try to combine emotion-detection (computer vision) with webAR and webassembly.
To combine these technologies its not neccessary to use vue, it also works on react, angular and vanilla js - just to anger my mentor Basti Springer, it was written in vue ;-)

## Compile OpenCV into Webassembly
To compile OpenCV to webassembly we can follow the official documentation at: https://docs.opencv.org/3.4.10/d4/da1/tutorial_js_setup.html | Building OpenCV.js with Docker
OpenCV 3.4 is already compiled and located under "static/opencv.js". If you wanna compile a new version, follow these next steps:

1. You need docker installed: https://docs.docker.com/get-docker/
2. Run script:
   1. Mac/Linux: npm run build:openCV:mac
   2. Window: npm run build:openCV:windows
Previous scripts clone and compile from official openCV repo on Github.
It takes up to 30 minutes till compiled version is ready to use in js - based on your internet connection and cpu.
You can find opencv.js under "static/opencv.js" and can remove "opencv" folder on root if compilation has been finished


## Performance
To increase performance a some major points were integrated like:

### WebAssembly
WASM gives a perfect environment to run opencv 
### Web-Worker
OpenCV´s function are very expensive, combined with singled threaded javascript, its important to avoid blocking ui - here comes webworker.
Running in a separated Thread, all expensive jobs can be calculated by a webworker to avoid blocking ui.
Webworker script is located at "static"
### Service-Worker
Everyone who has worked with PWA (progressive web app) before knows: Service-Worker are neccessary for caching and offline functionality.
In our case, we use service-worker to cache our 3D models

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

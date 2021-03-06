# build.sh is created and teste under mac

mkdir opencv_build
cd opencv_build

# clone opencv repo
git clone --branch 4.5.1 --depth 1 https://github.com/opencv/opencv.git
# clone opencv contrib repo
git clone --branch 4.5.1 --depth 1 https://github.com/opencv/opencv_contrib.git

# docker run --rm --workdir /code -v "$PWD":/code -v "$PWD/opencv_contrib":/contrib "trzeci/emscripten:sdk-tag-1.38.32-64bit" python ./opencv/platforms/js/build_js.py build --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=/contrib/modules"
# Build
# docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk:2.0.10 emcmake python3 ./opencv/platforms/js/build_js.py build_js --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules/face"


# docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) emscripten/emsdk:2.0.10 emcmake python3 ./node_modules/opencv-build/opencv/platforms/js/build_js.py build_js --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=./opencv_contrib/modules"

docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) -v "$PWD/opencv_contrib":/contrib emscripten/emsdk:2.0.10 emcmake python3 ./opencv/platforms/js/build_js.py build_js --build_wasm --simd --threads --build_loader --build_flags "-s WASM=1 -s WASM_ASYNC_COMPILATION=0 -s SINGLE_FILE=0" --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=/contrib/modules/"
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) -v "$PWD/opencv_contrib":/contrib emscripten/emsdk:2.0.10 emcmake python3 ./opencv/platforms/js/build_js.py build_js --build_loader --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=/contrib/modules/"
git clone --branch 4.5.1 --depth 1 https://github.com/opencv/opencv.git
# clone opencv contrib repo
git clone --branch 4.5.1 --depth 1 https://github.com/opencv/opencv_contrib.git
# Build
(
    # Add non async flag before compiling in the python build_js.py script
    docker run --rm --workdir /code -v "$PWD":/code -v "$PWD/opencv_contrib":/contrib "trzeci/emscripten:sdk-tag-1.39.4-64bit" python ./opencv/platforms/js/build_js.py build_wasm --build_wasm --build_test --build_flags "-s WASM=1 -s WASM_ASYNC_COMPILATION=0 -s SINGLE_FILE=0 " --cmake_option="-DOPENCV_EXTRA_MODULES_PATH=/contrib/modules/"
)

# Copy compilation result
cp -a ./opencv/build_wasm/ ./build_wasm

# Transpile opencv.js files
node test.js
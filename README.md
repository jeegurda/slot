# Slot

The build process is extremely lightweight and fast. Shouldn't take more than a few seconds. It's required to build files from the `./src` directory.

## Build

1. Install [Node.js](https://nodejs.org/)

2. Run
    ```sh
      npm i
      npm run build
    ```

3. Serve `./build` directory


## Development
1. Install [Node.js](https://nodejs.org/)
2. Run
    ```sh
    npm i
    ```

3. Run
    ```sh
    npm run watch-css
    ```
    to watch and rebuild `./src/styles` files

4. Run
    ```sh
    npm run watch-js
    ```
    to watch and rebuild `./src/scripts` files

5. Run
    ```sh
    npm run serve
    ```
    to serve `./build` directory at http://localhost:5000/ru

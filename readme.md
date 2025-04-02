# Cube Explosion

An interactive 3D project for creating and manipulating a cube composed of various geometric shapes.

## Technical Requirements

1. Create an interface with 3 inputs for entering cube dimensions along X, Y, Z axes.
2. Add a "Generate" button to build a cube with the specified dimensions.
3. The cube should consist of random Three.js geometries (cubes, spheres, cylinders, etc.) sized 1x1x1 units.
4. Each geometric shape should have a random texture.
5. Add an "Explode" button that, when clicked, makes all elements smoothly fly apart in random directions.
6. Add a "Collect" button that, when clicked, returns all elements to their original positions.

## Technologies

- Three.js - library for working with 3D graphics
- Tween.js - library for creating smooth animations
- Lil-gui - library for creating user interfaces

## Setup
Download [Node.js](https://nodejs.org/en/download/).
Run this followed commands:

``` bash
# Install dependencies (only the first time)
npm install

# Run the local server at localhost:8080
npm run dev

# Build for production in the dist/ directory
npm run build
```

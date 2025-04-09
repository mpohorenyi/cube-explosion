# Cube Explosion

An interactive 3D cube explosion animation created with Three.js, Tween.js and TypeScript.

[![Live Demo](https://img.shields.io/badge/demo-live-green.svg)](https://cube-explosion.vercel.app/)

## 📋 Technical Requirements

1. Create an interface with 3 inputs for entering cube dimensions along X, Y, Z axes
2. Add a "Generate" button to build a cube with the specified dimensions
3. The cube should consist of random Three.js geometries (cubes, spheres, cylinders, etc.) sized 1x1x1 units
4. Each geometric shape should have a random texture
5. Add an "Explode" button that, when clicked, makes all elements smoothly fly apart in random directions
6. Add a "Collect" button that, when clicked, returns all elements to their original positions

## 🛠️ Technologies

- [Three.js](https://threejs.org/) - JavaScript 3D library
- [Tween.js](https://github.com/tweenjs/tween.js/) - Animation library
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [lil-gui](https://lil-gui.georgealways.com/) - Lightweight GUI library
- [Vite](https://vitejs.dev/) - Modern build tool

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/mpohorenyi/cube-explosion.git
cd cube-explosion
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## 🎮 Usage

1. Open the [demo](https://cube-explosion.vercel.app/)
2. Use sliders to adjust cube dimensions
3. Click "Generate" to create the cube
4. Use "Explode" and "Collect" buttons to control the animation

## 🏗️ Project Structure

```
cube-explosion/
├── src/
│   ├── classes/         # Classes for 3D object manipulation
│   ├── script.ts        # Main file
│   ├── style.css        # Styles
│   └── index.html       # HTML template
├── static/              # Static resources
├── dist/                # Build output
└── package.json         # Dependencies and scripts
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run linter
- `npm run format` - Format code
- `npm run type-check` - Run TypeScript type checking

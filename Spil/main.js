import { Application } from '../common/engine/Application.js';

import { GLTFLoader } from './GLTF/GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from './GameClasses/FirstPersonController.js';
import { Physics } from './GameClasses/Physics.js';
import { Scoring } from './GameClasses/Scoring.js';

class App extends Application {

    async start() {

        // default
        this.renderer = new Renderer(this.gl);       
        // default gltf loader to load images
        this.loader = new GLTFLoader();

        // loading proces
        //await this.loader.load('../common/models/rocks/rocks.gltf');

        // load set this a default scene scene
        await this.loader.load('./textures/map/map.gltf');
        
        // here we load it back
        this.scene = await this.loader.loadScene(this.loader.defaultScene);

        // the camera
        this.camera = await this.loader.loadNode('Camera');

        // just checks if camera exists
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

         if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.controller = new FirstPersonController(this.camera, this.gl.canvas, this.scene);

        this.physics = new Physics(this.scene);

        this.scoring = new Scoring(this.scene);

        // render scene
        this.renderer.prepareScene(this.scene);
    }

    update(time, dt) {
        this.controller.update(dt);
        this.physics.update(dt);
        this.scoring.update(dt);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

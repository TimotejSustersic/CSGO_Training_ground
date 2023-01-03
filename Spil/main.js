import { Application } from '../common/engine/Application.js';
import { mat4 } from '../../../lib/gl-matrix-module.js';

import { GLTFLoader } from './GLTF/GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from './GameClasses/FirstPersonController.js';
import { Physics } from './GameClasses/Physics.js';
import { Scoring } from './GameClasses/Scoring.js';
import { OrbitController } from '../common/engine/OrbitController.js';
import { Node } from '../common/engine/Node.js';


export class App extends Application {

    async start() {

        // default
        this.renderer = new Renderer(this.gl);       
        // default gltf loader to load images
        this.loader = new GLTFLoader();

        // loading proces
        //await this.loader.load('../common/models/rocks/rocks.gltf');

        // load set this a default scene scene
        await this.loader.load('./textures/scena/scena3.gltf');
        
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

        //light
        this.light = new Node();
        this.light.position = [0, 50, 0];
        this.light.color = [255, 255, 255];
        this.light.intensity = 5;
        this.light.attenuation = [1.0, 0.0, 0.0];

        this.scoring = new Scoring(this.scene);

        this.controller = new FirstPersonController(this.camera, this.gl.canvas, this.scene, this.scoring);

        this.physics = new Physics(this.scene, this.scoring);       

        // render scene
        this.renderer.prepareScene(this.scene);
    }

    update(time, dt) {
        this.controller.update(dt);
        this.physics.update(dt);
        this.scoring.update(dt);
    }

    render() {
        this.renderer.render(this.scene, this.camera, this.light);
    }

    resize(width, height) {
        this.camera.camera.aspect = width / height;
        this.camera.camera.updateProjectionMatrix();
    }

}

const canvas = document.querySelector('canvas');
export const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();

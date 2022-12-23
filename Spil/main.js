import { Application } from '../common/engine/Application.js';

import { GLTFLoader } from './GLTF/GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { FirstPersonController } from './GameClasses/FirstPersonController.js';
import { Physics } from './GameClasses/Physics.js';

class App extends Application {

    async start() {

        this.renderer = new Renderer(this.gl);       

        this.loader = new GLTFLoader();

        await this.loader.load('../common/models/rocks/rocks.gltf');
        await this.loader.load('./textures/map/map.gltf');
        

        this.scene = await this.loader.loadScene(this.loader.defaultScene);

        this.camera = await this.loader.loadNode('Camera');

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.controller = new FirstPersonController(this.camera, this.gl.canvas);

        this.physics = new Physics(this.scene);
        //this.camera.aspect = this.aspect;
        //this.camera.updateProjection();

        this.renderer.prepareScene(this.scene);
    }

    // update(time, dt) {
    //     this.controller.update(dt);
    // }

    update(time, dt) {
        //this.camera.update(dt);
        this.controller.update(dt);
        this.physics.update(dt);
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

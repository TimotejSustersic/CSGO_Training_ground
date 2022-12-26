import { Target } from './Target.js'

export class Scoring {

    constructor(scene) {
        this.scene = scene;

        this._targets = [];

        // get targets
        this.scene.traverse(node => {
            if (node instanceof Target) {                
                this._targets.push(node); 
            }
        });
    }

    update() {
        
    }

}
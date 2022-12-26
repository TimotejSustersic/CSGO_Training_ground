import { Node } from "../../common/engine/Node";

class Target extends Node {

}

export class Scoring {

    constructor(scene) {
        this.scene = scene;

        this._targets = [];
        
        // get bullets
        this.scene.traverse(node => {
            if (node.extraParams && node.extraParams.type == "target") {                
                this._targets.push(new Target(node)); 
            }
        });
    }

    hit(node) {

    }
}
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

        this.scoreHub = document.getElementById("score");
        this.TargetsHub = document.getElementById("targets");
        this.timeHub = document.getElementById("time");

        this.start = performance.now();
    }

    update() {

        this.scoreHub.innerHTML = 0;

        let time = performance.now() - this.start;
        let sec = Math.trunc(time/1000);
        let min = Math.trunc(sec/60);
        this.timeHub.innerHTML = min + ":" + (sec - min * 60) + ":";
        let milsec = (time - sec * 1000);
        if (milsec < 100) 
            this.timeHub.innerHTML += "0" + milsec;
        else if (milsec < 10) 
            this.timeHub.innerHTML += "00" + milsec;
        else
            this.timeHub.innerHTML += milsec;
    }

    get targets() {
        return this._targets;
    }

}
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
        
        this._targets[10].show();

        this.scoreHub = document.getElementById("score");
        this.targetsHit = 0;
        this.bulletsShot = 0;


        this.timeHub = document.getElementById("time");
        this.magHub =  document.getElementById("magazine");
        this.hubTopMess =  document.getElementById("targetHit");

        this.start = performance.now();
    }

    update() {

        if (this.bulletsShot > 0)              
            this.timeHub.innerHTML = this.getTime();        
        else
            this.start = performance.now();
    }

    getTime() {
        let timeMess = "";
        let time = performance.now() - this.start;
        let sec = Math.trunc(time/1000);
        let min = Math.trunc(sec/60);
        timeMess = min + ":" + (sec - min * 60) + ":";
        let milsec = (time - sec * 1000);
        if (milsec < 100) 
            timeMess += "0" + milsec;
        else if (milsec < 10) 
            timeMess += "00" + milsec;
        else
            timeMess += milsec;
        return timeMess;
    }

    get targets() {
        return this._targets;
    }

    topCenterMess(message) {
        this.hubTopMess.innerHTML = message;        
    }

    clearTopCenterMess() {
        setTimeout(() => this.hubTopMess.innerHTML = "", 3000);
    }

    reload() {
        this.hubTopMess.innerHTML = "3";
        setTimeout(() => {

            this.hubTopMess.innerHTML = "2";
            setTimeout(() => {

                this.hubTopMess.innerHTML = "1";
                setTimeout(() => this.hubTopMess.innerHTML = "", 1000);
            }
            , 1000);
            }
        , 1000);
    }

    reset() {
        this.targetsHit = 0;
        this.bulletsShot = 0;
        this.start = performance.now();
    }
    
    //this.hubScore.innerHTML = (parseInt(this.hubScore.innerHTML) + 1) + "";

    magSize(size, reload) {
        if (size == 0 && !reload)
            this.topCenterMess('"R" to reload');
        this.magHub.innerHTML = size + "/7";
    }

    scoreAddFire() {        
        this.bulletsShot++;
        this.updateScore();
    }

    scoreAddHit() {
        this.targetsHit++;
        this.updateScore();

        if (this.targetsHit == 3) {
            let message = this.targetsHit + "/" + this.bulletsShot + " in " + this.timeHub.innerHTML;
            this.topCenterMess(message);
            this.reset();
            this.updateScore();
            this.timeHub.innerHTML = this.getTime();
            setTimeout(() => this.topCenterMess('"R" to reload'), 7000);
        }
        else {
            this.clearTopCenterMess();
        }
    }

    updateScore() {
        this.scoreHub.innerHTML = this.targetsHit + "/" + this.bulletsShot;
    }
}

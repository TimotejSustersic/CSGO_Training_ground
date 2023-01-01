import { Node } from "../../common/engine/Node.js";
import { vec3, mat4 } from '../../lib/gl-matrix-module.js';

// returned message status
const Status = {
    Missed: "- 20 (Missed)",
    Headshot: "+ 100 (Headshot)",
    Nutshot: "+ 200 (Nutshot)",
    pts10: "+ 10"
  };

export class Target extends Node {

    constructor(options) {
        super(options);

        this._hitPoints = 0;

        // if its free to be displayed
        this._free = true;

        this._status = null;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        this._status = value;
    }

    show() {
        this._free = false;
        this.translation = [this.translation[0], this.translation[1]+1, this.translation[2]]; 
    }
    
    hit(node) {
        this.hitPoints(10);
        this.translation = [this.translation[0], this.translation[1]-1, this.translation[2]];
        this.free(true);
    }

    getValue(node) {
        // glede na lokacijo noda in te tarce zracuni kam jo je zadel
        // if miss this.status = missed;
        //...
    }

    set hitPoints(value) {
        this._hitPoints += value;
    }

    /**
    * @param {boolean} status
    */
    set free(status) {
        this._free = status;
    }

    get free() {
        return this._free;
    }
}
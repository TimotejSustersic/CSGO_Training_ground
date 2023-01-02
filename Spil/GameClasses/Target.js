import { Node } from "../../common/engine/Node.js";

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
        this.free = false;
        this.translation = [this.translation[0], this.translation[1]+1, this.translation[2]]; 
    }
    
    hit(node) {
        this._hitPoints += 10;
        this.translation = [this.translation[0], this.translation[1]-1, this.translation[2]];
        this.free = true;
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
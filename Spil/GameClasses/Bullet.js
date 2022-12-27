import { Node } from '../../common/engine/Node.js';
import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class Bullet extends Node {

    constructor(options) {
        super(options);

        // if its free to be shot
        this._free = true;

        // whlle fired
        this._active = false;

        // default position to return to after shooting is done
        this.defaultPosition = vec3.clone(this.translation)

        // direction of the bullet once fired
        this._direction = vec3.fromValues(0, 0, 0);

        this.velocity = this.extraParams.velocity
            ? this.extraParams.velocity
            : 200;
    }

    update() {

        // TODO: bullet move to your direcion with your speed
        // verjeten => set translation vec3.add(translation, direction * velocity)
    }

    set direction(direction) {
        this._direction = direction;
    }

    set location(location) {
        this.translation(location);
    }

    reset() {
        this.free(true);
        this.active(false);
        this.location(this.defaultPosition);
    }

    hit() {
        this.active(false);
        this.location(this.defaultPosition);
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

    /**
     * @param {boolean} status
     */
    set active(status) {
        this._active = status;
    }

    get active() {
        return this._active;
    }
}
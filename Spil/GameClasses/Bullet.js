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

        this._yaw;
        this._pitch;

        this.velocity = vec3.create();
        this.acceleration = 0.8;
        this.maxSpeed = 0.8;
        this.speedMultiplier = 0.1;
    }

    update() {
        this.bulletTransformation(null);
    }

    bulletTransformation(margin) {

        let speedMul = this.speedMultiplier;
        if (margin != null)
            speedMul = margin;
        //bullet direction
        const acc = vec3.create();
        const cosZ = Math.cos(this.yaw);
        const sinX = Math.sin(this.yaw);
        const sinY = Math.sin(this.pitch);
        const direction = [-sinX, sinY, -cosZ]; // 1. x(desno), 2. y(gor), 3. z(nazaj)
        vec3.add(acc, acc, direction);

        // Update velocity based on acceleration (first line of Euler's method).
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, speedMul * this.acceleration);
                
        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed)
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);   

        // Update translation based on velocity (second line of Euler's method).
        this.translation = vec3.scaleAndAdd(vec3.create(),
        this.translation, this.velocity, speedMul);
    }

    get yaw() {
        return this._yaw
    }

    get pitch() {
        return this._pitch
    }

    set yaw(yaw) {
        this._yaw = yaw;
    }

    set pitch(pitch) {
        this._pitch = pitch;
    }

    reset() {
        this.free = true;
        this.active = false;
        this.translation = this.defaultPosition;
    }

    hit() {
        this.active = false;
        this.translation = this.defaultPosition;
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
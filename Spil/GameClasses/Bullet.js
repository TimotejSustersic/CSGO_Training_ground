import { Node } from '../../common/engine/Node.js';
import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class Bullet extends Node {

    constructor(options) {
        super(options);

        // if its free to be shot
        this._free = true;

        // whlle fired
        this._active = false;

        this._direction;

        // default position to return to after shooting is done
        this.defaultPosition = vec3.clone(this.translation)

        this.velocity = vec3.create();
        this.acceleration = 0.8;
        this.maxSpeed = 0.1;
        this.speedMultiplier = 0.6;
    }

    update() {
        this.bulletTransformation(null);
    }

    bulletTransformation(margin) {

        let speedMul = this.speedMultiplier;
        if (margin != null)
            speedMul = margin;

        const acc = vec3.create();
        vec3.add(acc, acc, this._direction);

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

    setDirection(yaw, pitch) {

        //bullet direction        
        const cosZ = Math.cos(yaw);
        const sinX = Math.sin(yaw);
        const sinY = Math.sin(pitch);
        this._direction = [-sinX, sinY, -cosZ]; // 1. x(desno), 2. y(gor), 3. z(nazaj)
    }

    get direction() {
        return this._direction;
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
        this.translation = vec3.clone(this.defaultPosition);
    }

    hit() {
        this.active = false;
        this.translation = vec3.clone(this.defaultPosition);
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
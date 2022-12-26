import { Node } from '../../common/engine/Node.js';
import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

class Bullet extends Node {

    constructor(node) {

        this.bullet = node;

        // if its free to be shot
        this._free = true;

        // default position to return to after shooting is done
        this.defaultPosition = vec3.clone(node._translation)

        // direction of the bullet once fired
        this._direction = vec3.fromValues(0, 0, 0);

        this.velocity = this.bullet.extraParams.velocity
            ? this.bullet.extraParams.velocity
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
        this.bullet.translation(location);
    }

    reset() {
        this.free(true);
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
}

export class Magazine {

    constructor(scene) {
        this.scene = scene;

        this._bullets = [];
        
        // get bullets
        this.scene.traverse(node => {
            if (node.extraParams && node.extraParams.type == "bullet") {                
                this._bullets.push(new Bullet(node)); 
            }
        });
    }

    update() {
        for (let bullet of this._bullets) 
            if (!bullet.free)
                bullet.update();
    }

    // reload bo delu cez 5 sekund tolk da se vsi metki nekam zabijejo
    reload() {
        setTimeout(() => {  
            for (let bullet of this._bullets)  {
                bullet.reset();
            }
        }, 5000);
    }

    fire(location, direcion) {

        let newBullet = this.availableBullet();

        if (newBullet) {
            newBullet.location(location);
            newBullet.direction(direcion);
            newBullet.free(false);
        }        
    }

    // in case of collision discard bullet by chnging its position outside the map and make it free
    discardBullet(node) {
        for (let bullet of this._bullets) {
            if (bullet == node) {
                bullet.free(true);

            }
        }
    }

    get magSize() {

        let size = 0;
        for (let bullet of this._bullets)
            if (bullet.free)
                size++;
        return size;
    }

    get availableBullet() {

        for (let bullet of this._bullets) {
            if (bullet.free) {
                bullet.free(false);
                return bullet;
            }                
        }
        return null;
    }

    get bullets() {
        return this._bullets;
    }
}
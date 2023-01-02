import { Bullet } from "./Bullet.js";
import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class Magazine {

    constructor(scene, scoring) {
        this.scene = scene;

        this._bullets = [];
        
        // get bullets
        this.scene.traverse(node => {
            if (node instanceof Bullet) {                
                this._bullets.push(node); 
            }
        });

        this.scoring = scoring;
        this.reloading = false ;
    }

    // updates every free node and takes caro of hub presentation of magazine
    update() {

        let freeMagSize = 0;

        for (let bullet of this._bullets) {
            if (!bullet.free && bullet.active) 
                bullet.update();
            else if (bullet.free)
                freeMagSize++;
        }

        this.scoring.magSize(freeMagSize, this.reloading);               
    }

    // reload bo delu cez 3 sekunde tolk da se vsi metki nekam zabijejo
    reload() { 
        if (this.magSize < 7 && !this.reloading) {
            this.scoring.reload()
            this.reloading = true;
            setTimeout(() => {  
                for (let bullet of this._bullets)
                    bullet.reset();
                this.reloading = false;
            }, 3000);
        }
    }

    fire(location, yaw, pitch) {

        if (!this.reloading) {

            let newBullet = this.availableBullet;

            if (newBullet) {
                newBullet.translation = location;
                newBullet.yaw = yaw;
                newBullet.pitch = pitch;
                newBullet.free = false;
                newBullet.active = true;

                // so that bullet doesnt start from your face or behind you
                //newBullet.bulletTransformation(1);
                this.scoring.scoreAddFire();
            }    
        }    
    }

    // in case of collision discard bullet by changing its position outside the map and make it free
    discardBullet(node) {
        for (let bullet of this._bullets) 
            if (bullet == node) 
                bullet.free = true;
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
                bullet.free = false;
                return bullet;
            }                
        }
        return null;
    }

    get bullets() {
        return this._bullets;
    }
}
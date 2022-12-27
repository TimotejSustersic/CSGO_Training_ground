import { Bullet } from "./Bullet.js";

export class Magazine {

    constructor(scene) {
        this.scene = scene;

        this._bullets = [];
        
        // get bullets
        this.scene.traverse(node => {
            if (node instanceof Bullet) {                
                this._bullets.push(node); 
            }
        });

        this.hub = document.getElementById("magazine");
    }

    // updates every free node and takes caro of hub presentation of magazine
    update() {

        let freeMagSize = 0;

        for (let bullet of this._bullets) {
            if (!bullet.free && bullet.active) 
                bullet.update();
            else
                freeMagSize++;
        }

        this.hub.innerHTML = freeMagSize + " / " + this.bullets.length;
    }

    // reload bo delu cez 3 sekunde tolk da se vsi metki nekam zabijejo
    reload() {
        setTimeout(() => {  
            for (let bullet of this._bullets)  {
                bullet.reset();
            }
        }, 3000);
    }

    fire(location, direcion) {

        let newBullet = this.availableBullet;

        if (newBullet) {
            newBullet.location(location);
            newBullet.direction(direcion);
            newBullet.free(false);
            newBullet.active(true);
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
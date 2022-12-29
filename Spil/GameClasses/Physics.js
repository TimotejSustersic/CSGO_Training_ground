import { vec3, mat4 } from '../../lib/gl-matrix-module.js';
import { Bullet }  from './Bullet.js';
import { Target }  from './Target.js';

export class Physics {

    constructor(scene) {
        this.scene = scene;
    }

    update(dt) {
        
        // object collision
        this.scene.traverse(node => {            
            
            // check if this node can have collision
            if (node.extraParams
                && node.extraParams.min !== undefined && node.extraParams.max !== undefined                 
                ) {

                // Check for collision with every other node.
                this.scene.traverse(other => {  
                    
                    // not the same, other has collision
                    if (node !== other 
                        && other.extraParams                        
                        && other.extraParams.min !== undefined && other.extraParams.max !== undefined
                    ) {
                        // if bullet and other not camera and other not also a bullet
                        if (node instanceof Bullet && !node.free && node.active) {
                            if (!other.camera && !(other instanceof Bullet)) // only if other is wall or target
                                this.resolveBulletCollision(node, other);                            
                        }
                        else if (node.extraParams.velocity) { // If node is moving                          
                        
                            this.resolveCollision(node, other);                        
                        }
                    }
                });
            }
        });
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    getTransformedAABB(node) {

        // Transform all vertices of the AABB from local to global space.
        var transform = node.globalMatrix;
        const min = node.extraParams.min;
        const max = node.extraParams.max;
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(v, v, transform));

        // Find new min and max by component.
        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
        return { min: newmin, max: newmax };
    }

    resolveCollision(a, b) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);

        // #__#
        
        if (a.camera) {
        aBox.min[1] -= 1;
        }

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);

        if (!isColliding) {
            return;
        }

        // Move node A minimally to avoid collision.
        const diffa = vec3.sub(vec3.create(), bBox.max, aBox.min);
        const diffb = vec3.sub(vec3.create(), aBox.max, bBox.min);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }

        vec3.add(a._translation, a._translation, minDirection);
        //a.updateMatrix();

        if (a.camera) {
            if (minDirection != 0) {
                a.extraParams.ground = a.translation[1];
                //console.log(a.extraParams.ground);
            }
        }
    } 
    
    resolveBulletCollision(bullet, other) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(bullet);
        const bBox = this.getTransformedAABB(other);

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);

        if (!isColliding) {
            return;
        }
        // if there is collision it can be with a wall or target

        //bullet is always hit, which makes it not active anymore, it still isn't free(because of magazine) and its placed in default spot
        bullet.hit();

        // if other node was target we have to delete it and change score
        if (other instanceof Target)
            other.hit(bullet);
    }

}

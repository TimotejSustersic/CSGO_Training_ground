import { vec3, mat4 } from '../../lib/gl-matrix-module.js';
import { Bullet }  from './Magazine';
import { Target }  from './Target';

export class Physics {

    constructor(scene) {
        this.scene = scene;
    }

    update(dt) {
        
        // obect collision
        this.scene.traverse(node => {            
            
            if (node.extraParams) {
                if (node instanceof Bullet) {
                    
                    // Check for collision with every other node.
                    this.scene.traverse(other => {
                        if (other instanceof Target)
                            this.resolveBulletCollision(node, other);
                    });
                }
                else if (node.extraParams.velocity) { // Move every node with defined velocity.
                    
                    // Check for collision with every other node.
                    this.scene.traverse(other => {
                        if (node !== other 
                            && other.extraParams
                            && node.extraParams.min !== undefined && node.extraParams.max !== undefined 
                            && other.extraParams.min !== undefined && other.extraParams.max !== undefined
                            ) {
                            this.resolveCollision(node, other);
                        }
                    });
                }
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
    } 
    
    resolveBulletCollision(bullet, target) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(bullet);
        const bBox = this.getTransformedAABB(target);

        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);

        if (!isColliding) {
            return;
        }

        bullet.reset();
        target.hit(bullet);
    }

}

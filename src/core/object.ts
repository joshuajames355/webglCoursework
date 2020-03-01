import { vec3, quat, mat4 } from "gl-matrix";
import RenderableComponent from "./renderableComponent";

//Any object with a Position.
export default class GameObject
{
    private position : vec3 = vec3.create();
    private scale : vec3 = vec3.fromValues(1,1,1);
    private rotation : quat = quat.create();

    protected modelMat : mat4 =  mat4.create();
    protected modelMatInverse : mat4 = mat4.create();

    protected hasPosChanged : boolean = true;
    private components : RenderableComponent[] = [];

    protected generateModelMatrix()
    {
        mat4.fromRotationTranslationScale(this.modelMat, this.rotation, this.position, this.scale);
        mat4.invert(this.modelMatInverse, this.modelMat);
    }

    tick(deltaTime : number)
    {

    }

    addComponent(component : RenderableComponent)
    {
        this.components.push(component);
    }
    getComponents() : RenderableComponent[]
    {
        return this.components;
    }
    
    getModelMatrix() : mat4
    {
        if(this.hasPosChanged)
        {
            this.generateModelMatrix();
            this.hasPosChanged = false;
        }
        return this.modelMat;
    }
    getModelMatrixInverse() : mat4
    {
        if(this.hasPosChanged)
        {
            this.generateModelMatrix();
            this.hasPosChanged = false;
        }
        return this.modelMatInverse; 
    }

    setScale(scale : number)
    {
        this.scale = vec3.fromValues(scale, scale, scale);
        this.hasPosChanged = true;
    }
    setScaleVector(scale : vec3)
    {
        this.scale = scale;
        this.hasPosChanged = true;
    }
    setPosition(newPos : vec3)
    {
        this.position = newPos;
        this.hasPosChanged = true;
    }

    move(delta : vec3) //moves an object by a set amount
    {
        vec3.add(this.position, this.position, delta);
        this.hasPosChanged = true;
    }
    moveForward(amount : number)
    {
        var forward = vec3.fromValues(0, 0, -amount);
        vec3.transformQuat(forward, forward, this.rotation);
        this.move(forward);
    }
    moveRight(amount : number)
    {
        var right = vec3.fromValues(-amount, 0, 0);
        vec3.transformQuat(right, right, this.rotation);
        this.move(right);
    }
    addAngle(delta : quat)
    {
        quat.mul(this.rotation, this.rotation, delta);
        this.hasPosChanged = true;
    }  
    rotateX(degrees : number)
    {
        quat.rotateX(this.rotation, this.rotation, degrees * 0.01745329251);
        quat.normalize(this.rotation, this.rotation);
        this.hasPosChanged = true;
    }
    rotateY(degrees : number)
    {
        quat.rotateY(this.rotation, this.rotation, degrees * 0.01745329251);
        quat.normalize(this.rotation, this.rotation);
        this.hasPosChanged = true;
    }
    rotateZ(degrees : number)
    {
        quat.rotateZ(this.rotation, this.rotation, degrees * 0.01745329251);
        quat.normalize(this.rotation, this.rotation);
        this.hasPosChanged = true;
    }
}
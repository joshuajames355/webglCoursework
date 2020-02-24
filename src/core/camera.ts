import { mat4 } from "gl-matrix";
import GameObject from "./object";

export abstract class Camera extends GameObject
{
    abstract getProjectionMatrix() : mat4;
    abstract getViewMatrix() : mat4;
}

export default class PerspectiveCamera extends Camera
{
    protected projectionMatrix : mat4 = mat4.create();

    width : number;
    height : number;
    fov : number;
    nearPlane : number;
    farPlane : number;

    constructor(width : number = 640, height : number = 480, fov: number = 90, nearPlane : number = 0.1, farPlane: number = 100)
    {
        super();

        this.width = width;
        this.height = height;
        this.fov = fov;
        this.nearPlane = nearPlane;
        this.farPlane = farPlane;

        mat4.perspective(this.projectionMatrix, fov * 0.01745329251, width/height, nearPlane, farPlane);
    }

    getProjectionMatrix() : mat4
    {
        return this.projectionMatrix;
    }

    getViewMatrix() : mat4
    {
        return this.getModelMatrixInverse();
    }
}
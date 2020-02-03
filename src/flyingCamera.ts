import PerspectiveCamera from "./camera";
import { vec3 } from "gl-matrix";

export default class FlyingCamera extends PerspectiveCamera
{
    constructor(width : number = 640, height : number = 480, fov: number = 45, nearPlane : number = 0.1, farPlane: number = 100)
    {
        super(width, height, fov, nearPlane, farPlane);

        window.addEventListener("keydown", this.onKeyDown.bind(this));
    }

    onKeyDown(event : KeyboardEvent)
    {
        switch(event.key)
        {
            case "w":
                this.move(vec3.fromValues(0, 0, -1));
                break;
            case "s":
                this.move(vec3.fromValues(0, 0, 1));
                break;
            case "a":
                this.move(vec3.fromValues(-1, 0, 0));
                break;
            case "d":
                this.move(vec3.fromValues(1, 0, 0));
                break;
            case " ":
                this.move(vec3.fromValues(0, 1, 0));
                break;
            case "Control":
            case "Shift":
                this.move(vec3.fromValues(0, -1, 0));
                break;
        }
    }
}
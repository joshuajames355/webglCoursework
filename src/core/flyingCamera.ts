import PerspectiveCamera from "./camera";
import { vec3 } from "gl-matrix";

export default class FlyingCamera extends PerspectiveCamera
{
    movementSensitivity : number;
    aimSensitivity : number;
    constructor(width : number = 640, height : number = 480, fov: number = 45, nearPlane : number = 0.1, farPlane: number = 100)
    {
        super(width, height, fov, nearPlane, farPlane);

        this.movementSensitivity = 1;
        this.aimSensitivity = 0.1;

        window.addEventListener("keydown", this.onKeyDown.bind(this));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
    }

    onKeyDown(event : KeyboardEvent)
    {
        switch(event.key)
        {
            case "w":
                this.moveForward(this.movementSensitivity);
                break;
            case "s":
                this.moveForward(-this.movementSensitivity);
                break;
            case "a":
                this.moveRight(this.movementSensitivity);
                break;
            case "d":
                this.moveRight(-this.movementSensitivity);
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

    onMouseMove(event : MouseEvent)
    {
        this.rotateY(-this.aimSensitivity * event.movementX);
        this.rotateX(-this.aimSensitivity * event.movementY);
    }
}
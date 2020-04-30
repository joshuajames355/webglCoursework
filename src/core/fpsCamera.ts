import PerspectiveCamera from "./camera";
import { vec3 } from "gl-matrix";

export default class FPSCamera extends PerspectiveCamera
{
    movementSensitivity : number;
    aimSensitivity : number;

    left : boolean = false;
    right : boolean = false;
    forward : boolean = false;
    back : boolean = false;

    pitch : number = 0;
    yaw : number = 0;

    maxPitch : number = 80;

    constructor(width : number = 640, height : number = 480, fov: number = 45, nearPlane : number = 0.1, farPlane: number = 100)
    {
        super(width, height, fov, nearPlane, farPlane);

        this.movementSensitivity = 8;
        this.aimSensitivity = 0.1;

        this.setRotationEuler(this.pitch, this.yaw, 0);

        window.addEventListener("keydown", this.onKeyDown.bind(this, true));
        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("keyup", this.onKeyDown.bind(this, false))
    }

    onKeyDown(isPressed : boolean, event : KeyboardEvent)
    {
        switch(event.key)
        {
            case "w":
                this.forward = isPressed;
                break;
            case "s":
                this.back = isPressed;
                break;
            case "a":
                this.left = isPressed;
                break;
            case "d":
                this.right = isPressed;
                break;
        }
    }

    onMouseMove(event : MouseEvent)
    {
        this.pitch = Math.min(this.maxPitch*2, Math.max(0, (this.pitch - this.aimSensitivity * event.movementY) + this.maxPitch)) - this.maxPitch;
        this.yaw = (this.yaw -this.aimSensitivity * event.movementX) % 360;

        this.setRotationEuler(this.pitch, this.yaw, 0);
    }

    tick(deltaTime : number)
    {
        if(this.forward && !this.back)
        {
            //get forward vector * sensitivity and deltatime 
            //projected onto xy
            var forward = vec3.fromValues(0, 0, -this.movementSensitivity * deltaTime);
            vec3.transformQuat(forward, forward, this.getRotation());
            var upComponent : vec3 = vec3.fromValues(0, vec3.dot(forward, vec3.fromValues(0,1,0)), 0);
            var forwardInPlane : vec3 = vec3.create();
            vec3.subtract(forwardInPlane, forward, upComponent)

            this.move(forwardInPlane);
        }
        if(!this.forward && this.back)
        {
            //get forward vector * sensitivity and deltatime 
            //projected onto xy
            var forward = vec3.fromValues(0, 0, this.movementSensitivity * deltaTime);
            vec3.transformQuat(forward, forward, this.getRotation());
            var upComponent : vec3 = vec3.fromValues(0, vec3.dot(forward, vec3.fromValues(0,1,0)), 0);
            var forwardInPlane : vec3 = vec3.create();
            vec3.subtract(forwardInPlane, forward, upComponent)

            this.move(forwardInPlane);
        }
        if(this.left && !this.right)
        {
            this.moveRight(this.movementSensitivity * deltaTime);
        }
        if(this.right && !this.left)
        {
            this.moveRight(-this.movementSensitivity * deltaTime);
        }
    }
}
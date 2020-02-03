import { mat4 } from "gl-matrix";
import GameObject from "./object";


//an abstract class Any object with a Position and Render Method.
export default abstract class RenderObject extends GameObject
{
    render(gl : WebGL2RenderingContext, viewMatrix : mat4, projectionMatrix : mat4)
    {
        return;
    }
}
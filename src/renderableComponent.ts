import { mat4, vec3 } from "gl-matrix";
import ShaderProgram from "./shaders";

//Has a shader and render function
//Designed to be combined via compisition with other components inside an object class
export default abstract class RenderableComponent
{
    shader : ShaderProgram;

    constructor(shader : ShaderProgram)
    {
        this.shader = shader;
    }

    render(gl : WebGL2RenderingContext, modelMatrix : mat4, viewMatrix : mat4, projectionMatrix : mat4)
    {
        var modelView : mat4 = mat4.create();
        mat4.mul(modelView, viewMatrix, modelMatrix);

        var modelViewProjection : mat4 = mat4.create();
        mat4.mul(modelViewProjection, projectionMatrix, modelView);

        this.shader.use(gl);
        this.shader.bindUniforms(gl, modelView, modelViewProjection);
        this.drawVertices(gl);
    }

    drawVertices(gl : WebGL2RenderingContext)
    {
        return;
    }
}
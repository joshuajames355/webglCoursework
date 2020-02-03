import { mat4 } from "gl-matrix";

export default class ShaderProgram
{
    program : WebGLProgram;
    vertexShader : WebGLShader;
    fragmentShader : WebGLShader;

    modelViewLoc : WebGLUniformLocation | null = null;
    modelViewProjectionLoc : WebGLUniformLocation | null = null;

    constructor(gl : WebGL2RenderingContext, vertexSource : string, shaderSource : string)
    {
        var newVertexShader = gl.createShader(gl.VERTEX_SHADER);
        if(newVertexShader == null)
        {
            throw "Failed to Create shader";
        }
        this.vertexShader = newVertexShader;
        gl.shaderSource(this.vertexShader, vertexSource);
        gl.compileShader(this.vertexShader);

        if(!gl.getShaderParameter(this.vertexShader, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(this.vertexShader));
            throw "Failed to compile shader";
        }

        var newFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        if(newFragmentShader == null)
        {
            throw "Failed to Create shader";
        }
        this.fragmentShader = newFragmentShader;
        gl.shaderSource(this.fragmentShader, shaderSource);
        gl.compileShader(this.fragmentShader);

        if(!gl.getShaderParameter(this.fragmentShader, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(this.fragmentShader));
            throw "Failed to compile shader";
        }
    
        var newProgram = gl.createProgram();
        if(newProgram == null)
        {
            throw "Failed to Create shader Program";
        }
        this.program = newProgram;

        gl.attachShader(this.program, this.vertexShader);
        gl.attachShader(this.program, this.fragmentShader);
        gl.linkProgram(this.program);

        this.modelViewProjectionLoc =  gl.getUniformLocation(this.program, "modelViewProjection");
        this.modelViewLoc = gl.getUniformLocation(this.program, "modelView");
    }

    use(gl : WebGL2RenderingContext)
    {
        gl.useProgram(this.program);
    }

    bindUniforms(gl : WebGL2RenderingContext, modelView : mat4, modelViewprojection : mat4)
    {
        if(this.modelViewProjectionLoc)
        {
            gl.uniformMatrix4fv(this.modelViewProjectionLoc, false, modelViewprojection);
        }
        
        if(this.modelViewLoc)
        {
            gl.uniformMatrix4fv(this.modelViewLoc, false, modelView);
        }
    }
}
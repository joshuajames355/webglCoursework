import { mat4 } from "gl-matrix";
import { Texture, BaseTexture } from "../texture";

//type is gl.VERTEX_SHADER, gl.FRAGMENT_SHADER etc
function createShader(gl : WebGL2RenderingContext, source : string, type : number) : WebGLShader
{
    var shader = gl.createShader(type);
    if(shader == null)
    {
        throw "Failed to Create shader";
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.log(gl.getShaderInfoLog(shader));
        throw "Failed to compile shader";
    }
    return shader;
}
const createVertexShader = (gl : WebGL2RenderingContext, source : string) => createShader(gl, source, gl.VERTEX_SHADER);
const createFragmentShader = (gl : WebGL2RenderingContext, source : string) => createShader(gl, source, gl.FRAGMENT_SHADER);


//creates a program from two shaders
function createShaderProgram(gl : WebGL2RenderingContext, vertexShader : WebGLShader, fragmentShader : WebGLShader) : WebGLProgram
{
    var program = gl.createProgram();
    if(program == null)
    {
        throw "Failed to Create shader Program";
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if(!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        console.log(gl.getProgramInfoLog(program));
        throw "Failed to link shader program";
    }
    return program;
}

function createShaderProgramFromSource(gl : WebGL2RenderingContext, vertexSource : string, fragmentSource: string) : WebGLProgram
{
    var vertexShader = createVertexShader(gl, vertexSource);
    var fragmentShader = createFragmentShader(gl, fragmentSource);
    return createShaderProgram(gl, vertexShader, fragmentShader);
}

export default class ShaderProgram
{
    program : WebGLProgram;

    modelViewLoc : WebGLUniformLocation | null = null;
    modelViewProjectionLoc : WebGLUniformLocation | null = null;
    projectionLoc : WebGLUniformLocation | null = null;

    diffuseMap : BaseTexture | null;
    diffuseMapLoc : WebGLUniformLocation | null;
    constructor(gl : WebGL2RenderingContext, vertexSource : string, fragmentSource : string, diffuseMap? : BaseTexture)
    {
        this.program = createShaderProgramFromSource(gl, vertexSource, fragmentSource);

        this.modelViewProjectionLoc =  gl.getUniformLocation(this.program, "modelViewProjection");
        this.modelViewLoc = gl.getUniformLocation(this.program, "modelView");
        this.projectionLoc = gl.getUniformLocation(this.program, "projection");
        
        this.diffuseMap = diffuseMap == undefined ? null : diffuseMap;
        this.diffuseMapLoc = gl.getUniformLocation(this.program, "diffuseMap");
    }

    use(gl : WebGL2RenderingContext)
    {
        gl.useProgram(this.program);
        if(this.diffuseMap != null && this.diffuseMapLoc != null){
            //using texture unit 0 for diffuse maps
            gl.activeTexture(gl.TEXTURE0);
            this.diffuseMap.bindTexture();
            gl.uniform1i(this.diffuseMapLoc, 0);
        }
    }

    bindUniforms(gl : WebGL2RenderingContext, modelMatrix : mat4, viewMatrix : mat4, projectionMatrix : mat4)
    {
        var modelView : mat4 = mat4.create();
        mat4.mul(modelView, viewMatrix, modelMatrix);

        var modelViewProjection : mat4 = mat4.create();
        mat4.mul(modelViewProjection, projectionMatrix, modelView);

        if(this.modelViewProjectionLoc)
        {
            gl.uniformMatrix4fv(this.modelViewProjectionLoc, false, modelViewProjection);
        }
        if(this.modelViewLoc)
        {
            gl.uniformMatrix4fv(this.modelViewLoc, false, modelView);
        }
        if(this.projectionLoc)
        {
            gl.uniformMatrix4fv(this.projectionLoc, false, projectionMatrix);
        }
    }
}
import { mat4 } from "gl-matrix";
import { Texture, BaseTexture } from "./texture";

export default class ShaderProgram
{
    program : WebGLProgram;
    vertexShader : WebGLShader;
    fragmentShader : WebGLShader;

    modelViewLoc : WebGLUniformLocation | null = null;
    modelViewProjectionLoc : WebGLUniformLocation | null = null;
    projectionLoc : WebGLUniformLocation | null = null;

    diffuseMap : BaseTexture | null;
    diffuseMapLoc : WebGLUniformLocation | null;
    constructor(gl : WebGL2RenderingContext, vertexSource : string, shaderSource : string, diffuseMap? : BaseTexture)
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

        if(!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        {
            console.log(gl.getProgramInfoLog(this.program));
            throw "Failed to link shader program";
        }

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
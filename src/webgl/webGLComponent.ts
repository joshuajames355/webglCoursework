import RenderableComponent from "../core/renderableComponent";
import GameObject from "../core/object";

//The state of a webgl object (RenderableComponent)
export class WebGLComponentState
{
    vbo : WebGLBuffer = -1; //Vertice buffer object
    ebo : WebGLBuffer = -1; //element/Index buffer object
    vao : WebGLBuffer = -1; //Vertice Array Object

    hasDoneSetup : boolean = false;
    parent : GameObject;

    constructor(parent : GameObject)
    {
        this.parent = parent;
    }
}

export function setupObject(gl : WebGL2RenderingContext, state : WebGLComponentState, component : RenderableComponent)
{
    var newVBO = gl.createBuffer();
    if(newVBO == null)
    {
        throw "Failed to Create VBO"
    }
    state.vbo = newVBO;

    var newEBO = gl.createBuffer();
    if(newEBO == null)
    {
        throw "Failed to Create EBO"
    }
    state.ebo = newEBO;

    var newVAO = gl.createVertexArray();
    if(newVAO == null)
    {
        throw "Failed to Create VAO"
    }
    state.vao = newVAO;

    //setup VAO 
    gl.bindVertexArray(state.vao);

    //setup VBO
    gl.bindBuffer(gl.ARRAY_BUFFER, state.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(component.vertices), gl.STATIC_DRAW);

    //setup EBO
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, state.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(component.indices), gl.STATIC_DRAW)

    //bind Position attributes
    //pos
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 8*4, 0);
    gl.enableVertexAttribArray(0);
    //normals
    gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 8*4, 3*4);
    gl.enableVertexAttribArray(0);
    //uvs
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 8*4, 6*4);
    gl.enableVertexAttribArray(2);
    
    gl.bindVertexArray(null);
    
    //unbind now setup complete. 
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
    state.hasDoneSetup = true;
}


export function drawComponent(gl : WebGL2RenderingContext, state : WebGLComponentState, component : RenderableComponent)
{ 
    if(!state.hasDoneSetup) setupObject(gl, state, component);

    gl.bindVertexArray(state.vao);
    gl.drawElements(gl.TRIANGLES, component.indices.length, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
}

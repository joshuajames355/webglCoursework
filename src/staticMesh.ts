import RenderableComponent from "./renderableComponent";

export default class StaticMesh extends RenderableComponent //A base class for meshes
{
    vertices: number[] = []; //3 values for each - x, y, z 
    indices: number[] = [];

    private vbo : WebGLBuffer = -1; //Vertice buffer object
    private ebo : WebGLBuffer = -1; //element/Index buffer object

    public vao : WebGLBuffer = -1; //Vertice Array Object

    protected hasDoneSetup : boolean = false;

    protected setupVAO(gl : WebGL2RenderingContext)
    {
        var newVBO = gl.createBuffer();
        if(newVBO == null)
        {
            throw "Failed to Create VBO"
        }
        this.vbo = newVBO;

        var newEBO = gl.createBuffer();
        if(newEBO == null)
        {
            throw "Failed to Create EBO"
        }
        this.ebo = newEBO;

        var newVAO = gl.createVertexArray();
        if(newVAO == null)
        {
            throw "Failed to Create VAO"
        }
        this.vao = newVAO;

        //setup VAO 
        gl.bindVertexArray(this.vao);

        //setup VBO
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        //setup EBO
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW)

        //bind Position attribute
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 3*4, 0);
        gl.enableVertexAttribArray(0);
        
        gl.bindVertexArray(null);
        
        //unbind now setup complete. 
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        
        this.hasDoneSetup = true;
    }

    drawVertices(gl : WebGL2RenderingContext)
    { 
        if(!this.hasDoneSetup) this.setupVAO(gl);

        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }
}
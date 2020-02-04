import RenderableComponent from "./renderableComponent";
import { vec3 } from "gl-matrix";
import ShaderProgram from "./shaders";

export default class StaticMesh extends RenderableComponent //A base class for meshes
{
    vertices: number[] = []; //8 values for each - x, y, z , nx, ny, nz, u, v 
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
        
        this.hasDoneSetup = true;
    }

    drawVertices(gl : WebGL2RenderingContext)
    { 
        if(!this.hasDoneSetup) this.setupVAO(gl);

        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
        gl.bindVertexArray(null);
    }

    static fromOBJ(objSource : string, shaderProgram : ShaderProgram) : StaticMesh
    {
        var startTime = Date.now();

        var vertices : number[][] = []; //A list of vertices (lists of 3 points)
        var textureCoords : number[][] = []; //A list of vertices (lists of 2 points)
        var normals : number[][] = []; //A list of vertices (lists of 3 points)

        var newMesh = new StaticMesh(shaderProgram);

        newMesh.vertices = [];
        newMesh.indices = [];

        var indicesMap = new Map<string, number>(); //maps the indexes in a obj face (eg 123//2) to an index in the opengl indices list

        var aList = objSource.split("\n");
        for (var x = 0; x < aList.length; x++)
        {
            var line = aList[x];

            //Handles comments
            var hashLoc = line.indexOf("#");
            if(hashLoc != -1) line = line.substr(0, hashLoc);

            //clears whitespace, and lines that are only whitespace (or comments from above)
            line = line.trim();
            if(line.length == 0) continue;

            if (line.startsWith("vt")) //Texture coordinate
            {
                //imports a texture coord
                var uv = line.substr(3).split(" ").map((x : string) => parseFloat(x));
                uv.splice(2);
                uv = uv.map((x : number) => isNaN(x) ? 0 : x);
                textureCoords.push(uv);
            }
            else if (line.startsWith("vn")) //normal
            {
                //imports a normal
                var normal = line.substr(2).split(" ").map((x : string) => parseFloat(x));
                normal.splice(3);
                normal = normal.map((x : number) => isNaN(x) ? 0 : x);
                normals.push(normal);
            }
            else if (line.startsWith("v ")) //Vertex
            {
                //imports a vertex
                var vertex = line.substr(2).split(" ").map((x : string) => parseFloat(x));
                vertex.splice(3);
                vertex = vertex.map((x : number) => isNaN(x) ? 0 : x);
                vertices.push(vertex);
            }
            else if (line[0] == "f") //face
            {
                //imports a face
                var face : string[] = line.substr(2).split(" ")
                face.splice(3);

                //Only work with triangles
                if (face.length == 3)
                {
                    for(var y = 0; y < 3; y++)
                    {
                        var lookup = indicesMap.get(face[y]);
                        if(lookup != undefined)
                        {
                            newMesh.indices.push(lookup);
                        }
                        else if (face[y].includes("//")) //Contains vertices and normals
                        {
                            var faceItems = face[y].split("/");
                            var pos = vertices[parseInt(faceItems[0]) -1];
                            var norms = normals[parseInt(faceItems[2]) -1];
                            newMesh.vertices.push(pos[0], pos[1], pos[2], norms[0], norms[1], norms[2], 0, 0);
                            var index = Math.floor(newMesh.vertices.length/8) - 1;
                        }
                        else if(face[y].includes("/")) //Contains vertices , texture coordinates and maybe normals
                        {
                            var faceItems = face[y].split("/");
                            var pos = vertices[parseInt(faceItems[0]) -1];
                            var texCoords = textureCoords[parseInt(faceItems[1]) -1];
                            var norms : number[] = [];

                            if(faceItems.length == 2) //missing normals again
                            {
                                norms = [1,0,0]; //TODO, generate normals
                            }
                            else
                            {
                                norms = normals[parseInt(faceItems[2]) -1];
                            }

                            newMesh.vertices.push(pos[0], pos[1], pos[2], norms[0], norms[1], norms[2], texCoords[0], texCoords[1]);
                            var index = Math.floor(newMesh.vertices.length/8) - 1;
                            newMesh.indices.push(index);
                            indicesMap.set(face[y], index);
                        }
                        else //just vertices
                        {
                            var faceItems = face[y].split("/");
                            var pos = vertices[parseInt(faceItems[0]) -1];
                            var norms = [1,0,0]; //TODO, generate normals

                            newMesh.vertices.push(pos[0], pos[1], pos[2], norms[0], norms[1], norms[2], 0, 0);
                            newMesh.indices.push(Math.floor(newMesh.vertices.length/8) - 1);
                        }
                    }
                }
            }
        }
        var timeTaken = (Date.now() - startTime)/1000;
        console.log("OBJ IMPORT TOOK: " + timeTaken.toFixed(1) + " seconds");
        return newMesh;
    }
}
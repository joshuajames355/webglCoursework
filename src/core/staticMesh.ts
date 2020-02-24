import RenderableComponent from "./renderableComponent";
import { Material } from "./material";

export function componentFromOBJ(objSource : string, material : Material) : RenderableComponent
{
    var startTime = Date.now();

    var vertices : number[][] = []; //A list of vertices (lists of 3 points)
    var textureCoords : number[][] = []; //A list of vertices (lists of 2 points)
    var normals : number[][] = []; //A list of vertices (lists of 3 points)

    var newMesh = new RenderableComponent(material);

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
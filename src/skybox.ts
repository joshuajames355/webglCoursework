import StaticMesh from "./staticMesh";
import ShaderProgram from "./webgl/shaders";
import { BaseTexture } from "./texture";


const fragmentSkyboxSource = require("./webgl/shaders/fragmentSkybox.glsl");
const vertexSkyboxSource = require("./webgl/shaders/vertexSkybox.glsl");

export class Skybox extends StaticMesh
{
    texture : CubeMapTexture;
    constructor(gl : WebGL2RenderingContext, images : string[])
    {
        //Validate images array
        if(images.length != 1 && images.length != 6)
        {
            throw "Invalid number of images passed to skybox"
        }
        var newImages : string[] = [...images, ]; //Supports one texture (copied to all 6 faces), or 6 seperate textures
        if(images.length == 1)
        {
            newImages = [images[0], images[0], images[0], images[0], images[0], images[0]];
        }

        var texture = new CubeMapTexture(gl, newImages);

        var program : ShaderProgram = new ShaderProgram(gl, vertexSkyboxSource, fragmentSkyboxSource, texture);

        super(program);
        this.texture = texture;

        this.vertices = [
            -1, -1, -1, 0, 0, 0, 0, 0,
            -1, -1, 1, 0, 0, 0, 0, 0,
            -1, 1, -1, 0, 0, 0, 0, 0,
            -1, 1, 1, 0, 0, 0, 0, 0,
            1, -1, -1, 0, 0, 0, 0, 0,
            1, -1, 1, 0, 0, 0, 0, 0,
            1, 1, -1, 0, 0, 0, 0, 0,
            1, 1, 1, 0, 0, 0, 0, 0,
        ];

        this.indices = [0, 1, 2, 3, 1, 2, // x=0 
                        4, 5, 6, 7, 5, 6, // x=1 
                        0, 1, 4, 5, 1, 4, // y=0 
                        2, 3, 6, 7, 3, 6, // y=1 
                        0, 2, 4, 6, 2, 4, // z=0
                        1, 3, 5, 7, 3, 5  // z=1
        ];
    }
}

class CubeMapTexture extends BaseTexture
{
    id : WebGLTexture;
    src : string[];
    gl : WebGL2RenderingContext;
    constructor(gl : WebGL2RenderingContext, filenames : string[])
    {
        super();

        var textureId = gl.createTexture();
        if (textureId == null)
        {
            throw "Failed to create Texture";
        }
        this.id = textureId;
        this.src = filenames;
        this.gl = gl;

        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.id);

        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);

        for (var x = 0; x < 6 && x < filenames.length; x++)
        {
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]))

            var image = new Image();
            image.onload = this.loadImage(image, x);
            image.src = filenames[x];
        }
    }

    loadImage(image : HTMLImageElement, x : number)
    {
        return () =>
        {
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
            this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);

            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, null);
        }
    }

    bindTexture()
    {
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.id);
    }
}
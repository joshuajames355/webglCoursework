export class BaseTexture
{
    bindTexture()
    {

    }
}

export class Texture extends BaseTexture
{
    id : WebGLTexture;
    src : string;
    gl : WebGL2RenderingContext;
    constructor(gl : WebGL2RenderingContext, filename : string)
    {
        super();

        var textureId = gl.createTexture();
        if (textureId == null)
        {
            throw "Failed to create Texture";
        }
        this.id = textureId;

        this.src = filename;
        gl.bindTexture(gl.TEXTURE_2D, this.id);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]))

        var image = new Image();
        image.onload = () =>{
            gl.bindTexture(gl.TEXTURE_2D, this.id);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        image.src = filename;

        this.gl = gl;
    }

    bindTexture()
    {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.id);
    }
}
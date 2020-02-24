
export function bindTexture(gl : WebGL2RenderingContext, textureUnit : number, image: HTMLImageElement, textureID : WebGLTexture, type: number, bindingPoint: number, hasSetup : boolean)
{
    gl.activeTexture(textureUnit);
    gl.bindTexture(type, textureID);

    if(!hasSetup)
    {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,255,255]));
        image.onload = () =>
        {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

            gl.texParameteri(type, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
        return 
    }
}

export function bind2DTexture(gl : WebGL2RenderingContext, textureUnit : number, image: HTMLImageElement, textureID : WebGLTexture, hasSetup : boolean)
{
    bindTexture(gl, textureUnit, image, textureID, gl.TEXTURE_2D, gl.TEXTURE_2D, hasSetup);
}

export function bindCubeMap(gl : WebGL2RenderingContext, textureUnit : number, images: HTMLImageElement[], textureID : WebGLTexture, hasSetup : boolean)
{
    gl.activeTexture(textureUnit);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, textureID);

    if(!hasSetup)
    {
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

        for(var x : number = 0; x < 6; x++)
        {
            if(!images[x].complete)
            {
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([1,1,1,1]))
                images[x].onload = () =>
                {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[x]);
                }
            }
            else
            {
    
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + x, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images[x]);
            }
        }
    }
}
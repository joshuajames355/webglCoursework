export default class Texture
{
    src : string;
    image : HTMLImageElement;
    constructor(filename : string)
    {
        this.src = filename;
        this.image = new Image();
        this.image.src = filename;
    }
}
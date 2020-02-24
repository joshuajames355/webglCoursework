import RenderableComponent from "../core/renderableComponent";
import { WebGLComponentState, drawComponent} from "./webGLComponent";
import { WebGLMaterialState, getShaderFromMaterial, materialPreRenderStep, materialGlobalStep} from "./webGLMaterial";
import PerspectiveCamera, { Camera } from "../core/camera";
import { mat4, vec4 } from "gl-matrix";
import GameObject from "../core/object";

export class WebGLRenderer
{
    private components : RenderableComponent[] = []; //sorted by material id
    private objects : GameObject[] = [];

    private componentStates : Map<number, WebGLComponentState> = new Map<number, WebGLComponentState>();
    private camera : Camera = new PerspectiveCamera();

    private materials : Map<number, WebGLMaterialState> = new Map<number, WebGLMaterialState>();

    private backgroundColourR : number = 0;
    private backgroundColourG : number = 0;
    private backgroundColourB : number = 0;
    private backgroundColourA : number = 1;

    private lastFrameTime : number;

    gl : WebGL2RenderingContext;

    constructor(canvas : HTMLCanvasElement)
    {    
        canvas.onclick = () => {
            canvas.requestPointerLock()};
    
    
        var gl : WebGL2RenderingContext | null = canvas.getContext("webgl2");
    
        // Only continue if WebGL is available and working
        if (gl === null) {
            throw "Failed to initialize webgl2";
        }

        this.gl = gl;
        this.lastFrameTime = (new Date()).getTime() / 1000;
    }

    setBackgroundColourComponents(r : number, g : number, b : number, a : number)
    {
        this.backgroundColourR = r;
        this.backgroundColourG = g;
        this.backgroundColourB = b;
        this.backgroundColourA = a;
    }

    setBackgroundColour(colour : vec4)
    {
        this.backgroundColourR = vec4.dot(colour, vec4.fromValues(1,0,0,0));
        this.backgroundColourG = vec4.dot(colour, vec4.fromValues(0,1,0,0));
        this.backgroundColourB = vec4.dot(colour, vec4.fromValues(0,0,1,0));
        this.backgroundColourA = vec4.dot(colour, vec4.fromValues(0,0,0,1));
    }

    addObject(object : GameObject)
    {
        this.objects.push(object);

        object.getComponents().forEach((component : RenderableComponent) =>
        {
            //single iteration of insertion sort
            var x : number = 0;
            for(; x < this.components.length && this.components[x].id <= component.material.id; x++);
            this.components.splice(x, 0 , component);
            
            this.components.push(component);
            this.componentStates.set(component.id, new WebGLComponentState(object));

            if(!this.materials.has(component.material.id))
            {
                var shader = getShaderFromMaterial(this.gl, component.material);
                this.materials.set(component.material.id, new WebGLMaterialState(shader))
            }
        })
    }

    setCamera(camera : Camera)
    {
        this.camera = camera;
    }

    render()
    {
        var time = (new Date()).getTime() / 1000;
        var deltaTime = time - this.lastFrameTime;
        this.lastFrameTime = time;

        this.objects.forEach((x : GameObject) =>
        {
            x.tick(deltaTime);
        })

        this.gl.clearColor(this.backgroundColourR, this.backgroundColourG, this.backgroundColourB, this.backgroundColourA);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.DEPTH_TEST);

        var prevMaterialId : number = -1;
        var material : WebGLMaterialState | undefined = undefined;
        for(var x : number = 0; x < this.components.length; x++)
        {
            var state = this.componentStates.get(this.components[x].id);
            if(state == undefined) break;

            if(this.components[x].material.id != prevMaterialId || material == undefined)
            {
                var materialTemp = this.materials.get(this.components[x].material.id);
                if(materialTemp == undefined ) break;
                material = materialTemp;

                material.program.use(this.gl);
                materialGlobalStep(this.gl, this.components[x].material, material)
            }

            var modelMat = mat4.create();
            mat4.mul(modelMat, this.components[x].getModelMatrix(), state.parent.getModelMatrix())
            
            materialPreRenderStep(this.gl, this.components[x].material, material, this.camera, modelMat);
            drawComponent(this.gl, state, this.components[x]); 
        }
    }
}
import RenderableComponent from "../core/renderableComponent";
import { WebGLComponentState, drawComponent} from "./webGLComponent";
import { WebGLMaterialState, getShaderFromMaterial, materialPreRenderStep, materialGlobalStep} from "./webGLMaterial";
import PerspectiveCamera, { Camera } from "../core/camera";
import { mat4, vec4 } from "gl-matrix";
import GameObject from "../core/object";
import { SkyboxComponent } from "./webGLSkybox";
import { Material } from "../core/material";
import ShaderProgram from "./webGLShaders";
import { generateNormalShader, drawNormals } from "./webGLDebug";

export class WebGLRenderer
{
    private components : RenderableComponent[] = []; //sorted by material id
    private objects : GameObject[] = [];

    private componentStates : Map<number, WebGLComponentState> = new Map<number, WebGLComponentState>();
    private camera : Camera = new PerspectiveCamera();
    
    private skyboxMat? : Material  = undefined;
    private skyboxMatState? : WebGLMaterialState = undefined;
    private skyboxComponent? : SkyboxComponent = undefined;
    private skyboxState : WebGLComponentState = new WebGLComponentState();

    private materials : Map<number, WebGLMaterialState> = new Map<number, WebGLMaterialState>();  

    private bDrawNormals : boolean = false; //if true, draw normals globally 
    private normalShader? : ShaderProgram;

    private backgroundColour : vec4 = vec4.fromValues(0,0,1,1);

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

        console.log(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS.toString() + " Texture Units avaliable.");
    }

    setDebugDrawNormals(bDrawNormals : boolean)
    {
        this.bDrawNormals = bDrawNormals;
    }

    setSkybox(skybox : Material)
    {
        this.skyboxMat = skybox;
        this.skyboxComponent = new SkyboxComponent(skybox);
        this.skyboxMatState = new WebGLMaterialState(getShaderFromMaterial(this.gl, this.skyboxComponent.material))
    }
    removeSkybox()
    {
        this.skyboxMat = undefined;
    }
    renderSkyBox()
    {
        if(this.skyboxMat != undefined && this.skyboxComponent != undefined && this.skyboxMatState != undefined)
        {
            this.gl.disable(this.gl.DEPTH_TEST);
            materialGlobalStep(this.gl, this.skyboxMat, this.skyboxMatState);
            materialPreRenderStep(this.gl, this.skyboxMat, this.skyboxMatState, this.camera, mat4.create());
            drawComponent(this.gl, this.skyboxState, this.skyboxComponent); 
        }
    }

    setBackgroundColour(colour : vec4)
    {
        this.backgroundColour = colour;
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

    getDeltaTime()
    {
        return (new Date()).getTime() / 1000 - this.lastFrameTime;
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

        this.gl.clearColor(this.backgroundColour[0], this.backgroundColour[1], this.backgroundColour[2], this.backgroundColour[3]);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT| this.gl.DEPTH_BUFFER_BIT);

        this.renderSkyBox();

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
                
                materialGlobalStep(this.gl, this.components[x].material, material)
            }

            var modelMat = this.components[x].getModelMatrix();
            if(state.parent) mat4.mul(modelMat, modelMat, state.parent.getModelMatrix());
            
            materialPreRenderStep(this.gl, this.components[x].material, material, this.camera, modelMat);
            drawComponent(this.gl, state, this.components[x]); 
        }

        if(this.bDrawNormals)
        {
            if(!this.normalShader)
            {
                this.normalShader = generateNormalShader(this.gl);
            }
            this.normalShader.use(this.gl);
            this.normalShader.bindDiffuseColour(this.gl, vec4.fromValues(0,1,0,1));

            for(var x : number = 0; x < this.components.length; x++)
            {
                var state = this.componentStates.get(this.components[x].id);
                if(state == undefined) break;

                var modelMat = this.components[x].getModelMatrix();
                if(state.parent) mat4.mul(modelMat, modelMat, state.parent.getModelMatrix());

                this.normalShader.bindUniforms(this.gl, modelMat, this.camera.getViewMatrix(), this.camera.getProjectionMatrix());
                drawNormals(this.gl, this.components[x], state);
            }
        }
    
    }
}
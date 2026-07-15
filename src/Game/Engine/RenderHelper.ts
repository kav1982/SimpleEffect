// 保证打包顺序：CustomMaterial 必须在各 *Material 子类之前完成定义
import "../CustomShader/CustomMaterial";
import { GlobalShaderInit } from "../CustomShader/ShaderLibrary/GlobalShaderInit";
import Material = Laya.Material;
import Component = Laya.Component;
import Sprite3D = Laya.Sprite3D;
import Sprite = Laya.Sprite;
import Quaternion = Laya.Quaternion;
import Vector3 = Laya.Vector3;
import Transform3D = Laya.Transform3D;
import ShaderDataType = Laya.ShaderDataType;
import Vector2 = Laya.Vector2;
import Vector4 = Laya.Vector4;
import Color = Laya.Color;
import ShaderPass = Laya.ShaderPass;
import { Debug } from "../Core/Debug";

/**
 * 支持一些Unity中常用的方法类
 */
export class RenderHelper {

    /**
     * 设置会遮挡角色的模型材质球(支持X光)  当渲染队列高于角色模型材质时需要设置
     * @param material
     * @constructor
     */
    public static SetDefaultBlockMat(material: Material): void {
        material.stencilWrite = true;
        material.stencilTest = Laya.CompareFunction.Always;
        material.stencilOp = new Laya.Vector3(0, 0, Laya.StencilOperation.Replace);
        material.stencilRef = 0;
    }

    /**
     * 获取所有子节点的某一类组件数组,用法类似Unity
     * @param sprite 精灵
     * @param componentType 组件类型
     * @returns 
     */
    public static GetComponentsInChild<T extends Component>(sprite: Sprite3D | Sprite, componentType: new () => T): T[] {
        let comps: T[] = [];
        if (!sprite || !componentType) {
            return comps;
        }
        for (let component of sprite.components) {
            if (component instanceof componentType) {
                comps.push(component);
            }
        }
        if (sprite.numChildren > 0) {
            for (let i = 0; i < sprite.numChildren; i++) {
                let child = sprite.getChildAt(i) as (Sprite3D | Sprite);
                comps.push(...this.GetComponentsInChild(child, componentType));
            }
        }
        return comps;
    }
    /**
     * 从所有子节点中，获取第一个满足类型的组件
     * @param sprite 精灵
     * @param componentType 组件类型
     * @returns
     */
    public static GetFirstComponentInChild<T extends Component>(sprite: Sprite3D | Sprite, componentType: new () => T): T {
        if (sprite == null || !componentType) return null;
        let comp: T;
        for (let component of sprite.components) {
            if (component instanceof componentType) {
                comp = component as T;
                break;
            }
        }
        if (!comp && sprite.numChildren > 0) {
            for (let i = 0; i < sprite.numChildren; i++) {
                let child = sprite.getChildAt(i) as (Sprite3D | Sprite);
                comp = this.GetFirstComponentInChild(child, componentType);
                if (comp)
                    break;
            }
        }
        return comp;
    }


    public static GetFirstSkinnedComponentsInChild(sprite: Sprite3D | Sprite): Laya.SimpleSkinnedMeshRenderer | Laya.SkinnedMeshRenderer {
        if (sprite == null) return null;
        const SimpleSkinnedMeshRenderer = Laya.SimpleSkinnedMeshRenderer;
        const SkinnedMeshRenderer = Laya.SkinnedMeshRenderer;
        if (!SimpleSkinnedMeshRenderer && !SkinnedMeshRenderer) {
            return null;
        }
        let comp: Laya.SimpleSkinnedMeshRenderer | Laya.SkinnedMeshRenderer;
        for (let component of sprite.components) {
            if ((SimpleSkinnedMeshRenderer && component instanceof SimpleSkinnedMeshRenderer)
                || (SkinnedMeshRenderer && component instanceof SkinnedMeshRenderer)) {
                comp = component as Laya.SimpleSkinnedMeshRenderer | Laya.SkinnedMeshRenderer;
                break;
            }
        }
        if (!comp && sprite.numChildren > 0) {
            for (let i = 0; i < sprite.numChildren; i++) {
                let child = sprite.getChildAt(i) as (Sprite3D | Sprite);
                comp = this.GetFirstSkinnedComponentsInChild(child);
                if (comp)
                    break;
            }
        }
        return comp;
    }

    public static readonly Deg2Rad = 0.01745329;
    public static readonly Rad2Deg = 57.29578;

    // public static readonly VECTOR3_UP = new Vector3(0,1,0);
    // public static readonly VECTOR3_RIGHT = new Vector3(1,0,0);

    /**
     * 创建一个从fromDirection旋转到toDirection的四元数
     * @param fromDirection
     * @param toDirection
     * @constructor
     */
    public static FromToRotation(fromDirection: Vector3, toDirection: Vector3): Quaternion {
        let nF = new Vector3();
        let nt = new Vector3();
        Vector3.normalize(fromDirection, nF);
        Vector3.normalize(toDirection, nt);
        let dot: number = Vector3.dot(nF, nt);
        let result: Quaternion = new Quaternion();
        if (dot >= 0.9999) {
            result.setValue(0, 0, 0, 1);
        }
        else if (dot <= -0.9999) {
            if (nF.x !== 0 && nF.y !== 0 && nF.z !== 0) {
                result.setValue(0.8164, -0.4082, -0.4082, 0);
            }
            else if (nF.x !== 0 && nF.y === 0 && nF.z === 0) {
                result.setValue(0, 1, 0, 0);
            }
            else if (nF.x === 0 && nF.y !== 0 && nF.z === 0) {
                result.setValue(1, 0, 0, 0);
            }
            else if (nF.x === 0 && nF.y === 0 && nF.z !== 0) {
                result.setValue(1, 0, 0, 0);
            }
            else if (nF.x !== 0 && nF.y !== 0 && nF.z === 0) {
                result.setValue(1, -1, 0, 0);
            }
            else if (nF.x !== 0 && nF.y === 0 && nF.z !== 0) {
                result.setValue(1, 0, -1, 0);
            }
            else if (nF.x === 0 && nF.y !== 0 && nF.z !== 0) {
                result.setValue(1, 0, 0, 0);
            }
            result.normalize(result);
        }
        else {
            let rad = Math.acos(dot);
            let axis = new Vector3();
            Vector3.cross(fromDirection, toDirection, axis);
            Quaternion.createFromAxisAngle(axis.normalize(), rad, result);
        }

        return result;
    }

    /**
     * 局部向量转为世界空间向量,TransformPoint为transform.localToGlobal()方法
     * @param transform
     * @param dir
     * @constructor
     */
    public static TransformDirection(transform: Transform3D, dir: Vector3): Vector3 {
        let worldDir = new Vector3();
        Vector3.transformQuat(dir, transform.rotation, worldDir);
        return worldDir;
    }

    /**
     * 将Color类转化为为字符型颜色值。
     * @param color Color类
     * @return 字符型颜色值
     */
    public static GetHexColor(color: Color): string {
        const red = Math.floor(color.r * 255);
        const green = Math.floor(color.g * 255);
        const blue = Math.floor(color.b * 255);

        const redHex = ("00" + red.toString(16)).slice(-2);
        const greenHex = ("00" + green.toString(16)).slice(-2);
        const blueHex = ("00" + blue.toString(16)).slice(-2);

        return `#${redHex}${greenHex}${blueHex}`;
    }

    //设置全局Shader变量

    public static RegisterGlobalFloat(uniformName: string) {
        GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType.Float);
    }

    public static RegisterGlobalVector2(uniformName: string) {
        GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType.Vector2);
    }

    public static RegisterGlobalVector3(uniformName: string) {
        GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType.Vector3);
    }

    public static RegisterGlobalVector4(uniformName: string) {
        GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType.Vector4);
    }

    public static RegisterGlobalColor(uniformName: string) {
        GlobalShaderInit.registerShaderUniform(uniformName, ShaderDataType.Color);
    }

    public static SetGlobalShaderFloat(uniformName: string, value: number, register: boolean = false): void {
        if (register) {
            this.RegisterGlobalFloat(uniformName);
        }
        GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType.Float, value);
    }

    public static SetGlobalShaderVector2(uniformName: string, value: Vector2, register: boolean = false): void {
        if (register) {
            this.RegisterGlobalVector2(uniformName);
        }
        GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType.Vector2, value);
    }

    public static SetGlobalShaderVector3(uniformName: string, value: Vector3, register: boolean = false): void {
        if (register) {
            this.RegisterGlobalVector3(uniformName);
        }
        GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType.Vector3, value);
    }

    public static SetGlobalShaderVector4(uniformName: string, value: Vector4, register: boolean = false): void {
        if (register) {
            this.RegisterGlobalVector4(uniformName);
        }
        GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType.Vector4, value);
    }

    public static SetGlobalShaderColor(uniformName: string, value: Color, register: boolean = false): void {
        if (register) {
            this.RegisterGlobalColor(uniformName);
        }
        GlobalShaderInit.SetGlobalShaderValue(uniformName, ShaderDataType.Color, value);
    }

    public static findChildByPath(root: Laya.Sprite3D, path: string): Laya.Sprite3D {
        if (root == null || !path) {
            return null;
        }
        let names = path.split('/');
        if (!names?.length) {
            return null;
        }
        let current: Laya.Node = root;

        for (let name of names) {
            current = current.getChildByName(name);
            if (current == null) {
                return null;
            }
        }

        return current as Laya.Sprite3D;
    }

    /**
     * 设置RT参数(不在初始化选项中)
     * @param rt 目标RT
     * @param isGammaSpace 是否在Gamma空间中
     * @param isRepeat 是否重复
     */
    public static setRenderTextureParam(rt: Laya.RenderTexture, isGammaSpace: boolean, isRepeat: boolean) {
        //rt._texture.useSRGBLoad = isGammaSpace;
        (rt as any)._texture.gammaCorrection = isGammaSpace ? 2.2 : 1.0;
        rt.wrapModeU = rt.wrapModeV = isRepeat ? Laya.WrapMode.Repeat : Laya.WrapMode.Clamp;
    }

    public static getMaterialPasses(material: Material, subShaderIndex: number = 0): ShaderPass[] {
        const shader = (material as any)._shader;
        return shader.getSubShaderAt(subShaderIndex)._passes;
    }


    public static getSimpleShadowScale(bounds: Laya.Bounds, unitType: number = 0): Laya.Vector3 {
        if (!bounds) {
            return new Laya.Vector3(1, 1, 1);
        }
        let diffX = bounds.max.x - bounds.min.x;
        let diffZ = bounds.max.z - bounds.min.z;
        let scale = Math.max(diffX, diffZ) * 0.8;
        //临时处理，有些mesh包围盒过大
        let maxScale = 2;
        if (unitType === 3) {
            maxScale = 8;
        }
        scale = Math.min(scale, maxScale);
        scale = Math.max(0.7, scale);
        return new Laya.Vector3(scale, 1, scale);
    }

    public static setSimpleShadowActive(_active: boolean) {
    }


    /**
     * todo 改为用passname当参数可能更好点，passIndex可能存在变化的情况
     * @param shader3D 
     * @param subShaderIndex 
     * @param passIndex 
     * @param active 
     * @returns 
     */
    public static setShaderPassEnable(shader3D: Laya.Shader3D, subShaderIndex: number, passIndex: number, active: boolean) {
        if (!shader3D) {
            return;
        }
        let subShader: any = shader3D.getSubShaderAt(subShaderIndex);
        if (subShader) {
            let passes: ShaderPass[] = subShader._passes;
            if (passes && passes[passIndex]) {
                //引擎自定义修改的属性pasEnable
                (<any>passes[passIndex]).passEnable = active;
            } else {
                Debug.LogError("setShaderPassEnable找不到指定pass");
            }
        } else {
            Debug.LogError("setShaderPassEnable找不到指定subshader");
        }
    }

    /**
     * 强制清理全部pool，注意主相机正在用的rt会重新创建（因为主相机每帧都会从池中拿rt和把rt还回池中），可能不太好，问题在于如何从池中区别出想清理的rt
     */
    public static forceCleanRenderTexturePool(): void {

        // static clearPool() {
        //     if (RenderTexture._poolMemory < Config3D.defaultCacheRTMemory) {
        //         return;
        //     }
        //     for (var i in RenderTexture._pool) {
        //         RenderTexture._pool[i].destroy();
        //     }
        //     RenderTexture._pool = [];
        //     RenderTexture._poolMemory = 0;
        // }
        // laya 3.1.2源码如上
        let originDefaultCacheRTMemory = Laya.Config3D.defaultCacheRTMemory;
        Laya.Config3D.defaultCacheRTMemory = 0;
        Laya.RenderTexture.clearPool();
        Laya.Config3D.defaultCacheRTMemory = originDefaultCacheRTMemory;

    }


}



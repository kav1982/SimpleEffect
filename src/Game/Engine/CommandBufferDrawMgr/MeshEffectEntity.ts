import Vector4 = Laya.Vector4;
import DrawMeshInstancedCMD = Laya.DrawMeshInstancedCMD;
import MaterialInstancePropertyBlock = Laya.MaterialInstancePropertyBlock;
import CommandBuffer = Laya.CommandBuffer;
import Matrix4x4 = Laya.Matrix4x4;
import Transform3D = Laya.Transform3D;
import InstanceLocation = Laya.InstanceLocation;
import Mesh = Laya.Mesh;
import Material = Laya.Material;
import { MeshEffectEntityMaterial } from "../../CustomShader/InstanceMaterial/MeshEffectEntityMaterial";

import MeshRenderer = Laya.MeshRenderer;
import Color = Laya.Color;
import MeshFilter = Laya.MeshFilter;

const { regClass, property } = Laya;

@regClass()
export class MeshEffectEntity extends Laya.Script {

    @property({ type: Mesh, tips: "网格" })
    public mesh: Mesh;
    @property({ type: Material, tips: "参数材质球" })
    public paramMaterial: Material;

    // @property({type:Boolean,tips:"自定义参数初始值，不勾选则默认使用材质球参数"})
    // public CustomDefaultParam:boolean = false;

    @property({ type: Vector4, tips: "主颜色", inspector: "color" })
    public EntityColor: Vector4 = new Vector4(1, 1, 1, 1);
    @property({ type: Vector4, tips: "[ XY:主贴图Tiling的ZW ]  [ ZW:Mask贴图Tiling的ZW]" })
    public EntityTilingOffset: Vector4 = new Vector4(1, 1, 0, 0);
    @property({ type: Vector4, tips: "[ X:溶解强度 ]  [ Y:溶解边缘范围 ]  [ Z:主帖图旋转角度(0-360度) ]  [ W:序列帧动画控制进度 ]" })
    public EntityParam1: Vector4 = new Vector4();
    //@property({type:Vector4,tips:"[ X: ]  [ Y: ]  [ Z: ]  [ W: ]"})
    //public EntityParam2: Vector4 = new Vector4();

    public entityID: string;

    public transform: Transform3D;

    private commandEntity: MeshEffectCommandEntity;
    private static tmpVec: Vector4 = new Vector4();
    private static tmpCol: Color = new Color();

    // private entityColKeyFrames:Vector4Keyframe[];
    // private entityTOKeyFrames:Vector4Keyframe[];
    // private entityParam1KeyFrames:Vector4Keyframe[];

    public SetEntity(id: string, commandEntity: MeshEffectCommandEntity) {
        this.entityID = id;

        this.transform = this.owner.transform as Transform3D;

        // if(!this.CustomDefaultParam)
        // {
        //     MeshEffectEntityMaterial.getDefaultParam(commandEntity.material,this.EntityColor,this.EntityTilingOffset,this.EntityParam1);
        // }

        this.commandEntity = commandEntity;
    }

    public SetEntityFirst(id: string, commandEntity: MeshEffectCommandEntity, cmd: CommandBuffer): MeshEffectCommandEntity {
        this.entityID = id;

        this.transform = this.owner.transform as Transform3D;
        if (!this.mesh || !this.mesh._subMeshes || !this.paramMaterial || !this.paramMaterial.shaderData) {
            return null;
        }
        commandEntity = new MeshEffectCommandEntity(id);
        let mat = new MeshEffectEntityMaterial();
        mat.cloneSceneEffectCommonMat(this.paramMaterial);
        //this.paramMaterial.destroy();
        // if(!this.CustomDefaultParam)
        // {
        //     MeshEffectEntityMaterial.getDefaultParam(mat,this.EntityColor,this.EntityTilingOffset,this.EntityParam1);
        // }

        commandEntity.addCommandToCMD(cmd, this.mesh, mat);

        this.commandEntity = commandEntity;

        return commandEntity;
    }


    //组件被启用后执行，例如节点被添加到舞台后
    onEnable(): void {
        if (!this.commandEntity)
            return;
        // if(this.animDelaying && this.firstAwake) //Temp
        // {
        //     return;
        // }
        //this.firstAwake = false;
        this.commandEntity.addToCommand(this);
        //this.animTimer = 0;
    }

    //组件被禁用时执行，例如从节点从舞台移除后
    onDisable(): void {
        if (!this.commandEntity)
            return;
        this.commandEntity.removeFromCommand(this.id);
        //this.animTimer = 0;
    }
}

export class MeshEffectCommandEntity {
    public static readonly MaxRenderSize: number = 1024;

    public readonly entityID: string;

    private _entityMap: Map<number, MeshEffectEntity> = new Map<number, MeshEffectEntity>();

    private _l2mMatrices: Matrix4x4[] = [];

    private _entityColors: Vector4[] = [];
    private _entityTilingOffsets: Vector4[] = [];
    private _entityParam1s: Vector4[] = [];

    public material: MeshEffectEntityMaterial;

    public get renderEmpty() {
        return this.renderCount < 1;
    };

    public get renderCount() {
        return this._entityMap.size;
    }

    private command: DrawMeshInstancedCMD;
    private materialBlock: MaterialInstancePropertyBlock = new MaterialInstancePropertyBlock();

    private lastCount: number = 0;

    constructor(id: string) {
        this.entityID = id;
    }

    addToCommand(entity: MeshEffectEntity) {
        if (this.renderCount >= MeshEffectCommandEntity.MaxRenderSize) {
            return;
        }
        this._entityMap.set(entity.id, entity);
        this.refreshCommandDrawCount();
    }

    removeFromCommand(id: number) {
        this._entityMap.delete(id);
        this.refreshCommandDrawCount();
    }

    addCommandToCMD(cmd: CommandBuffer, mesh: Mesh, material: MeshEffectEntityMaterial) {
        this.material = material;
        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityColor, this._entityColors, InstanceLocation.CUSTOME0);
        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityTilingOffset, this._entityTilingOffsets, InstanceLocation.CUSTOME1);
        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityParam1, this._entityParam1s, InstanceLocation.CUSTOME2);
        //console.log(`${cmd.name}执行绘制`);
        this.command = cmd.drawMeshInstance(mesh, 0, this._l2mMatrices, this.material, 0, this.materialBlock, this._l2mMatrices.length);

        this.lastCount = this._l2mMatrices.length;
    }

    refreshCommandMatrices() {
        if (this.renderCount !== this.lastCount || this.renderEmpty)
            return;
        this._l2mMatrices = [];
        this._entityMap.forEach(value => {
            this._l2mMatrices.push(value.transform.worldMatrix);
        });

        this.command.setWorldMatrix(this._l2mMatrices);
    }

    refreshCommandDrawCount() {
        this._l2mMatrices = [];
        this._entityColors = [];
        this._entityTilingOffsets = [];
        this._entityParam1s = [];

        this._entityMap.forEach(value => {
            this._l2mMatrices.push(value.transform.worldMatrix);
            this._entityColors.push(value.EntityColor);
            this._entityTilingOffsets.push(value.EntityTilingOffset);
            this._entityParam1s.push(value.EntityParam1);
        });

        const curCount = this._l2mMatrices.length;
        if (this.lastCount < curCount) {
            this.command.setWorldMatrix(this._l2mMatrices);
            this.command.setDrawNums(curCount);
        }
        else {
            this.command.setDrawNums(curCount);
            this.command.setWorldMatrix(this._l2mMatrices);
        }

        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityColor, this._entityColors, InstanceLocation.CUSTOME0);
        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityTilingOffset, this._entityTilingOffsets, InstanceLocation.CUSTOME1);
        this.materialBlock.setVectorArray(MeshEffectEntityMaterial.EntityParam1, this._entityParam1s, InstanceLocation.CUSTOME2);

        this.lastCount = curCount;

        // if(this.renderEmpty)
        // {
        //     this.command?.destroy();
        //     this.command = null;
        //     this.material = null;
        // }
    }

    clearRenderData() {
        this.material.destroy();
        this.material = null;
        this._entityMap.clear();
        this.materialBlock.clear();
        this.materialBlock = null;
        this._l2mMatrices = [];
        this._entityColors = [];
        this._entityTilingOffsets = [];
        this._entityParam1s = [];
    }
}
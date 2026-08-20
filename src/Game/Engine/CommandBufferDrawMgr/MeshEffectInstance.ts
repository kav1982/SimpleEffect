import CommandBuffer = Laya.CommandBuffer;
import Node = Laya.Node;
import Camera = Laya.Camera;
import CameraEventFlags = Laya.CameraEventFlags;
import { MeshEffectCommandEntity, MeshEffectEntity } from "./MeshEffectEntity";
import { MeshEffectInstanceMgr } from "./MeshEffectInstanceMgr";
import { GlobalShaderData } from "../GlobalShaderData";

const { regClass, property } = Laya;

@regClass()
export class MeshEffectInstance extends Laya.Script {

    @property(String)
    public MeshEffectID: string;

    private cmdInstance: MeshEffectCMDInstance;

    // @property(AnimationClip)
    // public animationClip:AnimationClip;
    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    onAwake(): void {
        if (Laya.LayaGL.renderEngine.getCapable(Laya.RenderCapable.DrawElement_Instance)){
            let cmdInstance = MeshEffectInstanceMgr.renderDic.get(this.MeshEffectID);
            if (!cmdInstance) {
                cmdInstance = new MeshEffectCMDInstance(this.MeshEffectID);
                cmdInstance.SetCamera(GlobalShaderData.getInstance()?.camera);
                MeshEffectInstanceMgr.renderDic.set(this.MeshEffectID, cmdInstance);
            }
            cmdInstance.InitCommandEntity(this.owner, null, true);
            this.cmdInstance = cmdInstance;
        }
    }

    onDestroy() {
        this.cmdInstance?.reduceRefCount();
    }
}

export class MeshEffectCMDInstance {
    public readonly MeshEffectID: string;
    private _renderEmpty: boolean = false;
    private camera: Camera;
    private refCount = 0;
    public get renderEmpty() {
        return this._renderEmpty;
    };
    private _commandEntityDic: Map<string, MeshEffectCommandEntity> = new Map<string, MeshEffectCommandEntity>();
    private commandBuffer: CommandBuffer;
    private onShowEffect: boolean = false;
    constructor(id: string) {
        this.MeshEffectID = id;
        this.commandBuffer = new CommandBuffer(id);
    }

    reduceRefCount() {
        if (this.refCount == 0) return;
        this.refCount--;
        if (this.refCount < 1) {
            this._renderEmpty = true
            this.hideEffect();
            this.commandBuffer.clear();
            this._commandEntityDic.forEach(value => {
                value.clearRenderData();
            });
            this._commandEntityDic.clear();
            MeshEffectInstanceMgr.renderDic.delete(this.MeshEffectID);
        }
    }

    SetCamera(camera: Camera) {
        this.camera = camera;
    }

    InitCommandEntity(owner: Node, idStr: string, isRootNode: boolean = false) {
        if (isRootNode)
            this.refCount++;
        if (owner.numChildren > 0) {
            for (let i = 0; i < owner.numChildren; i++) {
                let child = owner.getChildAt(i);
                let entity = child.getComponent(MeshEffectEntity);
                let curIdStr = isRootNode ? child.name : idStr + "/" + child.name;
                if (entity) {
                    let commandEntity = this._commandEntityDic.get(curIdStr);
                    if (!commandEntity) {
                        commandEntity = entity.SetEntityFirst(curIdStr, commandEntity, this.commandBuffer);
                        if (commandEntity) {
                            this._commandEntityDic.set(curIdStr, commandEntity);
                        }
                    } else {
                        entity.SetEntity(curIdStr, commandEntity);
                    }
                }
                if (child.numChildren > 0) {
                    this.InitCommandEntity(child, curIdStr, false);
                }
            }
        }
    }

    showEffect() {
        if (this.onShowEffect)
            return;
        // onAwake 时相机可能尚未绑定（EditorSceneSet 异步 setCamera），此处重新取一次
        const camera = GlobalShaderData.getInstance()?.camera;
        if (!camera)
            return;
        this.camera = camera;
        this.camera.addCommandBuffer(CameraEventFlags.BeforeTransparent, this.commandBuffer);
        this.onShowEffect = true;
    }

    hideEffect() {
        if (!this.onShowEffect || !this.camera)
            return;
        this.camera.removeCommandBuffer(CameraEventFlags.BeforeTransparent, this.commandBuffer);
        this.onShowEffect = false;
    }

    refreshCommandEntityMatrices() {
        this._renderEmpty = true;
        this._commandEntityDic.forEach(value => {
            if (!value.renderEmpty) {
                value.refreshCommandMatrices();
                this._renderEmpty = false;
            }
        });

        if (this._renderEmpty) {
            this.hideEffect();
        }
        else {
            this.showEffect();
        }
    }
}
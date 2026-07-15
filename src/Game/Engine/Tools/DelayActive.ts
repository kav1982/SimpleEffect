import Sprite3D = Laya.Sprite3D;
import Sprite = Laya.Sprite;
//import {MeshEffectEntity} from "../CommandBufferDrawMgr/MeshEffectEntity";

const { regClass, property } = Laya;

@regClass()
export class DelayActive extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    //declare owner : Laya.Sprite;

    @property(Number)
    public delayTime: number = 1.0;

    private isInDelayProc: boolean = false;

    private delayTimer: number = 0;


    Awake(): void {
        if (!this.isInDelayProc) {
            this.setChildActive(this.owner, false);
            this.delayTimer = 0;
            this.isInDelayProc = true;
        }
    }

    private delayFunc() {
        this.setChildActive(this.owner, true);
        this.isInDelayProc = false;
    }

    private setChildActive(owner: Sprite | Sprite3D, isActive: boolean, recursion: boolean = true) {

        //owner.active = isActive;
        if (owner.numChildren > 0) {
            for (let i = 0; i < owner.numChildren; i++) {
                const child = owner.getChildAt(i) as Sprite | Sprite3D;
                child.active = isActive;
                // const effectEntity = child.getComponent(MeshEffectEntity);
                // if(effectEntity)
                // {
                //     effectEntity.delayingPlayAnim(!isActive);
                // }
                if (recursion) {
                    this.setChildActive(child, isActive, recursion);
                }
            }
        }
    }

    //组件被启用后执行，例如节点被添加到舞台后
    onEnable(): void {
        this.Awake();
    }

    //组件被禁用时执行，例如从节点从舞台移除后
    onDisable(): void {
        if (this.isInDelayProc) {
            this.isInDelayProc = false;
            this.delayTimer = 0;
        }
    }

    onUpdate() {
        if (!this.isInDelayProc)
            return;

        if (this.delayTimer < this.delayTime) {
            this.delayTimer += Laya.timer.delta * 0.001;
        }
        else {
            this.delayFunc();
            this.delayTimer = 0;
            this.isInDelayProc = false;
        }
    }
}
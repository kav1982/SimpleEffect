// 保证打包顺序：CustomMaterial 必须在各 *Material 子类之前完成定义
import "../../CustomShader/CustomMaterial";
import Camera = Laya.Camera;
import { Debug } from "../../Core/Debug";
import { GlobalShaderData } from "../GlobalShaderData";
import { ShaderVariantHelper } from "../ShaderVariantHelper";
import { RenderHelper } from "../RenderHelper";

const { regClass, property } = Laya;

@regClass()
export class EditorSceneSet extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    //declare owner : Laya.Sprite;

    @property(Camera)
    public camera: Camera;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    async onAwake(): Promise<void> {

        console.error("当前引擎版本" + Laya.LayaEnv.version + "，粒子制作时建议用原版");

        ShaderVariantHelper.ignorePreCompile = true;
        await ShaderVariantHelper.ensureEffectShadersLoaded();

        if (!this.camera) {
            Debug.LogError("请拖拽Camera组件到EditorSceneSet!  挂载点:" + Debug.getNodePath(this.owner));
            return;
        }

        if (this.camera.renderTarget != null) {
            RenderHelper.setRenderTextureParam(this.camera.renderTarget, true, false);
        }

        let globalShaderData = this.owner.getComponent(GlobalShaderData);
        if (!globalShaderData) {
            globalShaderData = this.owner.addComponent(GlobalShaderData);
        }
        globalShaderData.AutoFresh = true;

        // GlobalShaderData 在同节点可能排在后面 onAwake，延迟绑定相机
        Laya.timer.callLater(this, () => {
            GlobalShaderData.getInstance()?.setCamera(this.camera);
        });
    }
}
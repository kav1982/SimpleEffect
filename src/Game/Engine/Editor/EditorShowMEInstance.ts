import { MeshEffectInstance } from "../CommandBufferDrawMgr/MeshEffectInstance";
import LayaEnv = Laya.LayaEnv;
import { EditorShowMEEntity } from "./EditorShowMEEntity";
import { RenderHelper } from "../RenderHelper";
import { MeshEffectEntity } from "../CommandBufferDrawMgr/MeshEffectEntity";
import MeshRenderer = Laya.MeshRenderer;
import MeshFilter = Laya.MeshFilter;
import { MeshEffectEntityMaterial } from "../../CustomShader/InstanceMaterial/MeshEffectEntityMaterial";
import { EditorTools } from "./EditorTools";

const { regClass, property, runInEditor } = Laya;

@regClass() @runInEditor
export class EditorShowMEInstance extends Laya.Script {

    @property({ type: Boolean, caption: "自动添加套件" })
    autoSetInstance: boolean = false;

    editorShowEntitys: EditorShowMEEntity[] = [];
    onEnable() {
        if (LayaEnv.isPlaying) {
            // EditorTools.EditorScriptLog("EditorShowMEInstance",this.owner);
            return;
        }

        if (!this.owner.getComponent(MeshEffectInstance))
            return;

        const entitys = RenderHelper.GetComponentsInChild(this.owner, MeshEffectEntity);
        this.editorShowEntitys = [];
        for (let entity of entitys) {
            let edEntity = entity.owner.getComponent(EditorShowMEEntity);
            if (!edEntity) {
                edEntity = entity.owner.addComponent(EditorShowMEEntity);
            }
            this.editorShowEntitys.push(edEntity);
        }
    }

    onUpdate() {
        if (!this.autoSetInstance)
            return;

        this.setChildInstance();
        this.autoSetInstance = false;
    }

    setChildInstance() {
        if (!this.owner.getComponent(MeshEffectInstance))
            this.owner.addComponent(MeshEffectInstance);

        const renderers = RenderHelper.GetComponentsInChild(this.owner, MeshRenderer);
        //const filters = RenderHelper.GetComponentsInChild(this.owner,MeshFilter);
        for (const renderer of renderers) {
            const filter = renderer.owner.getComponent(MeshFilter);
            if (!renderer.sharedMaterial || !filter || !filter.sharedMesh) {
                console.error(renderer.owner.name + " 物体组件信息有误！");
                continue;
            }

            let entity = renderer.owner.getComponent(MeshEffectEntity);
            if (!entity)
                entity = renderer.owner.addComponent(MeshEffectEntity);

            entity.mesh = filter.sharedMesh;
            entity.paramMaterial = renderer.sharedMaterial;

            MeshEffectEntityMaterial.getDefaultParam(entity.paramMaterial, entity.EntityColor, entity.EntityTilingOffset, entity.EntityParam1);
        }

        this.onEnable();
    }

    onDisable() {
        if (LayaEnv.isPlaying) {
            return;
        }
        this.editorShowEntitys.forEach(value => {
            value?.destroy();
        });
    }
}
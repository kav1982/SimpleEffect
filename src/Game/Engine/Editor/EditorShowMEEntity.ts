import LayaEnv = Laya.LayaEnv;
import MeshRenderer = Laya.MeshRenderer;
import Color = Laya.Color;
import Vector4 = Laya.Vector4;
import MeshFilter = Laya.MeshFilter;
import { MeshEffectEntity } from "../CommandBufferDrawMgr/MeshEffectEntity";
import { EditorTools } from "./EditorTools";

const { regClass, property, runInEditor } = Laya;

@regClass() @runInEditor
export class EditorShowMEEntity extends Laya.Script {

    private renderer: MeshRenderer;
    private filter: MeshFilter;
    onEnable() {
        if (LayaEnv.isPlaying) {
            // EditorTools.EditorScriptLog("EditorShowMEEntity",this.owner);
        }
    }

    onLateUpdate(): void {
        const entity = this.owner.getComponent(MeshEffectEntity);
        if (!entity || !entity.paramMaterial || !entity.mesh)
            return;
        this.renderer = this.owner.getComponent(MeshRenderer);
        if (!this.renderer) {
            this.renderer = this.owner.addComponent(MeshRenderer);
        }
        this.renderer.sharedMaterial = entity.paramMaterial;

        this.filter = this.owner.getComponent(MeshFilter);
        if (!this.filter) {
            this.filter = this.owner.addComponent(MeshFilter);
        }
        this.filter.sharedMesh = entity.mesh;

        if (LayaEnv.isPlaying) {
            this.renderer.enabled = false;
            return;
        }
        const mat = this.renderer.sharedMaterial;
        const col = new Color(Color.linearToGammaSpace(entity.EntityColor.x), Color.linearToGammaSpace(entity.EntityColor.y),
            Color.linearToGammaSpace(entity.EntityColor.z), entity.EntityColor.w);
        mat.setColor("u_AlbedoColor", col);

        let tilingOffset = mat.getVector4("u_TilingOffset");
        const u_TilingOffset = new Vector4(tilingOffset ? tilingOffset.x : 1, tilingOffset ? tilingOffset.y : 1,
            entity.EntityTilingOffset.x, entity.EntityTilingOffset.y);
        mat.setVector4("u_TilingOffset", u_TilingOffset);

        let maskTilingOffset = mat.getVector4("_MaskTilingOffset");
        const _MaskTilingOffset = new Vector4(maskTilingOffset ? maskTilingOffset.x : 1, maskTilingOffset ? maskTilingOffset.y : 1,
            entity.EntityTilingOffset.z, entity.EntityTilingOffset.w);
        mat.setVector4("_MaskTilingOffset", _MaskTilingOffset);

        let dissolveParam = mat.getVector4("_DissolveParam");
        const _DissolveParam = new Vector4(dissolveParam ? dissolveParam.x : 0, dissolveParam ? dissolveParam.y : 0,
            entity.EntityParam1.x, dissolveParam ? dissolveParam.w : 0.5);
        mat.setVector4("_DissolveParam", _DissolveParam);

        let dissolveParam2 = mat.getVector4("_DissolveParam2");
        const _DissolveParam2 = new Vector4(entity.EntityParam1.y, dissolveParam2 ? dissolveParam2.y : 0,
            dissolveParam2 ? dissolveParam2.z : 1, dissolveParam2 ? dissolveParam2.w : 1);
        mat.setVector4("_DissolveParam2", _DissolveParam2);

        let AlbedoTextureUVAnim = mat.getVector4("_AlbedoTextureUVAnim");
        const _AlbedoTextureUVAnim = new Vector4(AlbedoTextureUVAnim ? AlbedoTextureUVAnim.x : 0,
            AlbedoTextureUVAnim ? AlbedoTextureUVAnim.y : 0,
            entity.EntityParam1.z, AlbedoTextureUVAnim ? AlbedoTextureUVAnim.w : 0);
        mat.setVector4("_AlbedoTextureUVAnim", _AlbedoTextureUVAnim);

        mat.setFloat("u_SheetProgress", entity.EntityParam1.w);
    }

    onDisable() {
        if (LayaEnv.isPlaying) {
            return;
        }
        this.renderer?.destroy();
        this.filter?.destroy();
    }
}
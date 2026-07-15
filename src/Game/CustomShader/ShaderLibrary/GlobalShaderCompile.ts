import { BakeMeshInstanceMaterial } from "../InstanceMaterial/BakeMeshInstanceMaterial";
import { MeshEffectEntityMaterial } from "../InstanceMaterial/MeshEffectEntityMaterial";
import { SpriteInstanceMaterial } from "../InstanceMaterial/SpriteInstanceMaterial";
import { TrailCommonMaterial } from "../InstanceMaterial/TrailCommonMaterial";

/** 独立文件注册自定义 Shader，避免 GlobalShaderInit 顶层 import 导致打包顺序问题 */
export function runCustomShaderCompile(): void {
    SpriteInstanceMaterial.InitShader();
    BakeMeshInstanceMaterial.InitShader();
    MeshEffectEntityMaterial.InitShader();
    TrailCommonMaterial.InitShader();
}

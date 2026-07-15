import { RenderHelper } from "../RenderHelper";
import { BakeMeshInstanceMaterial } from "../../CustomShader/InstanceMaterial/BakeMeshInstanceMaterial";
import { SpriteInstanceMaterial } from "../../CustomShader/InstanceMaterial/SpriteInstanceMaterial";

const { regClass, property } = Laya;

import Color = Laya.Color;
import Vector4 = Laya.Vector4;

@regClass()
export class SceneTintSetting {
    @property(Color)
    public SceneTintColor: Color = new Color(0.05, 0.15, 0.45, 1);

    @property(Number)
    public SceneTintIntensity: number = 0;

    @property(Number)
    public SceneTintDesaturate: number = 0;

    static readonly u_SceneTintColor: string = "u_SceneTintColor";
    static readonly u_SceneTintParams: string = "u_SceneTintParams";

    private static register: boolean = false;
    private sceneTintParams: Vector4 = new Vector4();

    Register() {
        if (!SceneTintSetting.register) {
            RenderHelper.RegisterGlobalColor(SceneTintSetting.u_SceneTintColor);
            RenderHelper.RegisterGlobalVector4(SceneTintSetting.u_SceneTintParams);

            SceneTintSetting.register = true;
        }
    }

    public SetSceneTint(color: Color, intensity: number, desaturate: number = 0): void {
        if (color) {
            this.SceneTintColor.setValue(color.r, color.g, color.b, color.a);
        }
        this.SceneTintIntensity = intensity;
        this.SceneTintDesaturate = desaturate;
        this.RefreshData();
    }

    public GetSceneTintColor(): Color {
        return this.SceneTintColor;
    }

    public RefreshData(): void {
        this.sceneTintParams.setValue(this.SceneTintIntensity, this.SceneTintDesaturate, 0, 0);
        RenderHelper.SetGlobalShaderColor(SceneTintSetting.u_SceneTintColor, this.SceneTintColor);
        RenderHelper.SetGlobalShaderVector4(SceneTintSetting.u_SceneTintParams, this.sceneTintParams);
        SpriteInstanceMaterial.SetSceneTintData(this.SceneTintColor, this.sceneTintParams);
        BakeMeshInstanceMaterial.SetSceneTintData(this.SceneTintColor, this.sceneTintParams);
    }
}

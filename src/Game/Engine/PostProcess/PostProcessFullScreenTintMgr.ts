import { GlobalShaderData } from "../GlobalShaderData";

import Color = Laya.Color;

/** 纯逻辑类，不走 Laya 组件注册，避免 IDE 对非 Script 类做 instanceof 检查报错 */
export class PostProcessFullScreenTintMgr {

    public Enable: boolean = false;

    public TintColor: Color = new Color(0.05, 0.15, 0.45, 1.0);

    public Intensity: number = 1;

    public FadeInTime: number = 0.5;

    public FadeOutTime: number = 0.5;

    private _currentIntensity: number = 0;
    private _targetIntensity: number = 0;
    private _desaturate: number = 0;

    public Play(color: Color = null, fadeTime: number = 0.5, intensity: number = 1): void {
        this.SetEnable(true, color, fadeTime, intensity);
    }

    public SetEnable(enable: boolean, color: Color = null, fadeTime: number = -1, intensity: number = -1): void {
        this.Enable = enable;

        if (!color && enable) {
            color = GlobalShaderData.getInstance()?.GetSceneTintColor();
        }

        if (color) {
            this.TintColor.setValue(color.r, color.g, color.b, color.a);
        }

        if (intensity >= 0) {
            this.Intensity = intensity;
        }

        this._targetIntensity = enable ? this.Intensity : 0;

        if (fadeTime >= 0) {
            if (enable) {
                this.FadeInTime = fadeTime;
            } else {
                this.FadeOutTime = fadeTime;
            }
        }
    }

    public Stop(fadeTime: number = -1): void {
        if (fadeTime >= 0) {
            this.FadeOutTime = fadeTime;
        }

        this.Enable = false;
        this._targetIntensity = 0;
        this.SetDesaturate(false);
    }

    public SetDesaturate(enable: boolean): void {
        this._desaturate = enable ? 1 : 0;
        this.RefreshShaderData();
    }

    public Update(deltaTime: number): void {
        this.updateTint(deltaTime * 0.001);
        this.RefreshShaderData();
    }

    private updateTint(deltaTime: number): void {
        this._targetIntensity = this.Enable ? this.Intensity : 0;
        this.updateIntensity(deltaTime);
    }

    private updateIntensity(deltaTime: number): void {
        if (this._currentIntensity === this._targetIntensity)
            return;

        let fadeTime: number = this._targetIntensity > this._currentIntensity ? this.FadeInTime : this.FadeOutTime;
        if (fadeTime <= 0) {
            this._currentIntensity = this._targetIntensity;
            return;
        }

        let step: number = deltaTime / fadeTime;
        if (this._targetIntensity > this._currentIntensity) {
            this._currentIntensity = Math.min(this._currentIntensity + step, this._targetIntensity);
        } else {
            this._currentIntensity = Math.max(this._currentIntensity - step, this._targetIntensity);
        }
    }

    private RefreshShaderData(): void {
        GlobalShaderData.getInstance()?.SetSceneTintData(this.TintColor, this._currentIntensity, this._desaturate);
    }
}

import Transform3D = Laya.Transform3D;
import { RenderHelper } from "../RenderHelper";
import Vector3 = Laya.Vector3;

const { regClass, property } = Laya;

@regClass()
export class BGCtrlSetting {

    @property(Number)
    public zFactor: number = 0.3;

    @property(Number)
    public yFactor: number = 0.3;

    @property(Number)
    public zStart: number = 2;
}
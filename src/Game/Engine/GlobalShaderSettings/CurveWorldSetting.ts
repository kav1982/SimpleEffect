import Transform3D = Laya.Transform3D;
import { RenderHelper } from "../RenderHelper";
import Vector3 = Laya.Vector3;
const { regClass, property } = Laya;

@regClass()
export class CurveWorldSetting {

    @property(Number)
    public Plane: number = 0;

    @property(Number)
    public BlendSize: number = 6;

    @property(Number)
    public BlendOffset: number = 8;

    @property(Number)
    public DitherClipStart: number = 8;

    @property(Number)
    public DitherClipEnd: number = 9.5;

    private camTransform: Transform3D;
    private rayDirection: Vector3 = new Vector3();
    private intersectionPoint: Vector3 = new Vector3();

    static readonly u_CurvePivotPoint: string = "u_CurvePivotPoint";
    static readonly u_CurveBendOffset: string = "u_CurveBendOffset";
    static readonly u_CurveBendSize: string = "u_CurveBendSize";
    static readonly u_DitherClipStart: string = "u_DitherClipStart";
    static readonly u_DitherClipEnd: string = "u_DitherClipEnd";

    private static register: boolean = false;

    Register() {
        if (!CurveWorldSetting.register) {
            RenderHelper.RegisterGlobalVector3(CurveWorldSetting.u_CurvePivotPoint);
            RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_CurveBendOffset);
            RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_CurveBendSize);
            RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_DitherClipStart);
            RenderHelper.RegisterGlobalFloat(CurveWorldSetting.u_DitherClipEnd);

            CurveWorldSetting.register = true;
        }
    }

    public SetCamTransform(transform: Transform3D): void {
        this.camTransform = transform;
    }

    public GetIntersectPosByCamRay(): void {
        if (!this.camTransform)
            return;
        let rayOrigin = this.camTransform.position;
        this.camTransform.getForward(this.rayDirection);

        let t = (this.Plane - rayOrigin.y) / this.rayDirection.y;
        this.intersectionPoint.setValue(rayOrigin.x + this.rayDirection.x * t, this.Plane, rayOrigin.z + this.rayDirection.z * t);
    }

    public RefreshData(): void {
        RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_CurveBendOffset, this.BlendOffset);
        RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_CurveBendSize, this.BlendSize);
        RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_DitherClipStart, 1.0 - this.DitherClipStart * 0.001);
        RenderHelper.SetGlobalShaderFloat(CurveWorldSetting.u_DitherClipEnd, 1.0 - this.DitherClipEnd * 0.001);
    }

    public RefreshTarget(): void {
        RenderHelper.SetGlobalShaderVector3(CurveWorldSetting.u_CurvePivotPoint, this.intersectionPoint);
    }

    private max(a: Laya.Vector2, b: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(Math.max(a.x, b.x), Math.max(a.y, b.y));
    }

    private abs(v: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(Math.abs(v.x), Math.abs(v.y));
    }

    private step(edge: Laya.Vector2, x: Laya.Vector2): Laya.Vector2 {
        return new Laya.Vector2(x.x < edge.x ? 0 : 1, x.y < edge.y ? 0 : 1);
    }

    public getCurvedPos(originPos: Vector3): Vector3 {
        // console.log("弯曲前----------------");
        // console.log(originPos);
        let posWS = new Laya.Vector3(originPos.x, originPos.y, originPos.z);
        posWS.x -= this.intersectionPoint.x;
        posWS.y -= this.intersectionPoint.y;
        posWS.z -= this.intersectionPoint.z;

        let tmpVector = this.abs(new Laya.Vector2(posWS.x, posWS.z));
        tmpVector.x -= this.BlendOffset;
        tmpVector.y -= this.BlendOffset;
        let offset = this.max(new Laya.Vector2(0.0, 0.0), tmpVector);
        let stepResult = this.step(new Laya.Vector2(0.0, 0.0), new Laya.Vector2(posWS.x, posWS.z));
        let adjustedOffset = new Laya.Vector2(offset.x * (stepResult.x * 2.0 - 1.0), offset.y * (stepResult.y * 2.0 - 1.0));
        let squareOffset = new Laya.Vector2(adjustedOffset.x * adjustedOffset.x, adjustedOffset.y * adjustedOffset.y);

        let tmp = (this.BlendSize * squareOffset.x + this.BlendSize * squareOffset.y) * 0.001;
        let reducedPrecision = tmp;

        posWS.setValue(0.0, -reducedPrecision, 0.0);
        // console.log(posWS);
        // console.log(originPos)
        let res = new Laya.Vector3(originPos.x + posWS.x,
            originPos.y + posWS.y,
            originPos.z + posWS.z);
        // console.log("弯曲后----------------");
        // console.log(res);
        return res;
    }
}
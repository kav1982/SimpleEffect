import Vector3 = Laya.Vector3;
import Color = Laya.Color;
import {RenderHelper} from "../RenderHelper";

const { regClass, property } = Laya;

@regClass()
export class PlaneShadowSetting{
    
    @property(Vector3)
    public PlaneShadowLightDir:Vector3 = new Vector3(1,1,1);
    
    @property(Color)
    public PlaneShadowColor:Color = new Color(0,0,0,0.4);
    
    @property(Number)
    public PlaneShadowPlane:number = 0.01;

    static readonly u_PlaneShadowLightDir:string = "u_PlaneShadowLightDir";
    static readonly u_PlaneShadowColor:string = "u_PlaneShadowColor";
    static readonly u_PlaneShadowPlane:string = "u_PlaneShadowPlane";

    private static register:boolean = false;

    Register()
    {
        if(!PlaneShadowSetting.register)
        {
            RenderHelper.RegisterGlobalVector3(PlaneShadowSetting.u_PlaneShadowLightDir);
            RenderHelper.RegisterGlobalColor(PlaneShadowSetting.u_PlaneShadowColor);
            RenderHelper.RegisterGlobalFloat(PlaneShadowSetting.u_PlaneShadowPlane);

            PlaneShadowSetting.register = true;
        }
    }

    public RefreshData():void
    {
        RenderHelper.SetGlobalShaderVector3(PlaneShadowSetting.u_PlaneShadowLightDir,this.PlaneShadowLightDir);
        RenderHelper.SetGlobalShaderColor(PlaneShadowSetting.u_PlaneShadowColor,this.PlaneShadowColor);
        RenderHelper.SetGlobalShaderFloat(PlaneShadowSetting.u_PlaneShadowPlane,this.PlaneShadowPlane);
    }
}
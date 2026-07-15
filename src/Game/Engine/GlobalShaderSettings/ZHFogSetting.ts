import {RenderHelper} from "../RenderHelper";

const { regClass, property } = Laya;

import Color = Laya.Color;
import Vector4 = Laya.Vector4;

@regClass()
export class ZHFogSetting{
    @property(Number)
    public ZFogStart:number;

    @property(Number)
    public ZFogEnd:number;

    @property(Color)
    public ZHFogColor:Color = new Color(0,0,0,0);

    @property(Number)
    public HFogStart:number;

    @property(Number)
    public HFogEnd:number;
    
    private zhFogParam:Vector4 = new Vector4();
    
    /**
     * X:ZFogStart Y:ZFogEnd Z:HFogStart W:HFogEnd
     */
    static readonly u_ZHFogParam:string = "u_ZHFogParam";
    static readonly u_ZHFogColor:string = "u_ZHFogColor";

    private static register:boolean = false;

    Register()
    {
        if(!ZHFogSetting.register)
        {
            RenderHelper.RegisterGlobalVector4(ZHFogSetting.u_ZHFogParam);
            RenderHelper.RegisterGlobalColor(ZHFogSetting.u_ZHFogColor);

            ZHFogSetting.register = true;
        }
    }

    public RefreshData():void
    {
        this.zhFogParam.setValue(this.ZFogStart*0.01,this.ZFogEnd*0.01,this.HFogStart,this.HFogEnd);
        RenderHelper.SetGlobalShaderVector4(ZHFogSetting.u_ZHFogParam,this.zhFogParam);
        RenderHelper.SetGlobalShaderColor(ZHFogSetting.u_ZHFogColor,this.ZHFogColor);
    }
}
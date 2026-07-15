import Text = Laya.Text;
import Stat = Laya.Stat;
import LayaGL = Laya.LayaGL;
import RenderStatisticsInfo = Laya.RenderStatisticsInfo;

const { regClass, property } = Laya;

@regClass()
export class RenderParamShow extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    //declare owner : Laya.Sprite;

    @property(Text)
    public drawCallText: Text;

    private drawCall: number = 0;
    private preDrawCall: number = 0;

    onUpdate(): void {
        if (this.drawCallText != null) {
            this.drawCall = (LayaGL.renderEngine as any).getStatisticsInfo(RenderStatisticsInfo.DrawCall);
            if (this.preDrawCall !== this.drawCall) {
                this.preDrawCall = this.drawCall;
                this.drawCallText.text = "DrawCall: " + this.drawCall.toString();
            }
            (LayaGL.renderEngine as any).clearStatisticsInfo(RenderStatisticsInfo.DrawCall);
        }
    }
}
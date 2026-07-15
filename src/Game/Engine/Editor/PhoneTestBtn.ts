import Button = Laya.Button;
import Handler = Laya.Handler;
import Sprite3D = Laya.Sprite3D;
import { GlobalShaderInit } from "../../CustomShader/ShaderLibrary/GlobalShaderInit";
import { ECSTimeUtil } from "../Util/TimeUtil";
import { PostProcessFullScreenTintMgr } from "../PostProcess/PostProcessFullScreenTintMgr";
import { ShaderVariantHelper } from "../ShaderVariantHelper";
import Vector3 = Laya.Vector3;
import Color = Laya.Color;
import Text = Laya.Text;

const { regClass, property } = Laya;

@regClass()
export class PhoneTestBtn extends Laya.Script {
    //declare owner : Laya.Sprite3D;
    //declare owner : Laya.Sprite;

    @property(Button)
    public createBtn: Button;

    @property(Button)
    public showHideBtn: Button;

    @property(Button)
    public switchBtn: Button;

    @property(Button)
    public loadAllBtn: Button;
    @property(Button)
    public btnFullScreenTint: Button;
    @property(Button)
    public btnNormalScreenTint: Button;
    @property(Button)
    public btnTintColor: Button;
    @property(Button)
    public btnDesaturate: Button;

    @property([String])
    public urls: string[] = [];

    @property(Text)
    public urlShowText: Text;

    @property(Vector3)
    public createPos: Vector3 = new Vector3();

    @property(Color)
    public renderColor: Color = new Color(0.05, 0.15, 0.45, 1);

    @property(Number)
    public FadeTime: number = 0.5;

    private addNode: Sprite3D;
    private prefab: any;

    private createParent: Sprite3D;

    private curIndex: number = 0;

    public fullScreenTintMgr: PostProcessFullScreenTintMgr;

    //组件被激活后执行，此时所有节点和组件均已创建完毕，此方法只执行一次
    async onAwake(): Promise<void> {

        if (this.urls.length < 1)
            return;

        await ShaderVariantHelper.ensureEffectShadersLoaded();

        const createParent = new Sprite3D();
        createParent.name = "EffectParentNode";
        this.createParent = this.owner.scene.addChild(createParent) as Sprite3D;

        const firstUrl = this.urls[0];
        Laya.loader.load(firstUrl).then((res) => {

            if (res == null)
                return;
            this.prefab = res;
            const addPrefab = this.prefab.create() as Sprite3D;
            addPrefab.active = false;
            addPrefab.transform.position = this.createPos;
            this.addNode = this.createParent.addChild(addPrefab) as Sprite3D;

            this.urlShowText.text = firstUrl;

            if (this.createBtn) {
                this.createBtn.clickHandler = new Handler(this, this.onCreate);
            }

            if (this.showHideBtn) {
                this.showHideBtn.clickHandler = new Handler(this, this.onShowHide);
            }

            if (this.switchBtn) {
                this.switchBtn.clickHandler = new Handler(this, this.onSwitch);
            }

            if (this.loadAllBtn) {
                this.loadAllBtn.clickHandler = new Handler(this, this.onLoadAll);
            }
            if (this.btnFullScreenTint) {
                this.btnFullScreenTint.clickHandler = new Handler(this, this.PlayFullScreenTint);
            }
            if (this.btnNormalScreenTint) {
                this.btnNormalScreenTint.clickHandler = new Handler(this, this.SetFullScreenTintDesaturate);
            }
            if (this.btnTintColor) {
                this.btnTintColor.clickHandler = new Handler(this, this.PlayFullScreenTintColor);
            }
            if (this.btnDesaturate) {
                this.btnDesaturate.clickHandler = new Handler(this, this.PlayFullScreenDesaturate);
            }
            this.initFullScreenTintMgr();
        });
    }

    public initFullScreenTintMgr(): void {
        if (!this.fullScreenTintMgr) {
            this.fullScreenTintMgr = new PostProcessFullScreenTintMgr();
        }
    }

    private PlayFullScreenTint(): void {
        GlobalShaderInit.postProcessEnable = true;
        this.fullScreenTintMgr.Play(this.fullScreenTintMgr.TintColor, this.FadeTime, 1);
        this.fullScreenTintMgr.SetDesaturate(true);
    }

    private SetFullScreenTintDesaturate(): void {
        this.fullScreenTintMgr.Stop(this.FadeTime);
    }

    private StopFullScreenTint(): void {
        this.fullScreenTintMgr.SetDesaturate(true);
    }

    //染色
    private PlayFullScreenTintColor(): void {
        GlobalShaderInit.postProcessEnable = true;
        this.fullScreenTintMgr.Play(this.fullScreenTintMgr.TintColor, this.FadeTime, 1);
    }

    //去饱和
    private PlayFullScreenDesaturate(): void {
        this.fullScreenTintMgr.SetDesaturate(true);
    }

    onCreate() {
        const addPrefab = this.prefab.create() as Sprite3D;
        addPrefab.transform.position = this.createPos;
        this.createParent.addChild(addPrefab);
    }

    onShowHide() {
        //this.doDelay(this.addNode.active ? 1 : 1000,()=>{this.addNode.active = !this.addNode.active;});
        if (this.addNode.active) {
            this.addNode.active = false;
        }
        this.addNode.active = true;
    }

    onSwitch() {

        if (this.curIndex < this.urls.length - 1) {
            this.curIndex++;
        }
        else {
            this.curIndex = 0;
        }

        const curUrl = this.urls[this.curIndex];

        Laya.loader.load(curUrl).then((res) => {

            if (res == null)
                return;
            this.prefab = res;
            const addPrefab = this.prefab.create() as Sprite3D;
            addPrefab.active = false;
            addPrefab.transform.position = this.createPos;
            this.createParent.destroyChildren();
            this.addNode = this.createParent.addChild(addPrefab) as Sprite3D;

            this.urlShowText.text = curUrl;
        });
    }

    onLoadAll() {
        Promise.all(this.urls.map((url) => Laya.loader.load(url))).then((res) => {

            if (res == null)
                return;

            for (let prefab of res) {
                const addPrefab = prefab.create() as Sprite3D;
                addPrefab.transform.position = this.createPos;
                this.createParent.addChild(addPrefab);
            }
        });
    }

    async doDelay(time: number, func: any) {
        await ECSTimeUtil.waitAsync(time);
        func();
    }

    onUpdate(): void {
        if (this.fullScreenTintMgr) {
            let t = Laya.timer.delta;
            this.fullScreenTintMgr.FadeInTime = this.FadeTime;
            this.fullScreenTintMgr.FadeOutTime = this.FadeTime;
            this.fullScreenTintMgr?.Update(t);
            this.fullScreenTintMgr.TintColor.setValue(this.renderColor.r, this.renderColor.g, this.renderColor.b, 1);
        }
    }

}
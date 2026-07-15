import { MeshEffectCMDInstance } from "./MeshEffectInstance";

export class MeshEffectInstanceMgr {

    public static renderDic: Map<string, MeshEffectCMDInstance> = new Map<string, MeshEffectCMDInstance>();

    private static _instance: MeshEffectInstanceMgr;

    public static get Instance() {
        return this._instance;
    };

    constructor() {
        if (MeshEffectInstanceMgr._instance == null) {
            MeshEffectInstanceMgr._instance = this;
        }
        else {
            console.log("MeshEffectInstanceMgr has an Instance!");
        }
    }

    mgrLateUpdate(): void {
        for (const value of MeshEffectInstanceMgr.renderDic.values()) {
            value.refreshCommandEntityMatrices();
        }
    }
}

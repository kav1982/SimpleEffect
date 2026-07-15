import Material = Laya.Material;

export class CustomMaterial extends Material {
    
    protected static ShaderDic:Map<string,boolean> = new Map<string, boolean>();

    LoadShader() {}
    
    constructor() {
        super();
        this.LoadShader();
    }
}
import { StringUtil } from "./Utils/StringUtil";

export class Debug {
    public static LogError(msg: string): void {
        console.error(msg);
    }

    public static Log(msg: string): void {
        console.log(msg);
    }

    public static getNodePath(node: Laya.Node): string {
        const names: string[] = [];
        let cur: Laya.Node = node;
        while (cur) {
            names.unshift(cur.name);
            cur = cur.parent;
        }
        return names.join('/');
    }

    private static GetCurTime(): string {
        const d = new Date();
        return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}.${d.getMilliseconds()}`;
    }

    public static LogWarning(msg: string, tagName: string = "Warning"): void {
        const str = StringUtil.format("[{0}][{1}]{2}", this.GetCurTime(), tagName, msg);
        console.warn(str);
    }
}

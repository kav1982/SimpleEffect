export class ECSTimeUtil {
    public static waitAsync(ms: number): Promise<void> {
        return new Promise((resolve) => {
            Laya.timer.once(ms, null, resolve);
        });
    }
}

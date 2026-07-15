export class StringUtil {
    public static format(fmt: string, ...args: any[]): string {
        let i = 0;
        return fmt.replace(/\{(\d+)\}/g, () => {
            const arg = args[i++];
            return arg === undefined || arg === null ? '' : String(arg);
        });
    }

    public static isNullOrEmpty(value: string): boolean {
        return value == null || value === '';
    }
}

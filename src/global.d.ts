import type { IStaticMethods } from "flyonui/flyonui";

declare global {
    interface Window {
        HSStaticMethods: IStaticMethods;
        HSOverlay: any;
    }
}

export { };
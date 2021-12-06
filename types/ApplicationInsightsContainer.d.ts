import { IAppInsightsDeprecated } from "./ApplicationInsightsDeprecated";
import { Snippet, IApplicationInsights } from "./Initialization";
export declare class ApplicationInsightsContainer {
    static getAppInsights(snippet: Snippet, version: number): IApplicationInsights | IAppInsightsDeprecated;
}

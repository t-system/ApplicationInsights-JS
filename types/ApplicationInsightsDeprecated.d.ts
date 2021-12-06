import { IConfig, SeverityLevel, IEnvelope } from "@microsoft/applicationinsights-common";
import { Snippet, Initialization as ApplicationInsights } from "./Initialization";
import { IDiagnosticLogger, IConfiguration, ICookieMgr } from "@microsoft/applicationinsights-core-js";
export declare class AppInsightsDeprecated implements IAppInsightsDeprecated {
    private static getDefaultConfig;
    config: IConfig & IConfiguration;
    snippet: Snippet;
    context: ITelemetryContext;
    logger: IDiagnosticLogger;
    queue: Array<() => void>;
    private appInsightsNew;
    private _hasLegacyInitializers;
    private _queue;
    constructor(snippet: Snippet, appInsightsNew: ApplicationInsights);
    /**
     * The array of telemetry initializers to call before sending each telemetry item.
     */
    addTelemetryInitializers(callBack: (env: IEnvelope) => boolean | void): void;
    /**
     * Get the current cookie manager for this instance
     */
    getCookieMgr(): ICookieMgr;
    startTrackPage(name?: string): void;
    stopTrackPage(name?: string, url?: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }): void;
    trackPageView(name?: string, url?: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }, duration?: number): void;
    trackEvent(name: string, properties?: Object, measurements?: Object): void;
    trackDependency(id: string, method: string, absoluteUrl: string, pathName: string, totalTime: number, success: boolean, resultCode: number): void;
    trackException(exception: Error, handledAt?: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }, severityLevel?: any): void;
    trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: {
        [name: string]: string;
    }): void;
    trackTrace(message: string, properties?: {
        [name: string]: string;
    }, severityLevel?: any): void;
    flush(async?: boolean): void;
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
    clearAuthenticatedUserContext(): void;
    _onerror(message: string, url: string, lineNumber: number, columnNumber: number, error: Error): void;
    startTrackEvent(name: string): void;
    stopTrackEvent(name: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }): void;
    downloadAndSetup?(config: IConfig): void;
    updateSnippetDefinitions(snippet: Snippet): void;
    loadAppInsights(): this;
    private _processLegacyInitializers;
}
export interface IAppInsightsDeprecated {
    config: IConfig;
    context: ITelemetryContext;
    queue: Array<() => void>;
    /**
     * Get the current cookie manager for this instance
     */
    getCookieMgr(): ICookieMgr;
    /**
     * Starts timing how long the user views a page or other item. Call this when the page opens.
     * This method doesn't send any telemetry. Call `stopTrackPage` to log the page when it closes.
     * @param   name  A string that identifies this item, unique within this HTML document. Defaults to the document title.
     */
    startTrackPage(name?: string): void;
    /**
     * Logs how long a page or other item was visible, after `startTrackPage`. Call this when the page closes.
     * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
     * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
     * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
     * @deprecated API is deprecated; supported only if input configuration specifies deprecated=true
     */
    stopTrackPage(name?: string, url?: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }): void;
    /**
     * Logs that a page or other item was viewed.
     * @param   name  The string you used as the name in `startTrackPage`. Defaults to the document title.
     * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
     * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
     * @param   duration    number - the number of milliseconds it took to load the page. Defaults to undefined. If set to default value, page load time is calculated internally.
     */
    trackPageView(name?: string, url?: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }, duration?: number): void;
    /**
     * Start timing an extended event. Call `stopTrackEvent` to log the event when it ends.
     * @param   name    A string that identifies this event uniquely within the document.
     */
    startTrackEvent(name: string): void;
    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param   name    The string you used to identify this event in `startTrackEvent`.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    stopTrackEvent(name: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }): void;
    /**
     * Log a user action or other occurrence.
     * @param   name    A string to identify this event in the portal.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    trackEvent(name: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }): void;
    /**
     * Log a dependency call
     * @param id    unique id, this is used by the backend to correlate server requests. Use newId() to generate a unique Id.
     * @param method    represents request verb (GET, POST, etc.)
     * @param absoluteUrl   absolute url used to make the dependency request
     * @param pathName  the path part of the absolute url
     * @param totalTime total request time
     * @param success   indicates if the request was successful
     * @param resultCode    response code returned by the dependency request
     */
    trackDependency(id: string, method: string, absoluteUrl: string, pathName: string, totalTime: number, success: boolean, resultCode: number): void;
    /**
     * Log an exception you have caught.
     * @param   exception   An Error from a catch clause, or the string error message.
     * @param   handledAt   Not used
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     * @param   severityLevel   SeverityLevel - severity level
     */
    trackException(exception: Error, handledAt?: string, properties?: {
        [name: string]: string;
    }, measurements?: {
        [name: string]: number;
    }, severityLevel?: SeverityLevel): void;
    /**
     * Log a numeric value that is not associated with a specific event. Typically used to send regular reports of performance indicators.
     * To send a single measurement, use just the first two parameters. If you take measurements very frequently, you can reduce the
     * telemetry bandwidth by aggregating multiple measurements and sending the resulting average at intervals.
     * @param   name    A string that identifies the metric.
     * @param   average Number representing either a single measurement, or the average of several measurements.
     * @param   sampleCount The number of measurements represented by the average. Defaults to 1.
     * @param   min The smallest measurement in the sample. Defaults to the average.
     * @param   max The largest measurement in the sample. Defaults to the average.
     */
    trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number, properties?: {
        [name: string]: string;
    }): void;
    /**
     * Log a diagnostic message.
     * @param   message A message string
     * @param   properties  map[string, string] - additional data used to filter traces in the portal. Defaults to empty.
     * @param   severityLevel   SeverityLevel - severity level
     */
    trackTrace(message: string, properties?: {
        [name: string]: string;
    }, severityLevel?: SeverityLevel): void;
    /**
     * Immediately send all queued telemetry.
     * @param {boolean} async - If flush should be call asynchronously
     */
    flush(async?: boolean): void;
    /**
     * Sets the autheticated user id and the account id in this session.
     * User auth id and account id should be of type string. They should not contain commas, semi-colons, equal signs, spaces, or vertical-bars.
     *
     * @param authenticatedUserId {string} - The authenticated user id. A unique and persistent string that represents each authenticated user in the service.
     * @param accountId {string} - An optional string to represent the account associated with the authenticated user.
     */
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
    /**
     * Clears the authenticated user id and the account id from the user context.
     */
    clearAuthenticatedUserContext(): void;
    downloadAndSetup?(config: IConfig): void;
    /**
     * The custom error handler for Application Insights
     * @param {string} message - The error message
     * @param {string} url - The url where the error was raised
     * @param {number} lineNumber - The line number where the error was raised
     * @param {number} columnNumber - The column number for the line where the error was raised
     * @param {Error}  error - The Error object
     */
    _onerror(message: string, url: string, lineNumber: number, columnNumber: number, error: Error): void;
}
export interface ITelemetryContext {
    /**
     * Adds a telemetry initializer to the collection. Telemetry initializers will be called one by one,
     * in the order they were added, before the telemetry item is pushed for sending.
     * If one of the telemetry initializers returns false or throws an error then the telemetry item will not be sent.
     */
    addTelemetryInitializer(telemetryInitializer: (envelope: IEnvelope) => boolean | void): void;
}

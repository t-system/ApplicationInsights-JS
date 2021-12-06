import { IConfiguration, IAppInsightsCore, ITelemetryItem, ICustomProperties, IDiagnosticLogger, INotificationManager, ICookieMgr } from "@microsoft/applicationinsights-core-js";
import { ApplicationInsights } from "@microsoft/applicationinsights-analytics-js";
import { Sender } from "@microsoft/applicationinsights-channel-js";
import { IDependenciesPlugin } from "@microsoft/applicationinsights-dependencies-js";
import { IUtil, ICorrelationIdHelper, IUrlHelper, IDateTimeUtils, FieldType, IRequestHeaders, AIData, AIBase, Envelope, Event, Exception, Metric, PageView, PageViewData, RemoteDependencyData, IEventTelemetry, ITraceTelemetry, IMetricTelemetry, IDependencyTelemetry, IExceptionTelemetry, IAutoExceptionTelemetry, IPageViewTelemetry, IPageViewPerformanceTelemetry, Trace, PageViewPerformance, Data, SeverityLevel, IConfig, ConfigurationManager, ContextTagKeys, IDataSanitizer, TelemetryItemCreator, IAppInsights, IPropertiesPlugin, DistributedTracingModes, ITelemetryContext as Common_ITelemetryContext, parseConnectionString } from "@microsoft/applicationinsights-common";
/**
 *
 * @export
 * @interface Snippet
 */
export interface Snippet {
    config: IConfiguration & IConfig;
    queue?: Array<() => void>;
    sv?: string;
    version?: number;
}
export interface IApplicationInsights extends IAppInsights, IDependenciesPlugin, IPropertiesPlugin {
    appInsights: ApplicationInsights;
    flush: (async?: boolean) => void;
    onunloadFlush: (async?: boolean) => void;
    getSender: () => Sender;
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
    clearAuthenticatedUserContext(): void;
}
/**
 * Telemetry type classes, e.g. PageView, Exception, etc
 */
export declare const Telemetry: {
    __proto__: any;
    PropertiesPluginIdentifier: string;
    BreezeChannelIdentifier: string;
    AnalyticsPluginIdentifier: string;
    Util: IUtil;
    CorrelationIdHelper: ICorrelationIdHelper;
    UrlHelper: IUrlHelper;
    DateTimeUtils: IDateTimeUtils;
    ConnectionStringParser: {
        parse: typeof parseConnectionString;
    };
    FieldType: {
        Default: FieldType;
        Required: FieldType;
        Array: FieldType;
        Hidden: FieldType;
    };
    RequestHeaders: IRequestHeaders;
    DisabledPropertyName: string;
    ProcessLegacy: string;
    SampleRate: string;
    HttpMethod: string;
    DEFAULT_BREEZE_ENDPOINT: string;
    AIData: typeof AIData;
    AIBase: typeof AIBase;
    Envelope: typeof Envelope;
    Event: typeof Event;
    Exception: typeof Exception;
    Metric: typeof Metric;
    PageView: typeof PageView;
    PageViewData: typeof PageViewData;
    RemoteDependencyData: typeof RemoteDependencyData;
    Trace: typeof Trace;
    PageViewPerformance: typeof PageViewPerformance;
    Data: typeof Data;
    SeverityLevel: typeof SeverityLevel;
    ConfigurationManager: typeof ConfigurationManager;
    ContextTagKeys: typeof ContextTagKeys;
    DataSanitizer: IDataSanitizer;
    TelemetryItemCreator: typeof TelemetryItemCreator;
    CtxTagKeys: ContextTagKeys;
    Extensions: {
        UserExt: string;
        DeviceExt: string;
        TraceExt: string;
        WebExt: string;
        AppExt: string;
        OSExt: string;
        SessionExt: string;
        SDKExt: string;
    };
    DistributedTracingModes: typeof DistributedTracingModes;
};
/**
 * Application Insights API
 * @class Initialization
 * @implements {IApplicationInsights}
 */
export declare class Initialization implements IApplicationInsights {
    snippet: Snippet;
    config: IConfiguration & IConfig;
    appInsights: ApplicationInsights;
    core: IAppInsightsCore;
    context: Common_ITelemetryContext;
    private dependencies;
    private properties;
    private _sender;
    private _snippetVersion;
    constructor(snippet: Snippet);
    /**
     * Get the current cookie manager for this instance
     */
    getCookieMgr(): ICookieMgr;
    /**
     * Log a user action or other occurrence.
     * @param {IEventTelemetry} event
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    trackEvent(event: IEventTelemetry, customProperties?: ICustomProperties): void;
    /**
     * Logs that a page, or similar container was displayed to the user.
     * @param {IPageViewTelemetry} pageView
     * @memberof Initialization
     */
    trackPageView(pageView?: IPageViewTelemetry): void;
    /**
     * Log a bag of performance information via the customProperties field.
     * @param {IPageViewPerformanceTelemetry} pageViewPerformance
     * @memberof Initialization
     */
    trackPageViewPerformance(pageViewPerformance: IPageViewPerformanceTelemetry): void;
    /**
     * Log an exception that you have caught.
     * @param {IExceptionTelemetry} exception
     * @param {{[key: string]: any}} customProperties   Additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @memberof Initialization
     */
    trackException(exception: IExceptionTelemetry, customProperties?: ICustomProperties): void;
    /**
     * Manually send uncaught exception telemetry. This method is automatically triggered
     * on a window.onerror event.
     * @param {IAutoExceptionTelemetry} exception
     * @memberof Initialization
     */
    _onerror(exception: IAutoExceptionTelemetry): void;
    /**
     * Log a diagnostic scenario such entering or leaving a function.
     * @param {ITraceTelemetry} trace
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    trackTrace(trace: ITraceTelemetry, customProperties?: ICustomProperties): void;
    /**
     * Log a numeric value that is not associated with a specific event. Typically used
     * to send regular reports of performance indicators.
     *
     * To send a single measurement, just use the `name` and `average` fields
     * of {@link IMetricTelemetry}.
     *
     * If you take measurements frequently, you can reduce the telemetry bandwidth by
     * aggregating multiple measurements and sending the resulting average and modifying
     * the `sampleCount` field of {@link IMetricTelemetry}.
     * @param {IMetricTelemetry} metric input object argument. Only `name` and `average` are mandatory.
     * @param {ICustomProperties} [customProperties]
     * @memberof Initialization
     */
    trackMetric(metric: IMetricTelemetry, customProperties?: ICustomProperties): void;
    /**
     * Starts the timer for tracking a page load time. Use this instead of `trackPageView` if you want to control when the page view timer starts and stops,
     * but don't want to calculate the duration yourself. This method doesn't send any telemetry. Call `stopTrackPage` to log the end of the page view
     * and send the event.
     * @param name A string that idenfities this item, unique within this HTML document. Defaults to the document title.
     */
    startTrackPage(name?: string): void;
    /**
     * Stops the timer that was started by calling `startTrackPage` and sends the pageview load time telemetry with the specified properties and measurements.
     * The duration of the page view will be the time between calling `startTrackPage` and `stopTrackPage`.
     * @param   name  The string you used as the name in startTrackPage. Defaults to the document title.
     * @param   url   String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
     * @param   properties  map[string, string] - additional data used to filter pages and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this page, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    stopTrackPage(name?: string, url?: string, customProperties?: {
        [key: string]: any;
    }, measurements?: {
        [key: string]: number;
    }): void;
    startTrackEvent(name?: string): void;
    /**
     * Log an extended event that you started timing with `startTrackEvent`.
     * @param   name    The string you used to identify this event in `startTrackEvent`.
     * @param   properties  map[string, string] - additional data used to filter events and metrics in the portal. Defaults to empty.
     * @param   measurements    map[string, number] - metrics associated with this event, displayed in Metrics Explorer on the portal. Defaults to empty.
     */
    stopTrackEvent(name: string, properties?: {
        [key: string]: string;
    }, measurements?: {
        [key: string]: number;
    }): void;
    addTelemetryInitializer(telemetryInitializer: (item: ITelemetryItem) => boolean | void): void;
    /**
     * Set the authenticated user id and the account id. Used for identifying a specific signed-in user. Parameters must not contain whitespace or ,;=|
     *
     * The method will only set the `authenticatedUserId` and `accountId` in the current page view. To set them for the whole session, you should set `storeInCookie = true`
     * @param {string} authenticatedUserId
     * @param {string} [accountId]
     * @param {boolean} [storeInCookie=false]
     * @memberof Initialization
     */
    setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
    /**
     * Clears the authenticated user id and account id. The associated cookie is cleared, if present.
     * @memberof Initialization
     */
    clearAuthenticatedUserContext(): void;
    /**
     * Log a dependency call (e.g. ajax)
     * @param {IDependencyTelemetry} dependency
     * @memberof Initialization
     */
    trackDependencyData(dependency: IDependencyTelemetry): void;
    /**
     * Manually trigger an immediate send of all telemetry still in the buffer.
     * @param {boolean} [async=true]
     * @memberof Initialization
     */
    flush(async?: boolean): void;
    /**
     * Manually trigger an immediate send of all telemetry still in the buffer using beacon Sender.
     * Fall back to xhr sender if beacon is not supported.
     * @param {boolean} [async=true]
     * @memberof Initialization
     */
    onunloadFlush(async?: boolean): void;
    /**
     * Initialize this instance of ApplicationInsights
     * @returns {IApplicationInsights}
     * @memberof Initialization
     */
    loadAppInsights(legacyMode?: boolean, logger?: IDiagnosticLogger, notificationManager?: INotificationManager): IApplicationInsights;
    /**
     * Overwrite the lazy loaded fields of global window snippet to contain the
     * actual initialized API methods
     * @param {Snippet} snippet
     * @memberof Initialization
     */
    updateSnippetDefinitions(snippet: Snippet): void;
    /**
     * Call any functions that were queued before the main script was loaded
     * @memberof Initialization
     */
    emptyQueue(): void;
    pollInternalLogs(): void;
    stopPollingInternalLogs(): void;
    addHousekeepingBeforeUnload(appInsightsInstance: IApplicationInsights): void;
    getSender(): Sender;
    private getSKUDefaults;
}

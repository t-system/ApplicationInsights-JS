/*
 * Microsoft.ApplicationInsights, 2.7.1
 * Copyright (c) Microsoft and contributors. All rights reserved.
 *
 * Microsoft Application Insights Team
 * https://github.com/microsoft/ApplicationInsights-JS#readme
 */

declare namespace ApplicationInsights {
    class ajaxRecord {
        completed: boolean;
        requestHeadersSize: number;
        requestHeaders: any;
        responseReceivingDuration: number;
        callbackDuration: number;
        ajaxTotalDuration: number;
        aborted: number;
        pageUrl: string;
        requestUrl: string;
        requestSize: number;
        method: string;
        perfMark: PerformanceMark;
        perfTiming: PerformanceResourceTiming;
        perfAttempts?: number;
        async?: boolean;
        errorStatusText?: boolean;
        status: string | number;
        requestSentTime: number;
        responseStartedTime: number;
        responseFinishedTime: number;
        callbackFinishedTime: number;
        endTime: number;
        xhrMonitoringState: XHRMonitoringState;
        clientFailure: number;
        traceID: string;
        spanID: string;
        constructor(traceID: string, spanID: string, logger: IDiagnosticLogger);
        getAbsoluteUrl(): string;
        getPathName(): string;
        CreateTrackItem(ajaxType: string, enableRequestHeaderTracking: boolean, getResponse: () => IAjaxRecordResponse): IDependencyTelemetry;
    }

    class AppInsightsCore extends BaseCore implements IAppInsightsCore {
        constructor();
        initialize(config: IConfiguration, extensions: IPlugin[], logger?: IDiagnosticLogger, notificationManager?: INotificationManager): void;
        track(telemetryItem: ITelemetryItem): void;
        /**
         * Adds a notification listener. The SDK calls methods on the listener when an appropriate notification is raised.
         * The added plugins must raise notifications. If the plugins do not implement the notifications, then no methods will be
         * called.
         * @param {INotificationListener} listener - An INotificationListener object.
         */
        addNotificationListener(listener: INotificationListener): void;
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - INotificationListener to remove.
         */
        removeNotificationListener(listener: INotificationListener): void;
        /**
         * Periodically check logger.queue for
         */
        pollInternalLogs(eventName?: string): number;
        /**
         * Periodically check logger.queue for
         */
        stopPollingInternalLogs(): void;
    }

    class ApplicationAnalytics extends BaseTelemetryPlugin implements IAppInsights, IAppInsightsInternal {
        static Version: string;
        static getDefaultConfig(config?: IConfig): IConfig;
        identifier: string;
        priority: number;
        config: IConfig;
        queue: Array<() => void>;
        autoRoutePVDelay: number;
        protected _telemetryInitializers: Array<(envelope: ITelemetryItem) => boolean | void>;
        protected _pageViewManager: PageViewManager;
        protected _pageViewPerformanceManager: PageViewPerformanceManager;
        protected _pageVisitTimeManager: PageVisitTimeManager;
        constructor();
        /**
         * Get the current cookie manager for this instance
         */
        getCookieMgr(): ICookieMgr;
        processTelemetry(env: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        trackEvent(event: IEventTelemetry, customProperties?: ICustomProperties): void;
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
            [key: string]: string;
        }, measurements?: {
            [key: string]: number;
        }): void;
        /**
         * @description Log a diagnostic message
         * @param {ITraceTelemetry} trace
         * @param ICustomProperties.
         * @memberof ApplicationInsights
         */
        trackTrace(trace: ITraceTelemetry, customProperties?: ICustomProperties): void;
        /**
         * @description Log a numeric value that is not associated with a specific event. Typically
         * used to send regular reports of performance indicators. To send single measurement, just
         * use the name and average fields of {@link IMetricTelemetry}. If you take measurements
         * frequently, you can reduce the telemetry bandwidth by aggregating multiple measurements
         * and sending the resulting average at intervals
         * @param {IMetricTelemetry} metric input object argument. Only name and average are mandatory.
         * @param {{[key: string]: any}} customProperties additional data used to filter metrics in the
         * portal. Defaults to empty.
         * @memberof ApplicationInsights
         */
        trackMetric(metric: IMetricTelemetry, customProperties?: ICustomProperties): void;
        /**
         * Logs that a page or other item was viewed.
         * @param IPageViewTelemetry The string you used as the name in startTrackPage. Defaults to the document title.
         * @param customProperties Additional data used to filter events and metrics. Defaults to empty.
         * If a user wants to provide duration for pageLoad, it'll have to be in pageView.properties.duration
         */
        trackPageView(pageView?: IPageViewTelemetry, customProperties?: ICustomProperties): void;
        /**
         * Create a page view telemetry item and send it to the SDK pipeline through the core.track API
         * @param pageView Page view item to be sent
         * @param properties Custom properties (Part C) that a user can add to the telemetry item
         * @param systemProperties System level properties (Part A) that a user can add to the telemetry item
         */
        sendPageViewInternal(pageView: IPageViewTelemetryInternal, properties?: {
            [key: string]: any;
        }, systemProperties?: {
            [key: string]: any;
        }): void;
        /**
         * @ignore INTERNAL ONLY
         * @param pageViewPerformance
         * @param properties
         */
        sendPageViewPerformanceInternal(pageViewPerformance: IPageViewPerformanceTelemetryInternal, properties?: {
            [key: string]: any;
        }, systemProperties?: {
            [key: string]: any;
        }): void;
        /**
         * Send browser performance metrics.
         * @param pageViewPerformance
         * @param customProperties
         */
        trackPageViewPerformance(pageViewPerformance: IPageViewPerformanceTelemetry, customProperties?: ICustomProperties): void;
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
        stopTrackPage(name?: string, url?: string, properties?: {
            [key: string]: string;
        }, measurement?: {
            [key: string]: number;
        }): void;
        /**
         * @ignore INTERNAL ONLY
         * @param exception
         * @param properties
         * @param systemProperties
         */
        sendExceptionInternal(exception: IExceptionTelemetry, customProperties?: {
            [key: string]: any;
        }, systemProperties?: {
            [key: string]: any;
        }): void;
        /**
         * Log an exception you have caught.
         *
         * @param {IExceptionTelemetry} exception   Object which contains exception to be sent
         * @param {{[key: string]: any}} customProperties   Additional data used to filter pages and metrics in the portal. Defaults to empty.
         *
         * Any property of type double will be considered a measurement, and will be treated by Application Insights as a metric.
         * @memberof ApplicationInsights
         */
        trackException(exception: IExceptionTelemetry, customProperties?: ICustomProperties): void;
        /**
         * @description Custom error handler for Application Insights Analytics
         * @param {IAutoExceptionTelemetry} exception
         * @memberof ApplicationInsights
         */
        _onerror(exception: IAutoExceptionTelemetry): void;
        addTelemetryInitializer(telemetryInitializer: (item: ITelemetryItem) => boolean | void): void;
        initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
    }

    /**
     * Application Insights API
     * @class Initialization
     * @implements {IApplicationInsights}
     */
    class ApplicationInsights implements IApplicationInsights {
        snippet: Snippet;
        config: IConfiguration & IConfig;
        appInsights: ApplicationAnalytics;
        core: IAppInsightsCore;
        context: ITelemetryContext;
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

    class ApplicationInsightsContainer {
        static getAppInsights(snippet: Snippet, version: number): IApplicationInsights | IAppInsightsDeprecated;
    }

    /**
     * Data struct to contain only C section with custom fields.
     */
    class Base {
        /**
         * Name of item (B section) if any. If telemetry data is derived straight from this, this should be null.
         */
        baseType: string;
        constructor();
    }

    class BaseCore implements IAppInsightsCore {
        static defaultConfig: IConfiguration;
        config: IConfiguration;
        logger: IDiagnosticLogger;
        _extensions: IPlugin[];
        isInitialized: () => boolean;
        constructor();
        initialize(config: IConfiguration, extensions: IPlugin[], logger?: IDiagnosticLogger, notificationManager?: INotificationManager): void;
        getTransmissionControls(): IChannelControls[][];
        track(telemetryItem: ITelemetryItem): void;
        getProcessTelContext(): IProcessTelemetryContext;
        getNotifyMgr(): INotificationManager;
        /**
         * Get the current cookie manager for this instance
         */
        getCookieMgr(): ICookieMgr;
        /**
         * Set the current cookie manager for this instance
         * @param cookieMgr - The manager, if set to null/undefined will cause the default to be created
         */
        setCookieMgr(cookieMgr: ICookieMgr): void;
        getPerfMgr(): IPerfManager;
        setPerfMgr(perfMgr: IPerfManager): void;
        eventCnt(): number;
        protected releaseQueue(): void;
    }

    /**
     * BaseTelemetryPlugin provides a basic implementation of the ITelemetryPlugin interface so that plugins
     * can avoid implementation the same set of boiler plate code as well as provide a base
     * implementation so that new default implementations can be added without breaking all plugins.
     */
    abstract class BaseTelemetryPlugin implements ITelemetryPlugin {
        /**
         * Call back for telemetry processing before it it is sent
         * @param env - This is the current event being reported
         * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances
         * can optionally use this to access the current core instance or define / pass additional information
         * to later plugins (vs appending items to the telemetry item)
         */
        processNext: (env: ITelemetryItem, itemCtx: IProcessTelemetryContext) => void;
        /**
         * Set next extension for telemetry processing
         */
        setNextPlugin: (next: ITelemetryPlugin | ITelemetryPluginChain) => void;
        /**
         * Returns the current diagnostic logger that can be used to log issues, if no logger is currently
         * assigned a new default one will be created and returned.
         */
        diagLog: (itemCtx?: IProcessTelemetryContext) => IDiagnosticLogger;
        /**
         * Returns whether the plugin has been initialized
         */
        isInitialized: () => boolean;
        identifier: string;
        version?: string;
        /**
         * Holds the core instance that was used during initialization
         */
        core: IAppInsightsCore;
        priority: number;
        /**
         * Helper to return the current IProcessTelemetryContext, if the passed argument exists this just
         * returns that value (helps with minification for callers), otherwise it will return the configured
         * context or a temporary one.
         * @param currentCtx - [Optional] The current execution context
         */
        protected _getTelCtx: (currentCtx?: IProcessTelemetryContext) => IProcessTelemetryContext;
        /**
         * Internal helper to allow setting of the internal initialized setting for inherited instances and unit testing
         */
        protected setInitialized: (isInitialized: boolean) => void;
        /**
         * Internal helper to initialize the instance
         */
        private _baseTelInit;
        constructor();
        initialize(config: IConfiguration, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
        abstract processTelemetry(env: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
    }

    class ConfigurationManager {
        static getConfig(config: IConfiguration & IConfig, field: string, identifier?: string, defaultValue?: number | string | boolean): number | string | boolean;
    }

    type ConnectionString = {
        [key in ConnectionStringKey]?: string;
    };

    type ConnectionStringKey = "authorization" | "instrumentationkey" | "ingestionendpoint" | "location" | "endpointsuffix";

    class ContextTagKeys extends ContextTagKeys_base {
        constructor();
    }

    const ContextTagKeys_base: new () => IContextTagKeys;

    /**
     * Provides a collection of utility functions, included for backward compatibility with previous releases.
     * @deprecated Marking this instance as deprecated in favor of direct usage of the helper functions
     * as direct usage provides better tree-shaking and minification by avoiding the inclusion of the unused items
     * in your resulting code.
     */
    const CoreUtils: ICoreUtils;

    /**
     * Data struct to contain both B and C sections.
     */
    class Data<TDomain> extends Base {
        /**
         * Name of item (B section) if any. If telemetry data is derived straight from this, this should be null.
         */
        baseType: string;
        /**
         * Container for data item (B section).
         */
        baseData: TDomain;
        constructor();
    }

    class Data_2<TDomain> extends Data<TDomain> implements ISerializable {
        /**
         * The data contract for serializing this object.
         */
        aiDataContract: {
            baseType: FieldType;
            baseData: FieldType;
        };
        /**
         * Constructs a new instance of telemetry data.
         */
        constructor(baseType: string, data: TDomain);
    }

    /**
     * Metric data single measurement.
     */
    class DataPoint {
        /**
         * Name of the metric.
         */
        name: string;
        /**
         * Metric type. Single measurement or the aggregated value.
         */
        kind: DataPointType;
        /**
         * Single value for measurement. Sum of individual measurements for the aggregation.
         */
        value: number;
        /**
         * Metric weight of the aggregated metric. Should not be set for a measurement.
         */
        count: number;
        /**
         * Minimum value of the aggregated metric. Should not be set for a measurement.
         */
        min: number;
        /**
         * Maximum value of the aggregated metric. Should not be set for a measurement.
         */
        max: number;
        /**
         * Standard deviation of the aggregated metric. Should not be set for a measurement.
         */
        stdDev: number;
    }

    /**
     * Type of the metric data measurement.
     */
    enum DataPointType {
        Measurement = 0,
        Aggregation = 1
    }

    class DependenciesPlugin extends BaseTelemetryPlugin implements IDependenciesPlugin, IInstrumentationRequirements {
        static identifier: string;
        static getDefaultConfig(): ICorrelationConfig;
        static getEmptyConfig(): ICorrelationConfig;
        identifier: string;
        priority: number;
        constructor();
        initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
        teardown(): void;
        processTelemetry(item: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        /**
         * Logs dependency call
         * @param dependencyData dependency data object
         */
        trackDependencyData(dependency: IDependencyTelemetry, properties?: {
            [key: string]: any;
        }): void;
        includeCorrelationHeaders(ajaxData: ajaxRecord, input?: Request | string, init?: RequestInit, xhr?: XMLHttpRequestInstrumented): any;
        /**
         * Protected function to allow sub classes the chance to add additional properties to the dependency event
         * before it's sent. This function calls track, so sub-classes must call this function after they have
         * populated their properties.
         * @param dependencyData dependency data object
         */
        protected trackDependencyDataInternal(dependency: IDependencyTelemetry, properties?: {
            [key: string]: any;
        }, systemProperties?: {
            [key: string]: any;
        }): void;
    }

    enum DistributedTracingModes {
        /**
         * (Default) Send Application Insights correlation headers
         */
        AI = 0,
        /**
         * Send both W3C Trace Context headers and back-compatibility Application Insights headers
         */
        AI_AND_W3C = 1,
        /**
         * Send W3C Trace Context headers
         */
        W3C = 2
    }

    /**
     * The abstract common base of all domains.
     */
    interface Domain {
    }

    /**
     * Helper function to wrap a function with a perf event
     * @param mgrSource - The Performance Manager or a Performance provider source (may be null)
     * @param getSource - The callback to create the source name for the event (if perf monitoring is enabled)
     * @param func - The function to call and measure
     * @param details - A function to return the payload details
     * @param isAsync - Is the event / function being call asynchronously or synchronously
     */
    function doPerf<T>(mgrSource: IPerfManagerProvider | IPerfManager, getSource: () => string, func: (perfEvt?: IPerfEvent) => T, details?: () => any, isAsync?: boolean): T;

    class Envelope extends Envelope_2 implements IEnvelope {
        /**
         * The data contract for serializing this object.
         */
        aiDataContract: any;
        /**
         * Constructs a new instance of telemetry data.
         */
        constructor(logger: IDiagnosticLogger, data: Base, name: string);
    }

    /**
     * System variables for a telemetry item.
     */
    class Envelope_2 {
        /**
         * Envelope version. For internal use only. By assigning this the default, it will not be serialized within the payload unless changed to a value other than #1.
         */
        ver: number;
        /**
         * Type name of telemetry data item.
         */
        name: string;
        /**
         * Event date time when telemetry item was created. This is the wall clock time on the client when the event was generated. There is no guarantee that the client's time is accurate. This field must be formatted in UTC ISO 8601 format, with a trailing 'Z' character, as described publicly on https://en.wikipedia.org/wiki/ISO_8601#UTC. Note: the number of decimal seconds digits provided are variable (and unspecified). Consumers should handle this, i.e. managed code consumers should not use format 'O' for parsing as it specifies a fixed length. Example: 2009-06-15T13:45:30.0000000Z.
         */
        time: string;
        /**
         * Sampling rate used in application. This telemetry item represents 1 / sampleRate actual telemetry items.
         */
        sampleRate: number;
        /**
         * Sequence field used to track absolute order of uploaded events.
         */
        seq: string;
        /**
         * The application's instrumentation key. The key is typically represented as a GUID, but there are cases when it is not a guid. No code should rely on iKey being a GUID. Instrumentation key is case insensitive.
         */
        iKey: string;
        /**
         * Key/value collection of context properties. See ContextTagKeys for information on available properties.
         */
        tags: any;
        /**
         * Telemetry data item.
         */
        data: Base;
    }

    class Event_2 extends EventData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            ver: FieldType;
            name: FieldType;
            properties: FieldType;
            measurements: FieldType;
        };
        /**
         * Constructs a new instance of the EventTelemetry object
         */
        constructor(logger: IDiagnosticLogger, name: string, properties?: any, measurements?: any);
    }
    export { Event_2 as Event }

    /**
     * Instances of Event represent structured event records that can be grouped and searched by their properties. Event data item also creates a metric of event count by name.
     */
    class EventData implements Domain {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Event name. Keep it low cardinality to allow proper grouping and useful metrics.
         */
        name: string;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    class Exception extends ExceptionData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        id?: string;
        problemGroup?: string;
        isManual?: boolean;
        aiDataContract: {
            ver: FieldType;
            exceptions: FieldType;
            severityLevel: FieldType;
            properties: FieldType;
            measurements: FieldType;
        };
        /**
         * Constructs a new instance of the ExceptionTelemetry object
         */
        constructor(logger: IDiagnosticLogger, exception: Error | IExceptionInternal | IAutoExceptionTelemetry, properties?: {
            [key: string]: any;
        }, measurements?: {
            [key: string]: number;
        }, severityLevel?: SeverityLevel, id?: string);
        static CreateAutoException(message: string | Event, url: string, lineNumber: number, columnNumber: number, error: any, evt?: Event | string, stack?: string, errorSrc?: string): IAutoExceptionTelemetry;
        static CreateFromInterface(logger: IDiagnosticLogger, exception: IExceptionInternal, properties?: any, measurements?: {
            [key: string]: number;
        }): Exception;
        toInterface(): IExceptionInternal;
        /**
         * Creates a simple exception with 1 stack frame. Useful for manual constracting of exception.
         */
        static CreateSimpleException(message: string, typeName: string, assembly: string, fileName: string, details: string, line: number): Exception;
        static formatError: typeof _formatErrorCode;
    }

    /**
     * An instance of Exception represents a handled or unhandled exception that occurred during execution of the monitored application.
     */
    class ExceptionData implements Domain {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Exception chain - list of inner exceptions.
         */
        exceptions: ExceptionDetails[];
        /**
         * Severity level. Mostly used to indicate exception severity level when it is reported by logging library.
         */
        severityLevel: SeverityLevel;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    /**
     * Exception details of the exception in a chain.
     */
    class ExceptionDetails {
        /**
         * In case exception is nested (outer exception contains inner one), the id and outerId properties are used to represent the nesting.
         */
        id: number;
        /**
         * The value of outerId is a reference to an element in ExceptionDetails that represents the outer exception
         */
        outerId: number;
        /**
         * Exception type name.
         */
        typeName: string;
        /**
         * Exception message.
         */
        message: string;
        /**
         * Indicates if full exception stack is provided in the exception. The stack may be trimmed, such as in the case of a StackOverflow exception.
         */
        hasFullStack: boolean;
        /**
         * Text describing the stack. Either stack or parsedStack should have a value.
         */
        stack: string;
        /**
         * List of stack frames. Either stack or parsedStack should have a value.
         */
        parsedStack: StackFrame[];
    }

    /**
     * Enum is used in aiDataContract to describe how fields are serialized.
     * For instance: (Fieldtype.Required | FieldType.Array) will mark the field as required and indicate it's an array
     */
    const enum FieldType {
        Default = 0,
        Required = 1,
        Array = 2,
        Hidden = 4
    }

    /**
     * Formats the provided errorObj for display and reporting, it may be a String, Object, integer or undefined depending on the browser.
     * @param errorObj The supplied errorObj
     */
    function _formatErrorCode(errorObj: any): any;

    interface IAjaxRecordResponse {
        statusText: string;
        headerMap: Object;
        correlationContext: string;
        type?: string;
        responseText?: string;
        response?: Object;
    }

    interface IAppInsights {
        /**
         * Get the current cookie manager for this instance
         */
        getCookieMgr(): ICookieMgr;
        trackEvent(event: IEventTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
        trackPageView(pageView: IPageViewTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
        trackException(exception: IExceptionTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
        _onerror(exception: IAutoExceptionTelemetry): void;
        trackTrace(trace: ITraceTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
        trackMetric(metric: IMetricTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
        startTrackPage(name?: string): void;
        stopTrackPage(name?: string, url?: string, customProperties?: Object): void;
        startTrackEvent(name: string): void;
        stopTrackEvent(name: string, properties?: Object, measurements?: Object): void;
        addTelemetryInitializer(telemetryInitializer: (item: ITelemetryItem) => boolean | void): void;
        trackPageViewPerformance(pageViewPerformance: IPageViewPerformanceTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
    }

    interface IAppInsightsCore extends IPerfManagerProvider {
        config: IConfiguration;
        logger: IDiagnosticLogger;
        /**
         * Returns a value that indicates whether the instance has already been previously initialized.
         */
        isInitialized?: () => boolean;
        initialize(config: IConfiguration, extensions: IPlugin[], logger?: IDiagnosticLogger, notificationManager?: INotificationManager): void;
        getTransmissionControls(): IChannelControls[][];
        track(telemetryItem: ITelemetryItem): void;
        /**
         * Get the current notification manager
         */
        getNotifyMgr(): INotificationManager;
        /**
         * Get the current cookie manager for this instance
         */
        getCookieMgr(): ICookieMgr;
        /**
         * Set the current cookie manager for this instance
         * @param cookieMgr - The manager, if set to null/undefined will cause the default to be created
         */
        setCookieMgr(cookieMgr: ICookieMgr): void;
        /**
         * Adds a notification listener. The SDK calls methods on the listener when an appropriate notification is raised.
         * The added plugins must raise notifications. If the plugins do not implement the notifications, then no methods will be
         * called.
         * @param {INotificationListener} listener - An INotificationListener object.
         */
        addNotificationListener?(listener: INotificationListener): void;
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - INotificationListener to remove.
         */
        removeNotificationListener?(listener: INotificationListener): void;
        pollInternalLogs?(eventName?: string): number;
        stopPollingInternalLogs?(): void;
        /**
         * Return a new instance of the IProcessTelemetryContext for processing events
         */
        getProcessTelContext(): IProcessTelemetryContext;
    }

    interface IAppInsightsDeprecated {
        config: IConfig;
        context: ITelemetryContext_2;
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

    /**
     * Internal interface to pass appInsights object to subcomponents without coupling
     */
    interface IAppInsightsInternal {
        sendPageViewInternal(pageViewItem: IPageViewTelemetryInternal, properties?: Object, systemProperties?: Object): void;
        sendPageViewPerformanceInternal(pageViewPerformance: IPageViewPerformanceTelemetryInternal, properties?: Object, systemProperties?: Object): void;
    }

    interface IApplication {
        /**
         * The application version.
         */
        ver: string;
        /**
         * The application build version.
         */
        build: string;
    }

    interface IApplicationInsights extends IAppInsights, IDependenciesPlugin, IPropertiesPlugin {
        appInsights: ApplicationAnalytics;
        flush: (async?: boolean) => void;
        onunloadFlush: (async?: boolean) => void;
        getSender: () => Sender;
        setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
        clearAuthenticatedUserContext(): void;
    }

    /**
     * @description window.onerror function parameters
     * @export
     * @interface IAutoExceptionTelemetry
     */
    interface IAutoExceptionTelemetry {
        /**
         * @description error message. Available as event in HTML onerror="" handler
         * @type {string}
         * @memberof IAutoExceptionTelemetry
         */
        message: string;
        /**
         * @description URL of the script where the error was raised
         * @type {string}
         * @memberof IAutoExceptionTelemetry
         */
        url: string;
        /**
         * @description Line number where error was raised
         * @type {number}
         * @memberof IAutoExceptionTelemetry
         */
        lineNumber: number;
        /**
         * @description Column number for the line where the error occurred
         * @type {number}
         * @memberof IAutoExceptionTelemetry
         */
        columnNumber: number;
        /**
         * @description Error Object (object)
         * @type {any}
         * @memberof IAutoExceptionTelemetry
         */
        error: any;
        /**
         * @description The event at the time of the exception (object)
         * @type {Event|string}
         * @memberof IAutoExceptionTelemetry
         */
        evt?: Event | string;
        /**
         * @description The provided stack for the error
         * @type {IStackDetails}
         * @memberof IAutoExceptionTelemetry
         */
        stackDetails?: IStackDetails;
        /**
         * @description The calculated type of the error
         * @type {string}
         * @memberof IAutoExceptionTelemetry
         */
        typeName?: string;
        /**
         * @description The descriptive source of the error
         * @type {string}
         * @memberof IAutoExceptionTelemetry
         */
        errorSrc?: string;
    }

    interface IBackendResponse {
        /**
         * Number of items received by the backend
         */
        readonly itemsReceived: number;
        /**
         * Number of items succesfuly accepted by the backend
         */
        readonly itemsAccepted: number;
        /**
         * List of errors for items which were not accepted
         */
        readonly errors: IResponseError[];
        /**
         * App id returned by the backend - not necessary returned, but we don't need it with each response.
         */
        readonly appId?: string;
    }

    /**
     * Provides data transmission capabilities
     */
    interface IChannelControls extends ITelemetryPlugin {
        /**
         * Pause sending data
         */
        pause(): void;
        /**
         * Resume sending data
         */
        resume(): void;
        /**
         * Tear down transmission pipeline
         */
        teardown(): void;
        /**
         * Flush to send data immediately; channel should default to sending data asynchronously
         * @param async: send data asynchronously when true
         * @param callBack: if specified, notify caller when send is complete
         */
        flush(async: boolean, callBack?: () => void): void;
    }

    interface IChannelControlsAI extends IChannelControls {
    }

    /**
     * Configuration settings for how telemetry is sent
     * @export
     * @interface IConfig
     */
    interface IConfig {
        /**
         * The JSON format (normal vs line delimited). True means line delimited JSON.
         */
        emitLineDelimitedJson?: boolean;
        /**
         * An optional account id, if your app groups users into accounts. No spaces, commas, semicolons, equals, or vertical bars.
         */
        accountId?: string;
        /**
         * A session is logged if the user is inactive for this amount of time in milliseconds. Default 30 mins.
         * @default 30*60*1000
         */
        sessionRenewalMs?: number;
        /**
         * A session is logged if it has continued for this amount of time in milliseconds. Default 24h.
         * @default 24*60*60*1000
         */
        sessionExpirationMs?: number;
        /**
         * Max size of telemetry batch. If batch exceeds limit, it is sent and a new batch is started
         * @default 100000
         */
        maxBatchSizeInBytes?: number;
        /**
         * How long to batch telemetry for before sending (milliseconds)
         * @default 15 seconds
         */
        maxBatchInterval?: number;
        /**
         * If true, debugging data is thrown as an exception by the logger. Default false
         * @defaultValue false
         */
        enableDebug?: boolean;
        /**
         * If true, exceptions are not autocollected. Default is false
         * @defaultValue false
         */
        disableExceptionTracking?: boolean;
        /**
         * If true, telemetry is not collected or sent. Default is false
         * @defaultValue false
         */
        disableTelemetry?: boolean;
        /**
         * Percentage of events that will be sent. Default is 100, meaning all events are sent.
         * @defaultValue 100
         */
        samplingPercentage?: number;
        /**
         * If true, on a pageview, the previous instrumented page's view time is tracked and sent as telemetry and a new timer is started for the current pageview. It is sent as a custom metric named PageVisitTime in milliseconds and is calculated via the Date now() function (if available) and falls back to (new Date()).getTime() if now() is unavailable (IE8 or less). Default is false.
         */
        autoTrackPageVisitTime?: boolean;
        /**
         * Automatically track route changes in Single Page Applications (SPA). If true, each route change will send a new Pageview to Application Insights.
         */
        enableAutoRouteTracking?: boolean;
        /**
         * If true, Ajax calls are not autocollected. Default is false
         * @defaultValue false
         */
        disableAjaxTracking?: boolean;
        /**
         * If true, Fetch requests are not autocollected. Default is true.
         * @defaultValue true
         */
        disableFetchTracking?: boolean;
        /**
         * Provide a way to exclude specific route from automatic tracking for XMLHttpRequest or Fetch request. For an ajax / fetch request that the request url matches with the regex patterns, auto tracking is turned off.
         * @defaultValue undefined.
         */
        excludeRequestFromAutoTrackingPatterns?: string[] | RegExp[];
        /**
         * Provide a way to enrich dependencies logs with context at the beginning of api call.
         * Default is undefined.
         */
        addRequestContext?: (requestContext?: IRequestContext) => ICustomProperties;
        /**
         * If true, default behavior of trackPageView is changed to record end of page view duration interval when trackPageView is called. If false and no custom duration is provided to trackPageView, the page view performance is calculated using the navigation timing API. Default is false
         * @defaultValue false
         */
        overridePageViewDuration?: boolean;
        /**
         * Default 500 - controls how many ajax calls will be monitored per page view. Set to -1 to monitor all (unlimited) ajax calls on the page.
         */
        maxAjaxCallsPerView?: number;
        /**
         * @ignore
         * If false, internal telemetry sender buffers will be checked at startup for items not yet sent. Default is true
         * @defaultValue true
         */
        disableDataLossAnalysis?: boolean;
        /**
         * If false, the SDK will add two headers ('Request-Id' and 'Request-Context') to all dependency requests to correlate them with corresponding requests on the server side. Default is false.
         * @defaultValue false
         */
        disableCorrelationHeaders?: boolean;
        /**
         * Sets the distributed tracing mode. If AI_AND_W3C mode or W3C mode is set, W3C trace context headers (traceparent/tracestate) will be generated and included in all outgoing requests.
         * AI_AND_W3C is provided for back-compatibility with any legacy Application Insights instrumented services
         * @defaultValue AI_AND_W3C
         */
        distributedTracingMode?: DistributedTracingModes;
        /**
         * Disable correlation headers for specific domain
         */
        correlationHeaderExcludedDomains?: string[];
        /**
         * Default false. If true, flush method will not be called when onBeforeUnload, onUnload, onPageHide or onVisibilityChange (hidden state) event(s) trigger.
         */
        disableFlushOnBeforeUnload?: boolean;
        /**
         * Default value of {@link #disableFlushOnBeforeUnload}. If true, flush method will not be called when onPageHide or onVisibilityChange (hidden state) event(s) trigger.
         */
        disableFlushOnUnload?: boolean;
        /**
         * [Optional] An array of the page unload events that you would like to be ignored, special note there must be at least one valid unload
         * event hooked, if you list all or the runtime environment only supports a listed "disabled" event it will still be hooked if required by the SDK.
         * (Some page unload functionality may be disabled via disableFlushOnBeforeUnload or disableFlushOnUnload config entries)
         * Unload events include "beforeunload", "unload", "visibilitychange" (with 'hidden' state) and "pagehide"
         */
        disablePageUnloadEvents?: string[];
        /**
         * [Optional] An array of page show events that you would like to be ignored, special note there must be at lease one valid show event
         * hooked, if you list all or the runtime environment only supports a listed (disabled) event it will STILL be hooked if required by the SDK.
         * Page Show events include "pageshow" and "visibilitychange" (with 'visible' state)
         */
        disablePageShowEvents?: string[];
        /**
         * If true, the buffer with all unsent telemetry is stored in session storage. The buffer is restored on page load. Default is true.
         * @defaultValue true
         */
        enableSessionStorageBuffer?: boolean;
        /**
         * @deprecated Use either disableCookiesUsage or specify a cookieMgrCfg with the enabled value set.
         * If true, the SDK will not store or read any data from cookies. Default is false. As this field is being deprecated, when both
         * isCookieUseDisabled and disableCookiesUsage are used disableCookiesUsage will take precedent.
         * @defaultValue false
         */
        isCookieUseDisabled?: boolean;
        /**
         * If true, the SDK will not store or read any data from cookies. Default is false.
         * If you have also specified a cookieMgrCfg then enabled property (if specified) will take precedent over this value.
         * @defaultValue false
         */
        disableCookiesUsage?: boolean;
        /**
         * Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains.
         * @defaultValue ""
         */
        cookieDomain?: string;
        /**
         * Custom cookie path. This is helpful if you want to share Application Insights cookies behind an application gateway.
         * @defaultValue ""
         */
        cookiePath?: string;
        /**
         * [Optional] A Cookie Manager configuration which includes hooks to allow interception of the get, set and delete cookie
         * operations. If this configuration is specified any specified enabled and domain properties will take precedence over the
         * cookieDomain and disableCookiesUsage values.
         */
        cookieMgrCfg?: ICookieMgrConfig;
        /**
         * Default false. If false, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error), 503 (service unavailable), and 0 (offline, only if detected)
         * @description
         * @defaultValue false
         */
        isRetryDisabled?: boolean;
        /**
         * @deprecated Used when initizialing from snippet only.
         *  The url from where the JS SDK will be downloaded.
         */
        url?: string;
        /**
         * If true, the SDK will not store or read any data from local and session storage. Default is false.
         * @defaultValue false
         */
        isStorageUseDisabled?: boolean;
        /**
         * If false, the SDK will send all telemetry using the [Beacon API](https://www.w3.org/TR/beacon)
         * @defaultValue true
         */
        isBeaconApiDisabled?: boolean;
        /**
         * Don't use XMLHttpRequest or XDomainRequest (for IE < 9) by default instead attempt to use fetch() or sendBeacon.
         * If no other transport is available it will still use XMLHttpRequest
         */
        disableXhr?: boolean;
        /**
         * If fetch keepalive is supported do not use it for sending events during unload, it may still fallback to fetch() without keepalive
         */
        onunloadDisableFetch?: boolean;
        /**
         * Sets the sdk extension name. Only alphabetic characters are allowed. The extension name is added as a prefix to the 'ai.internal.sdkVersion' tag (e.g. 'ext_javascript:2.0.0'). Default is null.
         * @defaultValue null
         */
        sdkExtension?: string;
        /**
         * Default is false. If true, the SDK will track all [Browser Link](https://docs.microsoft.com/en-us/aspnet/core/client-side/using-browserlink) requests.
         * @defaultValue false
         */
        isBrowserLinkTrackingEnabled?: boolean;
        /**
         * AppId is used for the correlation between AJAX dependencies happening on the client-side with the server-side requets. When Beacon API is enabled, it cannot be used automatically, but can be set manually in the configuration. Default is null
         * @defaultValue null
         */
        appId?: string;
        /**
         * If true, the SDK will add two headers ('Request-Id' and 'Request-Context') to all CORS requests to correlate outgoing AJAX dependencies with corresponding requests on the server side. Default is false
         * @defaultValue false
         */
        enableCorsCorrelation?: boolean;
        /**
         * An optional value that will be used as name postfix for localStorage and session cookie name.
         * @defaultValue null
         */
        namePrefix?: string;
        /**
         * An optional value that will be used as name postfix for session cookie name. If undefined, namePrefix is used as name postfix for session cookie name.
         * @defaultValue null
         */
        sessionCookiePostfix?: string;
        /**
         * An optional value that will be used as name postfix for user cookie name. If undefined, no postfix is added on user cookie name.
         * @defaultValue null
         */
        userCookiePostfix?: string;
        /**
         * An optional value that will track Request Header through trackDependency function.
         * @defaultValue false
         */
        enableRequestHeaderTracking?: boolean;
        /**
         * An optional value that will track Response Header through trackDependency function.
         * @defaultValue false
         */
        enableResponseHeaderTracking?: boolean;
        /**
         * An optional value that will track Response Error data through trackDependency function.
         * @defaultValue false
         */
        enableAjaxErrorStatusText?: boolean;
        /**
         * Flag to enable looking up and including additional browser window.performance timings
         * in the reported ajax (XHR and fetch) reported metrics.
         * Defaults to false.
         */
        enableAjaxPerfTracking?: boolean;
        /**
         * The maximum number of times to look for the window.performance timings (if available), this
         * is required as not all browsers populate the window.performance before reporting the
         * end of the XHR request and for fetch requests this is added after its complete
         * Defaults to 3
         */
        maxAjaxPerfLookupAttempts?: number;
        /**
         * The amount of time to wait before re-attempting to find the windows.performance timings
         * for an ajax request, time is in milliseconds and is passed directly to setTimeout()
         * Defaults to 25.
         */
        ajaxPerfLookupDelay?: number;
        /**
         * Default false. when tab is closed, the SDK will send all remaining telemetry using the [Beacon API](https://www.w3.org/TR/beacon)
         * @defaultValue false
         */
        onunloadDisableBeacon?: boolean;
        /**
         * @ignore
         * Internal only
         */
        autoExceptionInstrumented?: boolean;
        /**
         *
         */
        correlationHeaderDomains?: string[];
        /**
         * @ignore
         * Internal only
         */
        autoUnhandledPromiseInstrumented?: boolean;
        /**
         * Default false. Define whether to track unhandled promise rejections and report as JS errors.
         * When disableExceptionTracking is enabled (dont track exceptions) this value will be false.
         * @defaultValue false
         */
        enableUnhandledPromiseRejectionTracking?: boolean;
        /**
         * Disable correlation headers using regular expressions
         */
        correlationHeaderExcludePatterns?: RegExp[];
        /**
         * The ability for the user to provide extra headers
         */
        customHeaders?: [{
            header: string;
            value: string;
        }];
        /**
         * Provide user an option to convert undefined field to user defined value.
         */
        convertUndefined?: any;
        /**
         * [Optional] The number of events that can be kept in memory before the SDK starts to drop events. By default, this is 10,000.
         */
        eventsLimitInMem?: number;
    }

    /**
     * Configuration provided to SDK core
     */
    interface IConfiguration {
        /**
         * Instrumentation key of resource. Either this or connectionString must be specified.
         */
        instrumentationKey?: string;
        /**
         * Connection string of resource. Either this or instrumentationKey must be specified.
         */
        connectionString?: string;
        /**
         * Polling interval (in ms) for internal logging queue
         */
        diagnosticLogInterval?: number;
        /**
         * Maximum number of iKey transmitted logging telemetry per page view
         */
        maxMessageLimit?: number;
        /**
         * Console logging level. All logs with a severity level higher
         * than the configured level will be printed to console. Otherwise
         * they are suppressed. ie Level 2 will print both CRITICAL and
         * WARNING logs to console, level 1 prints only CRITICAL.
         *
         * Note: Logs sent as telemetry to instrumentation key will also
         * be logged to console if their severity meets the configured loggingConsoleLevel
         *
         * 0: ALL console logging off
         * 1: logs to console: severity >= CRITICAL
         * 2: logs to console: severity >= WARNING
         */
        loggingLevelConsole?: number;
        /**
         * Telemtry logging level to instrumentation key. All logs with a severity
         * level higher than the configured level will sent as telemetry data to
         * the configured instrumentation key.
         *
         * 0: ALL iKey logging off
         * 1: logs to iKey: severity >= CRITICAL
         * 2: logs to iKey: severity >= WARNING
         */
        loggingLevelTelemetry?: number;
        /**
         * If enabled, uncaught exceptions will be thrown to help with debugging
         */
        enableDebugExceptions?: boolean;
        /**
         * Endpoint where telemetry data is sent
         */
        endpointUrl?: string;
        /**
         * Extension configs loaded in SDK
         */
        extensionConfig?: {
            [key: string]: any;
        };
        /**
         * Additional plugins that should be loaded by core at runtime
         */
        extensions?: ITelemetryPlugin[];
        /**
         * Channel queues that is setup by caller in desired order.
         * If channels are provided here, core will ignore any channels that are already setup, example if there is a SKU with an initialized channel
         */
        channels?: IChannelControls[][];
        /**
         * @type {boolean}
         * @memberof IConfiguration
         * Flag that disables the Instrumentation Key validation.
         */
        disableInstrumentationKeyValidation?: boolean;
        /**
         * [Optional] When enabled this will create local perfEvents based on sections of the code that have been instrumented
         * to emit perfEvents (via the doPerf()) when this is enabled. This can be used to identify performance issues within
         * the SDK, the way you are using it or optionally your own instrumented code.
         * The provided IPerfManager implementation does NOT send any additional telemetry events to the server it will only fire
         * the new perfEvent() on the INotificationManager which you can listen to.
         * This also does not use the window.performance API, so it will work in environments where this API is not supported.
         */
        enablePerfMgr?: boolean;
        /**
         * [Optional] Callback function that will be called to create a the IPerfManager instance when required and ```enablePerfMgr```
         * is enabled, this enables you to override the default creation of a PerfManager() without needing to ```setPerfMgr()```
         * after initialization.
         */
        createPerfMgr?: (core: IAppInsightsCore, notificationManager: INotificationManager) => IPerfManager;
        /**
         * [Optional] Fire every single performance event not just the top level root performance event. Defaults to false.
         */
        perfEvtsSendAll?: boolean;
        /**
         * [Optional] Identifies the default length used to generate random session and user id's if non currently exists for the user / session.
         * Defaults to 22, previous default value was 5, if you need to keep the previous maximum length you should set this value to 5.
         */
        idLength?: number;
        /**
         * @description Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains. It
         * can be set here or as part of the cookieCfg.domain, the cookieCfg takes precedence if both are specified.
         * @type {string}
         * @memberof IConfig
         * @defaultValue ""
         */
        cookieDomain?: string;
        /**
         * @description Custom cookie path. This is helpful if you want to share Application Insights cookies behind an application
         * gateway. It can be set here or as part of the cookieCfg.domain, the cookieCfg takes precedence if both are specified.
         * @type {string}
         * @memberof IConfig
         * @defaultValue ""
         */
        cookiePath?: string;
        /**
         * [Optional] A boolean that indicated whether to disable the use of cookies by the SDK. If true, the SDK will not store or
         * read any data from cookies. Cookie usage can be re-enabled after initialization via the core.getCookieMgr().enable().
         */
        disableCookiesUsage?: boolean;
        /**
         * [Optional] A Cookie Manager configuration which includes hooks to allow interception of the get, set and delete cookie
         * operations. If this configuration is specified any specified enabled and domain properties will take precedence over the
         * cookieDomain and disableCookiesUsage values.
         */
        cookieCfg?: ICookieMgrConfig;
        /**
         * [Optional] An array of the page unload events that you would like to be ignored, special note there must be at least one valid unload
         * event hooked, if you list all or the runtime environment only supports a listed "disabled" event it will still be hooked, if required by the SDK.
         * Unload events include "beforeunload", "unload", "visibilitychange" (with 'hidden' state) and "pagehide"
         */
        disablePageUnloadEvents?: string[];
        /**
         * [Optional] An array of page show events that you would like to be ignored, special note there must be at lease one valid show event
         * hooked, if you list all or the runtime environment only supports a listed (disabled) event it will STILL be hooked, if required by the SDK.
         * Page Show events include "pageshow" and "visibilitychange" (with 'visible' state)
         */
        disablePageShowEvents?: string[];
        /**
         * [Optional] A flag for performance optimization to disable attempting to use the Chrome Debug Extension, if disabled and the extension is installed
         * this will not send any notifications.
         */
        disableDbgExt?: boolean;
    }

    interface IContextTagKeys {
        /**
         * Application version. Information in the application context fields is always about the application that is sending the telemetry.
         */
        readonly applicationVersion: string;
        /**
         * Application build.
         */
        readonly applicationBuild: string;
        /**
         * Application type id.
         */
        readonly applicationTypeId: string;
        /**
         * Application id.
         */
        readonly applicationId: string;
        /**
         * Application layer.
         */
        readonly applicationLayer: string;
        /**
         * Unique client device id. Computer name in most cases.
         */
        readonly deviceId: string;
        readonly deviceIp: string;
        readonly deviceLanguage: string;
        /**
         * Device locale using <language>-<REGION> pattern, following RFC 5646. Example 'en-US'.
         */
        readonly deviceLocale: string;
        /**
         * Model of the device the end user of the application is using. Used for client scenarios. If this field is empty then it is derived from the user agent.
         */
        readonly deviceModel: string;
        readonly deviceFriendlyName: string;
        readonly deviceNetwork: string;
        readonly deviceNetworkName: string;
        /**
         * Client device OEM name taken from the browser.
         */
        readonly deviceOEMName: string;
        readonly deviceOS: string;
        /**
         * Operating system name and version of the device the end user of the application is using. If this field is empty then it is derived from the user agent. Example 'Windows 10 Pro 10.0.10586.0'
         */
        readonly deviceOSVersion: string;
        /**
         * Name of the instance where application is running. Computer name for on-premisis, instance name for Azure.
         */
        readonly deviceRoleInstance: string;
        /**
         * Name of the role application is part of. Maps directly to the role name in azure.
         */
        readonly deviceRoleName: string;
        readonly deviceScreenResolution: string;
        /**
         * The type of the device the end user of the application is using. Used primarily to distinguish JavaScript telemetry from server side telemetry. Examples: 'PC', 'Phone', 'Browser'. 'PC' is the default value.
         */
        readonly deviceType: string;
        readonly deviceMachineName: string;
        readonly deviceVMName: string;
        readonly deviceBrowser: string;
        /**
         * The browser name and version as reported by the browser.
         */
        readonly deviceBrowserVersion: string;
        /**
         * The IP address of the client device. IPv4 and IPv6 are supported. Information in the location context fields is always about the end user. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service.
         */
        readonly locationIp: string;
        /**
         * The country of the client device. If any of Country, Province, or City is specified, those values will be preferred over geolocation of the IP address field. Information in the location context fields is always about the end user. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service.
         */
        readonly locationCountry: string;
        /**
         * The province/state of the client device. If any of Country, Province, or City is specified, those values will be preferred over geolocation of the IP address field. Information in the location context fields is always about the end user. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service.
         */
        readonly locationProvince: string;
        /**
         * The city of the client device. If any of Country, Province, or City is specified, those values will be preferred over geolocation of the IP address field. Information in the location context fields is always about the end user. When telemetry is sent from a service, the location context is about the user that initiated the operation in the service.
         */
        readonly locationCity: string;
        /**
         * A unique identifier for the operation instance. The operation.id is created by either a request or a page view. All other telemetry sets this to the value for the containing request or page view. Operation.id is used for finding all the telemetry items for a specific operation instance.
         */
        readonly operationId: string;
        /**
         * The name (group) of the operation. The operation.name is created by either a request or a page view. All other telemetry items set this to the value for the containing request or page view. Operation.name is used for finding all the telemetry items for a group of operations (i.e. 'GET Home/Index').
         */
        readonly operationName: string;
        /**
         * The unique identifier of the telemetry item's immediate parent.
         */
        readonly operationParentId: string;
        readonly operationRootId: string;
        /**
         * Name of synthetic source. Some telemetry from the application may represent a synthetic traffic. It may be web crawler indexing the web site, site availability tests or traces from diagnostic libraries like Application Insights SDK itself.
         */
        readonly operationSyntheticSource: string;
        /**
         * The correlation vector is a light weight vector clock which can be used to identify and order related events across clients and services.
         */
        readonly operationCorrelationVector: string;
        /**
         * Session ID - the instance of the user's interaction with the app. Information in the session context fields is always about the end user. When telemetry is sent from a service, the session context is about the user that initiated the operation in the service.
         */
        readonly sessionId: string;
        /**
         * Boolean value indicating whether the session identified by ai.session.id is first for the user or not.
         */
        readonly sessionIsFirst: string;
        readonly sessionIsNew: string;
        readonly userAccountAcquisitionDate: string;
        /**
         * In multi-tenant applications this is the account ID or name which the user is acting with. Examples may be subscription ID for Azure portal or blog name blogging platform.
         */
        readonly userAccountId: string;
        /**
         * The browser's user agent string as reported by the browser. This property will be used to extract informaiton regarding the customer's browser but will not be stored. Use custom properties to store the original user agent.
         */
        readonly userAgent: string;
        /**
         * Anonymous user id. Represents the end user of the application. When telemetry is sent from a service, the user context is about the user that initiated the operation in the service.
         */
        readonly userId: string;
        /**
         * Store region for UWP applications.
         */
        readonly userStoreRegion: string;
        /**
         * Authenticated user id. The opposite of ai.user.id, this represents the user with a friendly name. Since it's PII information it is not collected by default by most SDKs.
         */
        readonly userAuthUserId: string;
        readonly userAnonymousUserAcquisitionDate: string;
        readonly userAuthenticatedUserAcquisitionDate: string;
        readonly cloudName: string;
        /**
         * Name of the role the application is a part of. Maps directly to the role name in azure.
         */
        readonly cloudRole: string;
        readonly cloudRoleVer: string;
        /**
         * Name of the instance where the application is running. Computer name for on-premisis, instance name for Azure.
         */
        readonly cloudRoleInstance: string;
        readonly cloudEnvironment: string;
        readonly cloudLocation: string;
        readonly cloudDeploymentUnit: string;
        /**
         * SDK version. See https://github.com/microsoft/ApplicationInsights-Home/blob/master/SDK-AUTHORING.md#sdk-version-specification for information.
         */
        readonly internalSdkVersion: string;
        /**
         * Agent version. Used to indicate the version of StatusMonitor installed on the computer if it is used for data collection.
         */
        readonly internalAgentVersion: string;
        /**
         * This is the node name used for billing purposes. Use it to override the standard detection of nodes.
         */
        readonly internalNodeName: string;
        /**
         * This identifies the version of the snippet that was used to initialize the SDK
         */
        readonly internalSnippet: string;
        /**
         * This identifies the source of the Sdk script (used to identify whether the SDK was loaded via the CDN)
         */
        readonly internalSdkSrc: string;
    }

    interface ICookieMgr {
        /**
         * Enable or Disable the usage of cookies
         */
        setEnabled(value: boolean): void;
        /**
         * Can the system use cookies, if this returns false then all cookie setting and access functions will return nothing
         */
        isEnabled(): boolean;
        /**
         * Set the named cookie with the value and optional domain and optional
         * @param name - The name of the cookie
         * @param value - The value of the cookie (Must already be encoded)
         * @param maxAgeSec - [optional] The maximum number of SECONDS that this cookie should survive
         * @param domain - [optional] The domain to set for the cookie
         * @param path - [optional] Path to set for the cookie, if not supplied will default to "/"
         * @returns - True if the cookie was set otherwise false (Because cookie usage is not enabled or available)
         */
        set(name: string, value: string, maxAgeSec?: number, domain?: string, path?: string): boolean;
        /**
         * Get the value of the named cookie
         * @param name - The name of the cookie
         */
        get(name: string): string;
        /**
         * Delete/Remove the named cookie if cookie support is available and enabled.
         * Note: Not using "delete" as the name because it's a reserved word which would cause issues on older browsers
         * @param name - The name of the cookie
         * @param path - [optional] Path to set for the cookie, if not supplied will default to "/"
         * @returns - True if the cookie was marked for deletion otherwise false (Because cookie usage is not enabled or available)
         */
        del(name: string, path?: string): boolean;
        /**
         * Purge the cookie from the system if cookie support is available, this function ignores the enabled setting of the manager
         * so any cookie will be removed.
         * Note: Not using "delete" as the name because it's a reserved word which would cause issues on older browsers
         * @param name - The name of the cookie
         * @param path - [optional] Path to set for the cookie, if not supplied will default to "/"
         * @returns - True if the cookie was marked for deletion otherwise false (Because cookie usage is not available)
         */
        purge(name: string, path?: string): boolean;
    }

    /**
     * Configuration definition for instance based cookie management configuration
     */
    interface ICookieMgrConfig {
        /**
         * Defaults to true, A boolean that indicates whether the use of cookies by the SDK is enabled by the current instance.
         * If false, the instance of the SDK initialized by this configuration will not store or read any data from cookies
         */
        enabled?: boolean;
        /**
         * Custom cookie domain. This is helpful if you want to share Application Insights cookies across subdomains.
         */
        domain?: string;
        /**
         * Specifies the path to use for the cookie, defaults to '/'
         */
        path?: string;
        /**
         * Hook function to fetch the named cookie value.
         * @param name - The name of the cookie
         */
        getCookie?: (name: string) => string;
        /**
         * Hook function to set the named cookie with the specified value.
         * @param name - The name of the cookie
         * @param value - The value to set for the cookie
         */
        setCookie?: (name: string, value: string) => void;
        /**
         * Hook function to delete the named cookie with the specified value, separated from
         * setCookie to avoid the need to parse the value to determine whether the cookie is being
         * added or removed.
         * @param name - The name of the cookie
         * @param cookieValue - The value to set to expire the cookie
         */
        delCookie?: (name: string, cookieValue: string) => void;
    }

    /**
     * Provides a collection of utility functions, included for backward compatibility with previous releases.
     * @deprecated Marking this interface and instance as deprecated in favor of direct usage of the helper functions
     * as direct usage provides better tree-shaking and minification by avoiding the inclusion of the unused items
     * in your resulting code.
     */
    interface ICoreUtils {
        /**
         * Internal - Do not use directly.
         * @deprecated Direct usage of this property is not recommend
         */
        _canUseCookies: boolean;
        isTypeof: (value: any, theType: string) => boolean;
        isUndefined: (value: any) => boolean;
        isNullOrUndefined: (value: any) => boolean;
        hasOwnProperty: (obj: any, prop: string) => boolean;
        /**
         * Checks if the passed of value is a function.
         * @param {any} value - Value to be checked.
         * @return {boolean} True if the value is a boolean, false otherwise.
         */
        isFunction: (value: any) => value is Function;
        /**
         * Checks if the passed of value is a function.
         * @param {any} value - Value to be checked.
         * @return {boolean} True if the value is a boolean, false otherwise.
         */
        isObject: (value: any) => boolean;
        /**
         * Check if an object is of type Date
         */
        isDate: (obj: any) => obj is Date;
        /**
         * Check if an object is of type Array
         */
        isArray: (obj: any) => boolean;
        /**
         * Check if an object is of type Error
         */
        isError: (obj: any) => obj is Error;
        /**
         * Checks if the type of value is a string.
         * @param {any} value - Value to be checked.
         * @return {boolean} True if the value is a string, false otherwise.
         */
        isString: (value: any) => value is string;
        /**
         * Checks if the type of value is a number.
         * @param {any} value - Value to be checked.
         * @return {boolean} True if the value is a number, false otherwise.
         */
        isNumber: (value: any) => value is number;
        /**
         * Checks if the type of value is a boolean.
         * @param {any} value - Value to be checked.
         * @return {boolean} True if the value is a boolean, false otherwise.
         */
        isBoolean: (value: any) => value is boolean;
        /**
         * Convert a date to I.S.O. format in IE8
         */
        toISOString: (date: Date) => string;
        /**
         * Performs the specified action for each element in an array. This helper exists to avoid adding a polyfil for older browsers
         * that do not define Array.prototype.xxxx (eg. ES3 only, IE8) just in case any page checks for presence/absence of the prototype
         * implementation. Note: For consistency this will not use the Array.prototype.xxxx implementation if it exists as this would
         * cause a testing requirement to test with and without the implementations
         * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array. It can return -1 to break out of the loop
         * @param thisArg  [Optional] An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        arrForEach: <T>(arr: T[], callbackfn: (value: T, index?: number, array?: T[]) => void | number, thisArg?: any) => void;
        /**
         * Returns the index of the first occurrence of a value in an array. This helper exists to avoid adding a polyfil for older browsers
         * that do not define Array.prototype.xxxx (eg. ES3 only, IE8) just in case any page checks for presence/absence of the prototype
         * implementation. Note: For consistency this will not use the Array.prototype.xxxx implementation if it exists as this would
         * cause a testing requirement to test with and without the implementations
         * @param searchElement The value to locate in the array.
         * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
         */
        arrIndexOf: <T>(arr: T[], searchElement: T, fromIndex?: number) => number;
        /**
         * Calls a defined callback function on each element of an array, and returns an array that contains the results. This helper exists
         * to avoid adding a polyfil for older browsers that do not define Array.prototype.xxxx (eg. ES3 only, IE8) just in case any page
         * checks for presence/absence of the prototype implementation. Note: For consistency this will not use the Array.prototype.xxxx
         * implementation if it exists as this would cause a testing requirement to test with and without the implementations
         * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
         * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
         */
        arrMap: <T, R>(arr: T[], callbackfn: (value: T, index?: number, array?: T[]) => R, thisArg?: any) => R[];
        /**
         * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is
         * provided as an argument in the next call to the callback function. This helper exists to avoid adding a polyfil for older browsers that do not define
         * Array.prototype.xxxx (eg. ES3 only, IE8) just in case any page checks for presence/absence of the prototype implementation. Note: For consistency
         * this will not use the Array.prototype.xxxx implementation if it exists as this would cause a testing requirement to test with and without the implementations
         * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
         * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
         */
        arrReduce: <T, R>(arr: T[], callbackfn: (previousValue: T | R, currentValue?: T, currentIndex?: number, array?: T[]) => R, initialValue?: R) => R;
        /**
         * helper method to trim strings (IE8 does not implement String.prototype.trim)
         */
        strTrim: (str: any) => string;
        /**
         * Creates an object that has the specified prototype, and that optionally contains specified properties. This helper exists to avoid adding a polyfil
         * for older browsers that do not define Object.create eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
         * Note: For consistency this will not use the Object.create implementation if it exists as this would cause a testing requirement to test with and without the implementations
         * @param obj Object to use as a prototype. May be null
         */
        objCreate: (obj: object) => any;
        /**
         * Returns the names of the enumerable string properties and methods of an object. This helper exists to avoid adding a polyfil for older browsers
         * that do not define Object.keys eg. ES3 only, IE8 just in case any page checks for presence/absence of the prototype implementation.
         * Note: For consistency this will not use the Object.keys implementation if it exists as this would cause a testing requirement to test with and without the implementations
         * @param obj Object that contains the properties and methods. This can be an object that you created or an existing Document Object Model (DOM) object.
         */
        objKeys: (obj: {}) => string[];
        /**
         * Try to define get/set object property accessors for the target object/prototype, this will provide compatibility with
         * existing API definition when run within an ES5+ container that supports accessors but still enable the code to be loaded
         * and executed in an ES3 container, providing basic IE8 compatibility.
         * @param target The object on which to define the property.
         * @param prop The name of the property to be defined or modified.
         * @param getProp The getter function to wire against the getter.
         * @param setProp The setter function to wire against the setter.
         * @returns True if it was able to create the accessors otherwise false
         */
        objDefineAccessors: <T>(target: any, prop: string, getProp?: () => T, setProp?: (v: T) => void) => boolean;
        /**
         * Trys to add an event handler for the specified event to the window, body and document
         * @param eventName {string} - The name of the event
         * @param callback {any} - The callback function that needs to be executed for the given event
         * @return {boolean} - true if the handler was successfully added
         */
        addEventHandler: (eventName: string, callback: any) => boolean;
        /**
         * Return the current time via the Date now() function (if available) and falls back to (new Date()).getTime() if now() is unavailable (IE8 or less)
         * https://caniuse.com/#search=Date.now
         */
        dateNow: () => number;
        /**
         * Identifies whether the current environment appears to be IE
         */
        isIE: () => boolean;
        /**
         * @deprecated - Use the core.getCookieMgr().disable()
         * Force the SDK not to store and read any data from cookies.
         */
        disableCookies: () => void;
        newGuid: () => string;
        /**
         * Return the current value of the Performance Api now() function (if available) and fallback to dateNow() if it is unavailable (IE9 or less)
         * https://caniuse.com/#search=performance.now
         */
        perfNow: () => number;
        /**
         * Generate random base64 id string.
         * The default length is 22 which is 132-bits so almost the same as a GUID but as base64 (the previous default was 5)
         * @param maxLength - Optional value to specify the length of the id to be generated, defaults to 22
         */
        newId: (maxLength?: number) => string;
        /**
         * Generate a random value between 0 and maxValue, max value should be limited to a 32-bit maximum.
         * So maxValue(16) will produce a number from 0..16 (range of 17)
         * @param maxValue
         */
        randomValue: (maxValue: number) => number;
        /**
         * generate a random 32-bit number (0x000000..0xFFFFFFFF) or (-0x80000000..0x7FFFFFFF), defaults un-unsigned.
         * @param signed - True to return a signed 32-bit number (-0x80000000..0x7FFFFFFF) otherwise an unsigned one (0x000000..0xFFFFFFFF)
         */
        random32: (signed?: boolean) => number;
        /**
         * Seed the MWC random number generator with the specified seed or a random value
         * @param value - optional the number to used as the seed, if undefined, null or zero a random value will be chosen
         */
        mwcRandomSeed: (value?: number) => void;
        /**
         * Generate a random 32-bit number between (0x000000..0xFFFFFFFF) or (-0x80000000..0x7FFFFFFF), using MWC (Multiply with carry)
         * instead of Math.random() defaults to un-signed.
         * Used as a replacement random generator for IE to avoid issues with older IE instances.
         * @param signed - True to return a signed 32-bit number (-0x80000000..0x7FFFFFFF) otherwise an unsigned one (0x000000..0xFFFFFFFF)
         */
        mwcRandom32: (signed?: boolean) => number;
        /**
         * generate W3C trace id
         */
        generateW3CId: () => string;
    }

    interface ICorrelationConfig {
        enableCorsCorrelation: boolean;
        correlationHeaderExcludedDomains: string[];
        correlationHeaderExcludePatterns?: RegExp[];
        disableCorrelationHeaders: boolean;
        distributedTracingMode: DistributedTracingModes;
        maxAjaxCallsPerView: number;
        disableAjaxTracking: boolean;
        disableFetchTracking: boolean;
        appId?: string;
        enableRequestHeaderTracking?: boolean;
        enableResponseHeaderTracking?: boolean;
        enableAjaxErrorStatusText?: boolean;
        /**
         * Flag to enable looking up and including additional browser window.performance timings
         * in the reported ajax (XHR and fetch) reported metrics.
         * Defaults to false.
         */
        enableAjaxPerfTracking?: boolean;
        /**
         * The maximum number of times to look for the window.performance timings (if available), this
         * is required as not all browsers populate the window.performance before reporting the
         * end of the XHR request and for fetch requests this is added after its complete
         * Defaults to 3
         */
        maxAjaxPerfLookupAttempts?: number;
        /**
         * The amount of time to wait before re-attempting to find the windows.performance timings
         * for an ajax request, time is in milliseconds and is passed directly to setTimeout()
         * Defaults to 25.
         */
        ajaxPerfLookupDelay?: number;
        correlationHeaderDomains?: string[];
        /**
         * Response and request headers to be excluded from ajax tracking data.
         */
        ignoreHeaders?: string[];
        /**
         * Provide a way to exclude specific route from automatic tracking for XMLHttpRequest or Fetch request.
         * For an ajax / fetch request that the request url matches with the regex patterns, auto tracking is turned off.
         * Default is undefined.
         */
        excludeRequestFromAutoTrackingPatterns?: string[] | RegExp[];
        /**
         * Provide a way to enrich dependencies logs with context at the beginning of api call.
         * Default is undefined.
         */
        addRequestContext?: (requestContext?: IRequestContext) => ICustomProperties;
    }

    interface ICorrelationIdHelper {
        correlationIdPrefix: string;
        /**
         * Checks if a request url is not on a excluded domain list and if it is safe to add correlation headers.
         * Headers are always included if the current domain matches the request domain. If they do not match (CORS),
         * they are regex-ed across correlationHeaderDomains and correlationHeaderExcludedDomains to determine if headers are included.
         * Some environments don't give information on currentHost via window.location.host (e.g. Cordova). In these cases, the user must
         * manually supply domains to include correlation headers on. Else, no headers will be included at all.
         */
        canIncludeCorrelationHeader(config: ICorrelationConfig, requestUrl: string, currentHost?: string): boolean;
        /**
         * Combines target appId and target role name from response header.
         */
        getCorrelationContext(responseHeader: string): string | undefined;
        /**
         * Gets key from correlation response header
         */
        getCorrelationContextValue(responseHeader: string, key: string): string | undefined;
    }

    interface ICustomProperties {
        [key: string]: any;
    }

    interface IDataSanitizer {
        /**
         * Max length allowed for custom names.
         */
        MAX_NAME_LENGTH: number;
        /**
         * Max length allowed for Id field in page views.
         */
        MAX_ID_LENGTH: number;
        /**
         * Max length allowed for custom values.
         */
        MAX_PROPERTY_LENGTH: number;
        /**
         * Max length allowed for names
         */
        MAX_STRING_LENGTH: number;
        /**
         * Max length allowed for url.
         */
        MAX_URL_LENGTH: number;
        /**
         * Max length allowed for messages.
         */
        MAX_MESSAGE_LENGTH: number;
        /**
         * Max length allowed for exceptions.
         */
        MAX_EXCEPTION_LENGTH: number;
        sanitizeKeyAndAddUniqueness: (logger: IDiagnosticLogger, key: any, map: any) => string;
        sanitizeKey: (logger: IDiagnosticLogger, name: any) => string;
        sanitizeString: (logger: IDiagnosticLogger, value: any, maxLength?: number) => string;
        sanitizeUrl: (logger: IDiagnosticLogger, url: any) => string;
        sanitizeMessage: (logger: IDiagnosticLogger, message: any) => string;
        sanitizeException: (logger: IDiagnosticLogger, exception: any) => string;
        sanitizeProperties: (logger: IDiagnosticLogger, properties: any) => any;
        sanitizeMeasurements: (logger: IDiagnosticLogger, measurements: any) => any;
        sanitizeId: (logger: IDiagnosticLogger, id: string) => string;
        sanitizeInput: (logger: IDiagnosticLogger, input: any, maxLength: number, _msgId: _InternalMessageId) => any;
        padNumber: (num: number) => string;
        /**
         * helper method to trim strings (IE8 does not implement String.prototype.trim)
         */
        trim: (str: any) => string;
    }

    interface IDateTimeUtils {
        /**
         * Get the number of milliseconds since 1970/01/01 in local timezone
         */
        Now: () => number;
        /**
         * Gets duration between two timestamps
         */
        GetDuration: (start: number, end: number) => number;
    }

    interface IDependenciesPlugin {
        /**
         * Logs dependency call
         * @param dependencyData dependency data object
         */
        trackDependencyData(dependency: IDependencyTelemetry): void;
    }

    /**
     * DependencyTelemetry telemetry interface
     */
    interface IDependencyTelemetry extends IPartC {
        id: string;
        name?: string;
        duration?: number;
        success?: boolean;
        startTime?: Date;
        responseCode: number;
        correlationContext?: string;
        type?: string;
        data?: string;
        target?: string;
        iKey?: string;
    }

    interface IDevice {
        /**
         * The type for the current device.
         */
        deviceClass: string;
        /**
         * A device unique ID.
         */
        id: string;
        /**
         * The device model for the current device.
         */
        model: string;
        /**
         * The application screen resolution.
         */
        resolution: string;
        /**
         * The IP address.
         */
        ip: string;
    }

    interface IDiagnosticLogger {
        /**
         * When this is true the SDK will throw exceptions to aid in debugging.
         */
        enableDebugExceptions: () => boolean;
        /**
         * 0: OFF
         * 1: only critical (default)
         * 2: critical + info
         */
        consoleLoggingLevel: () => number;
        /**
         * 0: OFF (default)
         * 1: CRITICAL
         * 2: WARNING
         */
        telemetryLoggingLevel: () => number;
        /**
         * The maximum number of internal messages allowed to be sent per page view
         */
        maxInternalMessageLimit: () => number;
        /**
         * The internal logging queue
         */
        queue: _InternalLogMessage[];
        /**
         * This method will throw exceptions in debug mode or attempt to log the error as a console warning.
         * @param severity {LoggingSeverity} - The severity of the log message
         * @param message {_InternalLogMessage} - The log message.
         */
        throwInternal(severity: LoggingSeverity, msgId: _InternalMessageId, msg: string, properties?: Object, isUserAct?: boolean): void;
        /**
         * This will write a warning to the console if possible
         * @param message {string} - The warning message
         */
        warnToConsole(message: string): void;
        /**
         * This will write an error to the console if possible.
         * Provided by the default DiagnosticLogger instance, and internally the SDK will fall back to warnToConsole, however,
         * direct callers MUST check for its existence on the logger as you can provide your own IDiagnosticLogger instance.
         * @param message {string} - The error message
         */
        errorToConsole?(message: string): void;
        /**
         * Resets the internal message count
         */
        resetInternalMessageCount(): void;
        /**
         * Logs a message to the internal queue.
         * @param severity {LoggingSeverity} - The severity of the log message
         * @param message {_InternalLogMessage} - The message to log.
         */
        logInternalMessage?(severity: LoggingSeverity, message: _InternalLogMessage): void;
    }

    interface IEnvelope extends ISerializable {
        ver: number;
        name: string;
        time: string;
        sampleRate: number;
        seq: string;
        iKey: string;
        tags: {
            [name: string]: any;
        };
        data: any;
    }

    interface IEventTelemetry extends IPartC {
        /**
         * @description An event name string
         * @type {string}
         * @memberof IEventTelemetry
         */
        name: string;
        /**
         * @description custom defined iKey
         * @type {string}
         * @memberof IEventTelemetry
         */
        iKey?: string;
    }

    interface IExceptionDetailsInternal {
        id: number;
        outerId: number;
        typeName: string;
        message: string;
        hasFullStack: boolean;
        stack: string;
        parsedStack: IExceptionStackFrameInternal[];
    }

    interface IExceptionInternal extends IPartC {
        ver: string;
        id: string;
        exceptions: IExceptionDetailsInternal[];
        severityLevel?: SeverityLevel | number;
        problemGroup: string;
        isManual: boolean;
    }

    interface IExceptionStackFrameInternal {
        level: number;
        method: string;
        assembly: string;
        fileName: string;
        line: number;
        pos?: number;
    }

    /**
     * @export
     * @interface IExceptionTelemetry
     * @description Exception interface used as primary parameter to trackException
     */
    interface IExceptionTelemetry extends IPartC {
        /**
         * Unique guid identifying this error
         */
        id?: string;
        /**
         * @deprecated
         * @type {Error}
         * @memberof IExceptionTelemetry
         * @description DEPRECATED: Please use exception instead. Behavior/usage for exception remains the same as this field.
         */
        error?: Error;
        /**
         * @type {Error}
         * @memberof IExceptionTelemetry
         * @description Error Object(s)
         */
        exception?: Error | IAutoExceptionTelemetry;
        /**
         * @description Specified severity of exception for use with
         * telemetry filtering in dashboard
         * @type {(SeverityLevel | number)}
         * @memberof IExceptionTelemetry
         */
        severityLevel?: SeverityLevel | number;
    }

    interface IInstrumentationRequirements extends IDependenciesPlugin {
        includeCorrelationHeaders: (ajaxData: ajaxRecord, input?: Request | string, init?: RequestInit, xhr?: XMLHttpRequestInstrumented) => any;
    }

    interface IInternal {
        /**
         * The SDK version used to create this telemetry item.
         */
        sdkVersion: string;
        /**
         * The SDK agent version.
         */
        agentVersion: string;
        /**
         * The Snippet version used to initialize the sdk instance, this will contain either
         * undefined/null - Snippet not used
         * '-' - Version and legacy mode not determined
         * # - Version # of the snippet
         * #.l - Version # in legacy mode
         * .l - No defined version, but used legacy mode initialization
         */
        snippetVer: string;
        /**
         * Identifies the source of the sdk script
         */
        sdkSrc: string;
    }

    interface ILocation {
        /**
         * Client IP address for reverse lookup
         */
        ip: string;
    }

    interface IMetricTelemetry extends IPartC {
        /**
         * @description (required) - name of this metric
         * @type {string}
         * @memberof IMetricTelemetry
         */
        name: string;
        /**
         * @description (required) - Recorded value/average for this metric
         * @type {number}
         * @memberof IMetricTelemetry
         */
        average: number;
        /**
         * @description (optional) Number of samples represented by the average.
         * @type {number=}
         * @memberof IMetricTelemetry
         * @default sampleCount=1
         */
        sampleCount?: number;
        /**
         * @description (optional) The smallest measurement in the sample. Defaults to the average
         * @type {number}
         * @memberof IMetricTelemetry
         * @default min=average
         */
        min?: number;
        /**
         * @description (optional) The largest measurement in the sample. Defaults to the average.
         * @type {number}
         * @memberof IMetricTelemetry
         * @default max=average
         */
        max?: number;
        /**
         * (optional) The standard deviation measurement in the sample, Defaults to undefined which results in zero.
         */
        stdDev?: number;
        /**
         * @description custom defined iKey
         * @type {string}
         * @memberof IMetricTelemetry
         */
        iKey?: string;
    }

    /**
     * An interface used for the notification listener.
     * @interface
     */
    interface INotificationListener {
        /**
         * [Optional] A function called when events are sent.
         * @param {ITelemetryItem[]} events - The array of events that have been sent.
         */
        eventsSent?: (events: ITelemetryItem[]) => void;
        /**
         * [Optional] A function called when events are discarded.
         * @param {ITelemetryItem[]} events - The array of events that have been discarded.
         * @param {number} reason           - The reason for discarding the events. The EventsDiscardedReason
         * constant should be used to check the different values.
         */
        eventsDiscarded?: (events: ITelemetryItem[], reason: number) => void;
        /**
         * [Optional] A function called when the events have been requested to be sent to the sever.
         * @param {number} sendReason - The reason why the event batch is being sent.
         * @param {boolean} isAsync   - A flag which identifies whether the requests are being sent in an async or sync manner.
         */
        eventsSendRequest?: (sendReason: number, isAsync?: boolean) => void;
        /**
         * [Optional] This event is sent if you have enabled perf events, they are primarily used to track internal performance testing and debugging
         * the event can be displayed via the debug plugin extension.
         * @param perfEvent
         */
        perfEvent?: (perfEvent: IPerfEvent) => void;
    }

    /**
     * Class to manage sending notifications to all the listeners.
     */
    interface INotificationManager {
        listeners: INotificationListener[];
        /**
         * Adds a notification listener.
         * @param {INotificationListener} listener - The notification listener to be added.
         */
        addNotificationListener(listener: INotificationListener): void;
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - AWTNotificationListener to remove.
         */
        removeNotificationListener(listener: INotificationListener): void;
        /**
         * Notification for events sent.
         * @param {ITelemetryItem[]} events - The array of events that have been sent.
         */
        eventsSent(events: ITelemetryItem[]): void;
        /**
         * Notification for events being discarded.
         * @param {ITelemetryItem[]} events - The array of events that have been discarded by the SDK.
         * @param {number} reason           - The reason for which the SDK discarded the events. The EventsDiscardedReason
         * constant should be used to check the different values.
         */
        eventsDiscarded(events: ITelemetryItem[], reason: number): void;
        /**
         * [Optional] A function called when the events have been requested to be sent to the sever.
         * @param {number} sendReason - The reason why the event batch is being sent.
         * @param {boolean} isAsync   - A flag which identifies whether the requests are being sent in an async or sync manner.
         */
        eventsSendRequest?(sendReason: number, isAsync: boolean): void;
        /**
         * [Optional] This event is sent if you have enabled perf events, they are primarily used to track internal performance testing and debugging
         * the event can be displayed via the debug plugin extension.
         * @param perfEvent
         */
        perfEvent?(perfEvent: IPerfEvent): void;
    }

    class _InternalLogMessage {
        static dataType: string;
        message: string;
        messageId: _InternalMessageId;
        constructor(msgId: _InternalMessageId, msg: string, isUserAct?: boolean, properties?: Object);
    }

    /**
     * Internal message ID. Please create a new one for every conceptually different message. Please keep alphabetically ordered
     */
    const _InternalMessageId: {
        BrowserDoesNotSupportLocalStorage: number;
        BrowserCannotReadLocalStorage: number;
        BrowserCannotReadSessionStorage: number;
        BrowserCannotWriteLocalStorage: number;
        BrowserCannotWriteSessionStorage: number;
        BrowserFailedRemovalFromLocalStorage: number;
        BrowserFailedRemovalFromSessionStorage: number;
        CannotSendEmptyTelemetry: number;
        ClientPerformanceMathError: number;
        ErrorParsingAISessionCookie: number;
        ErrorPVCalc: number;
        ExceptionWhileLoggingError: number;
        FailedAddingTelemetryToBuffer: number;
        FailedMonitorAjaxAbort: number;
        FailedMonitorAjaxDur: number;
        FailedMonitorAjaxOpen: number;
        FailedMonitorAjaxRSC: number;
        FailedMonitorAjaxSend: number;
        FailedMonitorAjaxGetCorrelationHeader: number;
        FailedToAddHandlerForOnBeforeUnload: number;
        FailedToSendQueuedTelemetry: number;
        FailedToReportDataLoss: number;
        FlushFailed: number;
        MessageLimitPerPVExceeded: number;
        MissingRequiredFieldSpecification: number;
        NavigationTimingNotSupported: number;
        OnError: number;
        SessionRenewalDateIsZero: number;
        SenderNotInitialized: number;
        StartTrackEventFailed: number;
        StopTrackEventFailed: number;
        StartTrackFailed: number;
        StopTrackFailed: number;
        TelemetrySampledAndNotSent: number;
        TrackEventFailed: number;
        TrackExceptionFailed: number;
        TrackMetricFailed: number;
        TrackPVFailed: number;
        TrackPVFailedCalc: number;
        TrackTraceFailed: number;
        TransmissionFailed: number;
        FailedToSetStorageBuffer: number;
        FailedToRestoreStorageBuffer: number;
        InvalidBackendResponse: number;
        FailedToFixDepricatedValues: number;
        InvalidDurationValue: number;
        TelemetryEnvelopeInvalid: number;
        CreateEnvelopeError: number;
        CannotSerializeObject: number;
        CannotSerializeObjectNonSerializable: number;
        CircularReferenceDetected: number;
        ClearAuthContextFailed: number;
        ExceptionTruncated: number;
        IllegalCharsInName: number;
        ItemNotInArray: number;
        MaxAjaxPerPVExceeded: number;
        MessageTruncated: number;
        NameTooLong: number;
        SampleRateOutOfRange: number;
        SetAuthContextFailed: number;
        SetAuthContextFailedAccountName: number;
        StringValueTooLong: number;
        StartCalledMoreThanOnce: number;
        StopCalledWithoutStart: number;
        TelemetryInitializerFailed: number;
        TrackArgumentsNotSpecified: number;
        UrlTooLong: number;
        SessionStorageBufferFull: number;
        CannotAccessCookie: number;
        IdTooLong: number;
        InvalidEvent: number;
        FailedMonitorAjaxSetRequestHeader: number;
        SendBrowserInfoOnUserInit: number;
        PluginException: number;
        NotificationException: number;
        SnippetScriptLoadFailure: number;
        InvalidInstrumentationKey: number;
        CannotParseAiBlobValue: number;
        InvalidContentBlob: number;
        TrackPageActionEventFailed: number;
        FailedAddingCustomDefinedRequestContext: number;
        InMemoryStorageBufferFull: number;
    };

    type _InternalMessageId = number | typeof _InternalMessageId;

    interface IOperatingSystem {
        name: string;
    }

    interface IPageViewPerformanceTelemetry extends IPartC {
        /**
         * name String - The name of the page. Defaults to the document title.
         */
        name?: string;
        /**
         * url String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
         */
        uri?: string;
        /**
         * Performance total in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff". This is total duration in timespan format.
         */
        perfTotal?: string;
        /**
         * Performance total in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff". This represents the total page load time.
         */
        duration?: string;
        /**
         * Sent request time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        networkConnect?: string;
        /**
         * Sent request time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff.
         */
        sentRequest?: string;
        /**
         * Received response time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff.
         */
        receivedResponse?: string;
        /**
         * DOM processing time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        domProcessing?: string;
    }

    interface IPageViewPerformanceTelemetryInternal extends IPageViewPerformanceTelemetry {
        /**
         * An identifier assigned to each distinct impression for the purposes of correlating with pageview.
         * A new id is automatically generated on each pageview. You can manually specify this field if you
         * want to use a specific value instead.
         */
        id?: string;
        /**
         * Version of the part B schema, todo: set this value in trackpageView
         */
        ver?: string;
        /**
         * Field indicating whether this instance of PageViewPerformance is valid and should be sent
         */
        isValid?: boolean;
        /**
         * Duration in miliseconds
         */
        durationMs?: number;
    }

    /**
     * Pageview telemetry interface
     */
    interface IPageViewTelemetry extends IPartC {
        /**
         * name String - The string you used as the name in startTrackPage. Defaults to the document title.
         */
        name?: string;
        /**
         * uri  String - a relative or absolute URL that identifies the page or other item. Defaults to the window location.
         */
        uri?: string;
        /**
         * refUri  String - the URL of the source page where current page is loaded from
         */
        refUri?: string;
        /**
         * pageType  String - page type
         */
        pageType?: string;
        /**
         * isLoggedIn - boolean is user logged in
         */
        isLoggedIn?: boolean;
        /**
         * Property bag to contain additional custom properties (Part C)
         */
        properties?: {
            /**
             * The number of milliseconds it took to load the page. Defaults to undefined. If set to default value, page load time is calculated internally.
             */
            duration?: number;
            [key: string]: any;
        };
        /**
         * iKey String - custom defined iKey.
         */
        iKey?: string;
    }

    interface IPageViewTelemetryInternal extends IPageViewTelemetry {
        /**
         * An identifier assigned to each distinct impression for the purposes of correlating with pageview.
         * A new id is automatically generated on each pageview. You can manually specify this field if you
         * want to use a specific value instead.
         */
        id?: string;
        /**
         * Version of the part B schema, todo: set this value in trackpageView
         */
        ver?: string;
    }

    /**
     * PartC  telemetry interface
     */
    interface IPartC {
        /**
         * Property bag to contain additional custom properties (Part C)
         */
        properties?: {
            [key: string]: any;
        };
        /**
         * Property bag to contain additional custom measurements (Part C)
         * @deprecated -- please use properties instead
         */
        measurements?: {
            [key: string]: number;
        };
    }

    /**
     * This interface identifies the details of an internal performance event - it does not represent an outgoing reported event
     */
    interface IPerfEvent {
        /**
         * The name of the performance event
         */
        name: string;
        /**
         * The start time of the performance event
         */
        start: number;
        /**
         * The payload (contents) of the perfEvent, may be null or only set after the event has completed depending on
         * the runtime environment.
         */
        payload: any;
        /**
         * Is this occurring from an asynchronous event
         */
        isAsync: boolean;
        /**
         * Identifies the total inclusive time spent for this event, including the time spent for child events,
         * this will be undefined until the event is completed
         */
        time?: number;
        /**
         * Identifies the exclusive time spent in for this event (not including child events),
         * this will be undefined until the event is completed.
         */
        exTime?: number;
        /**
         * The Parent event that was started before this event was created
         */
        parent?: IPerfEvent;
        /**
         * The child perf events that are contained within the total time of this event.
         */
        childEvts?: IPerfEvent[];
        /**
         * Identifies whether this event is a child event of a parent
         */
        isChildEvt: () => boolean;
        /**
         * Get the names additional context associated with this perf event
         */
        getCtx?: (key: string) => any;
        /**
         * Set the named additional context to be associated with this perf event, this will replace any existing value
         */
        setCtx?: (key: string, value: any) => void;
        /**
         * Mark this event as completed, calculating the total execution time.
         */
        complete: () => void;
    }

    /**
     * This defines an internal performance manager for tracking and reporting the internal performance of the SDK -- It does
     * not represent or report any event to the server.
     */
    interface IPerfManager {
        /**
         * Create a new event and start timing, the manager may return null/undefined to indicate that it does not
         * want to monitor this source event.
         * @param src The source name of the event
         * @param payloadDetails - An optional callback function to fetch the payload details for the event.
         * @param isAsync - Is the event occurring from a async event
         */
        create(src: string, payloadDetails?: () => any, isAsync?: boolean): IPerfEvent | null | undefined;
        /**
         * Complete the perfEvent and fire any notifications.
         * @param perfEvent Fire the event which will also complete the passed event
         */
        fire(perfEvent: IPerfEvent): void;
        /**
         * Set an execution context value
         * @param key - The context key name
         * @param value - The value
         */
        setCtx(key: string, value: any): void;
        /**
         * Get the execution context value
         * @param key - The context key
         */
        getCtx(key: string): any;
    }

    /**
     * Identifies an interface to a host that can provide an IPerfManager implementation
     */
    interface IPerfManagerProvider {
        /**
         * Get the current performance manager
         */
        getPerfMgr(): IPerfManager;
        /**
         * Set the current performance manager
         * @param perfMgr The performance manager
         */
        setPerfMgr(perfMgr: IPerfManager): void;
    }

    interface IPlugin {
        /**
         * Initialize plugin loaded by SDK
         * @param config - The config for the plugin to use
         * @param core - The current App Insights core to use for initializing this plugin instance
         * @param extensions - The complete set of extensions to be used for initializing the plugin
         * @param pluginChain - [Optional] specifies the current plugin chain which identifies the
         * set of plugins and the order they should be executed for the current request.
         */
        initialize: (config: IConfiguration, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain) => void;
        /**
         * Returns a value that indicates whether the plugin has already been previously initialized.
         * New plugins should implement this method to avoid being initialized more than once.
         */
        isInitialized?: () => boolean;
        /**
         * Tear down the plugin and remove any hooked value, the plugin should remove that it is no longer initialized and
         * therefore can be re-initialized after being torn down.
         */
        teardown?: () => void;
        /**
         * Extension name
         */
        readonly identifier: string;
        /**
         * Plugin version (available in data.properties.version in common schema)
         */
        readonly version?: string;
    }

    /**
     * The current context for the current call to processTelemetry(), used to support sharing the same plugin instance
     * between multiple AppInsights instances
     */
    interface IProcessTelemetryContext {
        /**
         * The current core instance for the request
         */
        core: () => IAppInsightsCore;
        /**
         * THe current diagnostic logger for the request
         */
        diagLog: () => IDiagnosticLogger;
        /**
         * Gets the current core config instance
         */
        getCfg: () => IConfiguration;
        /**
         * Gets the named extension config
         */
        getExtCfg: <T>(identifier: string, defaultValue?: T | any) => T;
        /**
         * Gets the named config from either the named identifier extension or core config if neither exist then the
         * default value is returned
         * @param identifier The named extension identifier
         * @param field The config field name
         * @param defaultValue The default value to return if no defined config exists
         */
        getConfig: (identifier: string, field: string, defaultValue?: number | string | boolean) => number | string | boolean;
        /**
         * Helper to allow plugins to check and possibly shortcut executing code only
         * required if there is a nextPlugin
         */
        hasNext: () => boolean;
        /**
         * Returns the next configured plugin proxy
         */
        getNext: () => ITelemetryPluginChain;
        /**
         * Helper to set the next plugin proxy
         */
        setNext: (nextCtx: ITelemetryPluginChain) => void;
        /**
         * Call back for telemetry processing before it it is sent
         * @param env - This is the current event being reported
         */
        processNext: (env: ITelemetryItem) => void;
        /**
         * Create a new context using the core and config from the current instance
         * @param plugins - The execution order to process the plugins, if null or not supplied
         *                  then the current execution order will be copied.
         * @param startAt - The plugin to start processing from, if missing from the execution
         *                  order then the next plugin will be NOT set.
         */
        createNew: (plugins?: IPlugin[] | ITelemetryPluginChain, startAt?: IPlugin) => IProcessTelemetryContext;
    }

    interface IPropertiesPlugin {
        readonly context: ITelemetryContext;
    }

    interface IPropTelemetryContext extends ITelemetryContext {
        readonly sessionManager: _SessionManager;
        applySessionContext(evt: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyOperatingSystemContxt(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyApplicationContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyDeviceContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyInternalContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyLocationContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyOperationContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyWebContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        applyUserContext(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        cleanUp(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
    }

    interface IRequestContext {
        status?: number;
        xhr?: XMLHttpRequest;
        request?: Request;
        response?: Response | string;
    }

    interface IRequestHeaders {
        /**
         * Request-Context header
         */
        requestContextHeader: string;
        /**
         * Target instrumentation header that is added to the response and retrieved by the
         * calling application when processing incoming responses.
         */
        requestContextTargetKey: string;
        /**
         * Request-Context appId format
         */
        requestContextAppIdFormat: string;
        /**
         * Request-Id header
         */
        requestIdHeader: string;
        /**
         * W3C distributed tracing protocol header
         */
        traceParentHeader: string;
        /**
         * W3C distributed tracing protocol state header
         */
        traceStateHeader: string;
        /**
         * Sdk-Context header
         * If this header passed with appId in content then appId will be returned back by the backend.
         */
        sdkContextHeader: string;
        /**
         * String to pass in header for requesting appId back from the backend.
         */
        sdkContextHeaderAppIdRequest: string;
        requestContextHeaderLowerCase: string;
    }

    interface IResponseError {
        readonly index: number;
        readonly statusCode: number;
        readonly message: string;
    }

    interface ISample {
        /**
         * Sample rate
         */
        sampleRate: number;
        isSampledIn(envelope: ITelemetryItem): boolean;
    }

    interface ISendBuffer {
        /**
         * Enqueue the payload
         */
        enqueue: (payload: string) => void;
        /**
         * Returns the number of elements in the buffer
         */
        count: () => number;
        /**
         * Returns the current size of the serialized buffer
         */
        size: () => number;
        /**
         * Clears the buffer
         */
        clear: () => void;
        /**
         * Returns items stored in the buffer
         */
        getItems: () => string[];
        /**
         * Build a batch of all elements in the payload array
         */
        batchPayloads: (payload: string[]) => string;
        /**
         * Moves items to the SENT_BUFFER.
         * The buffer holds items which were sent, but we haven't received any response from the backend yet.
         */
        markAsSent: (payload: string[]) => void;
        /**
         * Removes items from the SENT_BUFFER. Should be called on successful response from the backend.
         */
        clearSent: (payload: string[]) => void;
    }

    interface ISenderConfig {
        /**
         * The url to which payloads will be sent
         */
        endpointUrl: () => string;
        /**
         * The JSON format (normal vs line delimited). True means line delimited JSON.
         */
        emitLineDelimitedJson: () => boolean;
        /**
         * The maximum size of a batch in bytes
         */
        maxBatchSizeInBytes: () => number;
        /**
         * The maximum interval allowed between calls to batchInvoke
         */
        maxBatchInterval: () => number;
        /**
         * The master off switch.  Do not send any data if set to TRUE
         */
        disableTelemetry: () => boolean;
        /**
         * Store a copy of a send buffer in the session storage
         */
        enableSessionStorageBuffer: () => boolean;
        /**
         * Is retry handler disabled.
         * If enabled, retry on 206 (partial success), 408 (timeout), 429 (too many requests), 500 (internal server error) and 503 (service unavailable).
         */
        isRetryDisabled: () => boolean;
        isBeaconApiDisabled: () => boolean;
        /**
         * Don't use XMLHttpRequest or XDomainRequest (for IE < 9) by default instead attempt to use fetch() or sendBeacon.
         * If no other transport is available it will still use XMLHttpRequest
         */
        disableXhr: () => boolean;
        /**
         * If fetch keepalive is supported do not use it for sending events during unload, it may still fallback to fetch() without keepalive
         */
        onunloadDisableFetch: () => boolean;
        /**
         * Is beacon disabled on page unload.
         * If enabled, flush events through beaconSender.
         */
        onunloadDisableBeacon: () => boolean;
        /**
         * (Optional) Override the instrumentation key that this channel instance sends to
         */
        instrumentationKey: () => string;
        namePrefix: () => string;
        samplingPercentage: () => number;
        /**
         * (Optional) The ability for the user to provide extra headers
         */
        customHeaders: () => [{
            header: string;
            value: string;
        }];
        /**
         * (Optional) Provide user an option to convert undefined field to user defined value.
         */
        convertUndefined: () => any;
        /**
         * (Optional) The number of events that can be kept in memory before the SDK starts to drop events. By default, this is 10,000.
         */
        eventsLimitInMem: () => number;
    }

    interface ISerializable {
        /**
         * The set of fields for a serializable object.
         * This defines the serialization order and a value of true/false
         * for each field defines whether the field is required or not.
         */
        aiDataContract: any;
    }

    interface ISession {
        /**
         * The session ID.
         */
        id?: string;
        /**
         * The date at which this guid was genereated.
         * Per the spec the ID will be regenerated if more than acquisitionSpan milliseconds ellapse from this time.
         */
        acquisitionDate?: number;
        /**
         * The date at which this session ID was last reported.
         * This value should be updated whenever telemetry is sent using this ID.
         * Per the spec the ID will be regenerated if more than renewalSpan milliseconds elapse from this time with no activity.
         */
        renewalDate?: number;
    }

    interface ISessionConfig {
        sessionRenewalMs?: () => number;
        sessionExpirationMs?: () => number;
        namePrefix?: () => string;
        sessionCookiePostfix?: () => string;
        idLength?: () => number;
        getNewId?: () => (idLength?: number) => string;
        /**
         * @deprecated Avoid using this value to override the cookie manager cookie domain.
         */
        cookieDomain?: () => string;
    }

    interface IStackDetails {
        src: string;
        obj: string[];
    }

    interface ITelemetryConfig {
        instrumentationKey: () => string;
        accountId: () => string;
        sessionRenewalMs: () => number;
        samplingPercentage: () => number;
        sessionExpirationMs: () => number;
        cookieDomain: () => null;
        sdkExtension: () => string;
        isBrowserLinkTrackingEnabled: () => boolean;
        appId: () => string;
        getSessionId: () => string;
        namePrefix: () => string;
        sessionCookiePostfix: () => string;
        userCookiePostfix: () => string;
        idLength: () => number;
        getNewId: () => (idLength?: number) => string;
    }

    interface ITelemetryContext {
        /**
         * The object describing a component tracked by this object.
         */
        readonly application: IApplication;
        /**
         * The object describing a device tracked by this object.
         */
        readonly device: IDevice;
        /**
         * The object describing internal settings.
         */
        readonly internal: IInternal;
        /**
         * The object describing a location tracked by this object.
         */
        readonly location: ILocation;
        /**
         * The object describing a operation tracked by this object.
         */
        readonly telemetryTrace: ITelemetryTrace;
        /**
         * The object describing a user tracked by this object.
         */
        readonly user: IUserContext;
        /**
         * The object describing a session tracked by this object.
         */
        readonly session: ISession;
        /**
         * The object describing os details tracked by this object.
         */
        readonly os?: IOperatingSystem;
        /**
         * The object describing we details tracked by this object.
         */
        readonly web?: IWeb;
        /**
         * application id obtained from breeze responses. Is used if appId is not specified by root config
         */
        appId: () => string;
        /**
         * session id obtained from session manager.
         */
        getSessionId: () => string;
    }

    interface ITelemetryContext_2 {
        /**
         * Adds a telemetry initializer to the collection. Telemetry initializers will be called one by one,
         * in the order they were added, before the telemetry item is pushed for sending.
         * If one of the telemetry initializers returns false or throws an error then the telemetry item will not be sent.
         */
        addTelemetryInitializer(telemetryInitializer: (envelope: IEnvelope) => boolean | void): void;
    }

    /**
     * Telemety item supported in Core
     */
    interface ITelemetryItem {
        /**
         * CommonSchema Version of this SDK
         */
        ver?: string;
        /**
         * Unique name of the telemetry item
         */
        name: string;
        /**
         * Timestamp when item was sent
         */
        time?: string;
        /**
         * Identifier of the resource that uniquely identifies which resource data is sent to
         */
        iKey?: string;
        /**
         * System context properties of the telemetry item, example: ip address, city etc
         */
        ext?: {
            [key: string]: any;
        };
        /**
         * System context property extensions that are not global (not in ctx)
         */
        tags?: Tags & Tags[];
        /**
         * Custom data
         */
        data?: ICustomProperties;
        /**
         * Telemetry type used for part B
         */
        baseType?: string;
        /**
         * Based on schema for part B
         */
        baseData?: {
            [key: string]: any;
        };
    }

    /**
     * Configuration provided to SDK core
     */
    interface ITelemetryPlugin extends IPlugin {
        /**
         * Call back for telemetry processing before it it is sent
         * @param env - This is the current event being reported
         * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances
         * can optionally use this to access the current core instance or define / pass additional information
         * to later plugins (vs appending items to the telemetry item)
         */
        processTelemetry: (env: ITelemetryItem, itemCtx?: IProcessTelemetryContext) => void;
        /**
         * Set next extension for telemetry processing, this is not optional as plugins should use the
         * processNext() function of the passed IProcessTelemetryContext instead. It is being kept for
         * now for backward compatibility only.
         */
        setNextPlugin?: (next: ITelemetryPlugin | ITelemetryPluginChain) => void;
        /**
         * Priority of the extension
         */
        readonly priority: number;
    }

    /**
     * Configuration provided to SDK core
     */
    interface ITelemetryPluginChain {
        /**
         * Returns the underlying plugin that is being proxied for the processTelemetry call
         */
        getPlugin: () => ITelemetryPlugin;
        /**
         * Returns the next plugin
         */
        getNext: () => ITelemetryPluginChain;
        /**
         * Call back for telemetry processing before it it is sent
         * @param env - This is the current event being reported
         * @param itemCtx - This is the context for the current request, ITelemetryPlugin instances
         * can optionally use this to access the current core instance or define / pass additional information
         * to later plugins (vs appending items to the telemetry item)
         */
        processTelemetry: (env: ITelemetryItem, itemCtx: IProcessTelemetryContext) => void;
    }

    interface ITelemetryTrace {
        /**
         * Trace id
         */
        traceID?: string;
        /**
         * Parent id
         */
        parentID?: string;
        /**
         * Trace state
         */
        traceState?: ITraceState;
        /**
         * Name
         */
        name?: string;
    }

    interface ITraceState {
    }

    interface ITraceTelemetry extends IPartC {
        /**
         * @description A message string
         * @type {string}
         * @memberof ITraceTelemetry
         */
        message: string;
        /**
         * @description Severity level of the logging message used for filtering in the portal
         * @type {SeverityLevel}
         * @memberof ITraceTelemetry
         */
        severityLevel?: SeverityLevel;
        /**
         * @description custom defiend iKey
         * @type {SeverityLevel}
         * @memberof ITraceTelemetry
         */
        iKey?: string;
    }

    interface IUrlHelper {
        parseUrl: (url: string) => HTMLAnchorElement;
        getAbsoluteUrl: (url: string) => string;
        getPathName: (url: string) => string;
        getCompleteUrl: (method: string, absoluteUrl: string) => string;
        parseHost: (url: string, inclPort?: boolean) => string;
        /**
         * Get the full host from the url, optionally including the port
         */
        parseFullHost: (url: string, inclPort?: boolean) => string;
    }

    interface IUser {
        /**
         * The telemetry configuration.
         */
        config: any;
        /**
         * The user ID.
         */
        id: string;
        /**
         * Authenticated user id
         */
        authenticatedId: string;
        /**
         * The account ID.
         */
        accountId: string;
        /**
         * The account acquisition date.
         */
        accountAcquisitionDate: string;
        /**
         * The localId
         */
        localId: string;
        /**
         * A flag indicating whether this represents a new user
         */
        isNewUser?: boolean;
        /**
         * A flag indicating whether the user cookie has been set
         */
        isUserCookieSet?: boolean;
    }

    interface IUserContext extends IUser {
        setAuthenticatedUserContext(authenticatedUserId: string, accountId?: string, storeInCookie?: boolean): void;
        clearAuthenticatedUserContext(): void;
        update(userId?: string): void;
    }

    interface IUtil {
        NotSpecified: string;
        createDomEvent: (eventName: string) => Event;
        disableStorage: () => void;
        /**
         *  Checks if endpoint URL is application insights internal injestion service URL.
         *
         *  @param endpointUrl Endpoint URL to check.
         *  @returns {boolean} True if if endpoint URL is application insights internal injestion service URL.
         */
        isInternalApplicationInsightsEndpoint: (endpointUrl: string) => boolean;
        /**
         *  Check if the browser supports local storage.
         *
         *  @returns {boolean} True if local storage is supported.
         */
        canUseLocalStorage: () => boolean;
        /**
         *  Get an object from the browser's local storage
         *
         *  @param {string} name - the name of the object to get from storage
         *  @returns {string} The contents of the storage object with the given name. Null if storage is not supported.
         */
        getStorage: (logger: IDiagnosticLogger, name: string) => string;
        /**
         *  Set the contents of an object in the browser's local storage
         *
         *  @param {string} name - the name of the object to set in storage
         *  @param {string} data - the contents of the object to set in storage
         *  @returns {boolean} True if the storage object could be written.
         */
        setStorage: (logger: IDiagnosticLogger, name: string, data: string) => boolean;
        /**
         *  Remove an object from the browser's local storage
         *
         *  @param {string} name - the name of the object to remove from storage
         *  @returns {boolean} True if the storage object could be removed.
         */
        removeStorage: (logger: IDiagnosticLogger, name: string) => boolean;
        /**
         *  Check if the browser supports session storage.
         *
         *  @returns {boolean} True if session storage is supported.
         */
        canUseSessionStorage: () => boolean;
        /**
         *  Gets the list of session storage keys
         *
         *  @returns {string[]} List of session storage keys
         */
        getSessionStorageKeys: () => string[];
        /**
         *  Get an object from the browser's session storage
         *
         *  @param {string} name - the name of the object to get from storage
         *  @returns {string} The contents of the storage object with the given name. Null if storage is not supported.
         */
        getSessionStorage: (logger: IDiagnosticLogger, name: string) => string;
        /**
         *  Set the contents of an object in the browser's session storage
         *
         *  @param {string} name - the name of the object to set in storage
         *  @param {string} data - the contents of the object to set in storage
         *  @returns {boolean} True if the storage object could be written.
         */
        setSessionStorage: (logger: IDiagnosticLogger, name: string, data: string) => boolean;
        /**
         *  Remove an object from the browser's session storage
         *
         *  @param {string} name - the name of the object to remove from storage
         *  @returns {boolean} True if the storage object could be removed.
         */
        removeSessionStorage: (logger: IDiagnosticLogger, name: string) => boolean;
        /**
         * @deprecated - Use the core.getCookieMgr().disable()
         * Force the SDK not to store and read any data from cookies.
         */
        disableCookies: () => void;
        /**
         * @deprecated - Use the core.getCookieMgr().isEnabled()
         * Helper method to tell if document.cookie object is available and whether it can be used.
         */
        canUseCookies: (logger: IDiagnosticLogger) => any;
        disallowsSameSiteNone: (userAgent: string) => boolean;
        /**
         * @deprecated - Use the core.getCookieMgr().set()
         * helper method to set userId and sessionId cookie
         */
        setCookie: (logger: IDiagnosticLogger, name: string, value: string, domain?: string) => void;
        stringToBoolOrDefault: (str: any, defaultValue?: boolean) => boolean;
        /**
         * @deprecated - Use the core.getCookieMgr().get()
         * helper method to access userId and sessionId cookie
         */
        getCookie: (logger: IDiagnosticLogger, name: string) => string;
        /**
         * @deprecated - Use the core.getCookieMgr().del()
         * Deletes a cookie by setting it's expiration time in the past.
         * @param name - The name of the cookie to delete.
         */
        deleteCookie: (logger: IDiagnosticLogger, name: string) => void;
        /**
         * helper method to trim strings (IE8 does not implement String.prototype.trim)
         */
        trim: (str: any) => string;
        /**
         * generate random id string
         */
        newId: () => string;
        /**
         * generate a random 32bit number (-0x80000000..0x7FFFFFFF).
         */
        random32: () => number;
        /**
         * generate W3C trace id
         */
        generateW3CId: () => string;
        /**
         * Check if an object is of type Array
         */
        isArray: (obj: any) => boolean;
        /**
         * Check if an object is of type Error
         */
        isError: (obj: any) => obj is Error;
        /**
         * Check if an object is of type Date
         */
        isDate: (obj: any) => obj is Date;
        toISOStringForIE8: (date: Date) => string;
        /**
         * Gets IE version returning the document emulation mode if we are running on IE, or null otherwise
         */
        getIEVersion: (userAgentStr?: string) => number;
        /**
         * Convert ms to c# time span format
         */
        msToTimeSpan: (totalms: number) => string;
        /**
         * Checks if error has no meaningful data inside. Ususally such errors are received by window.onerror when error
         * happens in a script from other domain (cross origin, CORS).
         */
        isCrossOriginError: (message: string | Event, url: string, lineNumber: number, columnNumber: number, error: Error) => boolean;
        /**
         * Returns string representation of an object suitable for diagnostics logging.
         */
        dump: (object: any) => string;
        /**
         * Returns the name of object if it's an Error. Otherwise, returns empty string.
         */
        getExceptionName: (object: any) => string;
        /**
         * Adds an event handler for the specified event to the window
         * @param eventName {string} - The name of the event
         * @param callback {any} - The callback function that needs to be executed for the given event
         * @return {boolean} - true if the handler was successfully added
         */
        addEventHandler: (obj: any, eventNameWithoutOn: string, handlerRef: any, useCapture: boolean) => boolean;
        /**
         * Tells if a browser supports a Beacon API
         */
        IsBeaconApiSupported: () => boolean;
        getExtension: (extensions: IPlugin[], identifier: string) => IPlugin | null;
    }

    interface IWeb {
        /**
         * Browser name, set at ingestion
         */
        browser: string;
        /**
         * Browser ver, set at ingestion.
         */
        browserVer: string;
        /**
         * Language
         */
        browserLang: string;
        /**
         * User consent, populated to properties bag
         */
        userConsent: boolean;
        /**
         * Whether event was fired manually, populated to properties bag
         */
        isManual: boolean;
        /**
         * Screen resolution, populated to properties bag
         */
        screenRes: string;
        /**
         * Current domain. Leverages Window.location.hostname. populated to properties bag
         */
        domain: string;
    }

    enum LoggingSeverity {
        /**
         * Error will be sent as internal telemetry
         */
        CRITICAL = 1,
        /**
         * Error will NOT be sent as internal telemetry, and will only be shown in browser console
         */
        WARNING = 2
    }

    /**
     * Instances of Message represent printf-like trace statements that are text-searched. Log4Net, NLog and other text-based log file entries are translated into intances of this type. The message does not have measurements.
     */
    class MessageData implements Domain {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Trace message
         */
        message: string;
        /**
         * Trace severity level.
         */
        severityLevel: SeverityLevel;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    class Metric extends MetricData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            ver: FieldType;
            metrics: FieldType;
            properties: FieldType;
        };
        /**
         * Constructs a new instance of the MetricTelemetry object
         */
        constructor(logger: IDiagnosticLogger, name: string, value: number, count?: number, min?: number, max?: number, stdDev?: number, properties?: any, measurements?: {
            [key: string]: number;
        });
    }

    /**
     * An instance of the Metric item is a list of measurements (single data points) and/or aggregations.
     */
    class MetricData implements Domain {
        /**
         * Schema version
         */
        ver: number;
        /**
         * List of metrics. Only one metric in the list is currently supported by Application Insights storage. If multiple data points were sent only the first one will be used.
         */
        metrics: DataPoint[];
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    /**
     * Class to manage sending notifications to all the listeners.
     */
    class NotificationManager implements INotificationManager {
        listeners: INotificationListener[];
        constructor(config?: IConfiguration);
        /**
         * Adds a notification listener.
         * @param {INotificationListener} listener - The notification listener to be added.
         */
        addNotificationListener(listener: INotificationListener): void;
        /**
         * Removes all instances of the listener.
         * @param {INotificationListener} listener - AWTNotificationListener to remove.
         */
        removeNotificationListener(listener: INotificationListener): void;
        /**
         * Notification for events sent.
         * @param {ITelemetryItem[]} events - The array of events that have been sent.
         */
        eventsSent(events: ITelemetryItem[]): void;
        /**
         * Notification for events being discarded.
         * @param {ITelemetryItem[]} events - The array of events that have been discarded by the SDK.
         * @param {number} reason           - The reason for which the SDK discarded the events. The EventsDiscardedReason
         * constant should be used to check the different values.
         */
        eventsDiscarded(events: ITelemetryItem[], reason: number): void;
        /**
         * [Optional] A function called when the events have been requested to be sent to the sever.
         * @param {number} sendReason - The reason why the event batch is being sent.
         * @param {boolean} isAsync   - A flag which identifies whether the requests are being sent in an async or sync manner.
         */
        eventsSendRequest?(sendReason: number, isAsync: boolean): void;
        /**
         * [Optional] This event is sent if you have enabled perf events, they are primarily used to track internal performance testing and debugging
         * the event can be displayed via the debug plugin extension.
         * @param perfEvent
         */
        perfEvent?(perfEvent: IPerfEvent): void;
    }

    class PageView extends PageViewData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            ver: FieldType;
            name: FieldType;
            url: FieldType;
            duration: FieldType;
            properties: FieldType;
            measurements: FieldType;
            id: FieldType;
        };
        /**
         * Constructs a new instance of the PageEventTelemetry object
         */
        constructor(logger: IDiagnosticLogger, name?: string, url?: string, durationMs?: number, properties?: {
            [key: string]: string;
        }, measurements?: {
            [key: string]: number;
        }, id?: string);
    }

    /**
     * An instance of PageView represents a generic action on a page like a button click. It is also the base type for PageView.
     */
    class PageViewData extends EventData {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Request URL with all query string parameters
         */
        url: string;
        /**
         * Event name. Keep it low cardinality to allow proper grouping and useful metrics.
         */
        name: string;
        /**
         * Request duration in format: DD.HH:MM:SS.MMMMMM. For a page view (PageViewData), this is the duration. For a page view with performance information (PageViewPerfData), this is the page load time. Must be less than 1000 days.
         */
        duration: string;
        /**
         * Identifier of a page view instance. Used for correlation between page view and other telemetry items.
         */
        id: string;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    /**
     * Class encapsulates sending page views and page view performance telemetry.
     */
    class PageViewManager {
        constructor(appInsights: IAppInsightsInternal, overridePageViewDuration: boolean, core: IAppInsightsCore, pageViewPerformanceManager: PageViewPerformanceManager);
        /**
         * Currently supported cases:
         * 1) (default case) track page view called with default parameters, overridePageViewDuration = false. Page view is sent with page view performance when navigation timing data is available.
         *    a. If navigation timing is not supported then page view is sent right away with undefined duration. Page view performance is not sent.
         * 2) overridePageViewDuration = true, custom duration provided. Custom duration is used, page view sends right away.
         * 3) overridePageViewDuration = true, custom duration NOT provided. Page view is sent right away, duration is time spent from page load till now (or undefined if navigation timing is not supported).
         * 4) overridePageViewDuration = false, custom duration is provided. Page view is sent right away with custom duration.
         *
         * In all cases page view performance is sent once (only for the 1st call of trackPageView), or not sent if navigation timing is not supported.
         */
        trackPageView(pageView: IPageViewTelemetry, customProperties?: {
            [key: string]: any;
        }): void;
    }

    /**
     * An instance of PageViewPerf represents: a page view with no performance data, a page view with performance data, or just the performance data of an earlier page request.
     */
    class PageViewPerfData extends PageViewData {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Request URL with all query string parameters
         */
        url: string;
        /**
         * Performance total in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        perfTotal: string;
        /**
         * Event name. Keep it low cardinality to allow proper grouping and useful metrics.
         */
        name: string;
        /**
         * Request duration in format: DD.HH:MM:SS.MMMMMM. For a page view (PageViewData), this is the duration. For a page view with performance information (PageViewPerfData), this is the page load time. Must be less than 1000 days.
         */
        duration: string;
        /**
         * Network connection time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        networkConnect: string;
        /**
         * Sent request time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        sentRequest: string;
        /**
         * Received response time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        receivedResponse: string;
        /**
         * DOM processing time in TimeSpan 'G' (general long) format: d:hh:mm:ss.fffffff
         */
        domProcessing: string;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    class PageViewPerformance extends PageViewPerfData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            ver: FieldType;
            name: FieldType;
            url: FieldType;
            duration: FieldType;
            perfTotal: FieldType;
            networkConnect: FieldType;
            sentRequest: FieldType;
            receivedResponse: FieldType;
            domProcessing: FieldType;
            properties: FieldType;
            measurements: FieldType;
        };
        /**
         * Constructs a new instance of the PageEventTelemetry object
         */
        constructor(logger: IDiagnosticLogger, name: string, url: string, unused: number, properties?: {
            [key: string]: string;
        }, measurements?: {
            [key: string]: number;
        }, cs4BaseData?: IPageViewPerformanceTelemetry);
    }

    /**
     * Class encapsulates sending page view performance telemetry.
     */
    class PageViewPerformanceManager {
        private _logger;
        private MAX_DURATION_ALLOWED;
        constructor(core: IAppInsightsCore);
        populatePageViewPerformanceEvent(pageViewPerformance: IPageViewPerformanceTelemetryInternal): void;
        getPerformanceTiming(): PerformanceTiming | null;
        getPerformanceNavigationTiming(): PerformanceNavigationTiming | null;
        /**
         * Returns true is window PerformanceNavigationTiming API is supported, false otherwise.
         */
        isPerformanceNavigationTimingSupported(): boolean;
        /**
         * Returns true is window performance timing API is supported, false otherwise.
         */
        isPerformanceTimingSupported(): PerformanceTiming;
        /**
         * As page loads different parts of performance timing numbers get set. When all of them are set we can report it.
         * Returns true if ready, false otherwise.
         */
        isPerformanceTimingDataReady(): boolean;
        /**
         * This method tells if given durations should be excluded from collection.
         */
        shouldCollectDuration(...durations: number[]): boolean;
    }

    class PageVisitData {
        pageName: string;
        pageUrl: string;
        pageVisitStartTime: number;
        pageVisitTime: number;
        constructor(pageName: string, pageUrl: string);
    }

    /**
     * Used to track page visit durations
     */
    class PageVisitTimeManager {
        private prevPageVisitDataKeyName;
        private pageVisitTimeTrackingHandler;
        private _logger;
        /**
         * Creates a new instance of PageVisitTimeManager
         * @param pageVisitTimeTrackingHandler Delegate that will be called to send telemetry data to AI (when trackPreviousPageVisit is called)
         * @returns {}
         */
        constructor(logger: IDiagnosticLogger, pageVisitTimeTrackingHandler: (pageName: string, pageUrl: string, pageVisitTime: number) => void);
        /**
         * Tracks the previous page visit time telemetry (if exists) and starts timing of new page visit time
         * @param currentPageName Name of page to begin timing for visit duration
         * @param currentPageUrl Url of page to begin timing for visit duration
         */
        trackPreviousPageVisit(currentPageName: string, currentPageUrl: string): void;
        /**
         * Stops timing of current page (if exists) and starts timing for duration of visit to pageName
         * @param pageName Name of page to begin timing visit duration
         * @returns {PageVisitData} Page visit data (including duration) of pageName from last call to start or restart, if exists. Null if not.
         */
        restartPageVisitTimer(pageName: string, pageUrl: string): PageVisitData;
        /**
         * Starts timing visit duration of pageName
         * @param pageName
         * @returns {}
         */
        startPageVisitTimer(pageName: string, pageUrl: string): void;
        /**
         * Stops timing of current page, if exists.
         * @returns {PageVisitData} Page visit data (including duration) of pageName from call to start, if exists. Null if not.
         */
        stopPageVisitTimer(): PageVisitData;
    }

    function parseConnectionString(connectionString?: string): ConnectionString;

    class PerfEvent implements IPerfEvent {
        static ParentContextKey: string;
        static ChildrenContextKey: string;
        /**
         * The name of the event
         */
        name: string;
        /**
         * The start time of the event in ms
         */
        start: number;
        /**
         * The payload (contents) of the perfEvent, may be null or only set after the event has completed depending on
         * the runtime environment.
         */
        payload: any;
        /**
         * Is this occurring from an asynchronous event
         */
        isAsync: boolean;
        /**
         * Identifies the total inclusive time spent for this event, including the time spent for child events,
         * this will be undefined until the event is completed
         */
        time?: number;
        /**
         * Identifies the exclusive time spent in for this event (not including child events),
         * this will be undefined until the event is completed.
         */
        exTime?: number;
        /**
         * Identifies whether this event is a child event of a parent
         */
        isChildEvt: () => boolean;
        getCtx?: (key: string) => any | null | undefined;
        setCtx?: (key: string, value: any) => void;
        complete: () => void;
        constructor(name: string, payloadDetails: () => any, isAsync: boolean);
    }

    class PerfManager implements IPerfManager {
        /**
         * General bucket used for execution context set and retrieved via setCtx() and getCtx.
         * Defined as private so it can be visualized via the DebugPlugin
         */
        private ctx;
        constructor(manager: INotificationManager);
        /**
         * Create a new event and start timing, the manager may return null/undefined to indicate that it does not
         * want to monitor this source event.
         * @param src The source name of the event
         * @param payloadDetails - An optional callback function to fetch the payload details for the event.
         * @param isAsync - Is the event occurring from a async event
         */
        create(src: string, payload?: any, isAsync?: boolean): IPerfEvent | null | undefined;
        /**
         * Complete the perfEvent and fire any notifications.
         * @param perfEvent Fire the event which will also complete the passed event
         */
        fire(perfEvent: IPerfEvent): void;
        /**
         * Set an execution context value
         * @param key - The context key name
         * @param value - The value
         */
        setCtx(key: string, value: any): void;
        /**
         * Get the execution context value
         * @param key - The context key
         */
        getCtx(key: string): any;
    }

    class PropertiesPlugin extends BaseTelemetryPlugin implements IPropertiesPlugin {
        static getDefaultConfig(): ITelemetryConfig;
        context: IPropTelemetryContext;
        priority: number;
        identifier: string;
        constructor();
        initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
        /**
         * Add Part A fields to the event
         * @param event The event that needs to be processed
         */
        processTelemetry(event: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
    }

    class RemoteDependencyData extends RemoteDependencyData_2 implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            id: FieldType;
            ver: FieldType;
            name: FieldType;
            resultCode: FieldType;
            duration: FieldType;
            success: FieldType;
            data: FieldType;
            target: FieldType;
            type: FieldType;
            properties: FieldType;
            measurements: FieldType;
            kind: FieldType;
            value: FieldType;
            count: FieldType;
            min: FieldType;
            max: FieldType;
            stdDev: FieldType;
            dependencyKind: FieldType;
            dependencySource: FieldType;
            commandName: FieldType;
            dependencyTypeName: FieldType;
        };
        /**
         * Constructs a new instance of the RemoteDependencyData object
         */
        constructor(logger: IDiagnosticLogger, id: string, absoluteUrl: string, commandName: string, value: number, success: boolean, resultCode: number, method?: string, requestAPI?: string, correlationContext?: string, properties?: Object, measurements?: Object);
    }

    /**
     * An instance of Remote Dependency represents an interaction of the monitored component with a remote component/service like SQL or an HTTP endpoint.
     */
    class RemoteDependencyData_2 implements Domain {
        /**
         * Schema version
         */
        ver: number;
        /**
         * Name of the command initiated with this dependency call. Low cardinality value. Examples are stored procedure name and URL path template.
         */
        name: string;
        /**
         * Identifier of a dependency call instance. Used for correlation with the request telemetry item corresponding to this dependency call.
         */
        id: string;
        /**
         * Result code of a dependency call. Examples are SQL error code and HTTP status code.
         */
        resultCode: string;
        /**
         * Request duration in format: DD.HH:MM:SS.MMMMMM. Must be less than 1000 days.
         */
        duration: string;
        /**
         * Indication of successful or unsuccessful call.
         */
        success: boolean;
        /**
         * Command initiated by this dependency call. Examples are SQL statement and HTTP URL's with all query parameters.
         */
        data: string;
        /**
         * Target site of a dependency call. Examples are server name, host address.
         */
        target: string;
        /**
         * Dependency type name. Very low cardinality value for logical grouping of dependencies and interpretation of other fields like commandName and resultCode. Examples are SQL, Azure table, and HTTP.
         */
        type: string;
        /**
         * Collection of custom properties.
         */
        properties: any;
        /**
         * Collection of custom measurements.
         */
        measurements: any;
        constructor();
    }

    class Sender extends BaseTelemetryPlugin implements IChannelControlsAI {
        static constructEnvelope(orig: ITelemetryItem, iKey: string, logger: IDiagnosticLogger, convertUndefined?: any): IEnvelope;
        readonly priority: number;
        readonly identifier: string;
        /**
         * The configuration for this sender instance
         */
        readonly _senderConfig: ISenderConfig;
        /**
         * A method which will cause data to be send to the url
         */
        _sender: SenderFunction;
        /**
         * A send buffer object
         */
        _buffer: ISendBuffer;
        /**
         * AppId of this component parsed from some backend response.
         */
        _appId: string;
        protected _sample: ISample;
        constructor();
        /**
         * Pause the sending (transmission) of events, this will cause all events to be batched only until the maximum limits are
         * hit at which point new events are dropped. Will also cause events to NOT be sent during page unload, so if Session storage
         * is disabled events will be lost.
         * SessionStorage Limit is 2000 events, In-Memory (Array) Storage is 10,000 events (can be configured via the eventsLimitInMem).
         */
        pause(): void;
        /**
         * Resume the sending (transmission) of events, this will restart the timer and any batched events will be sent using the normal
         * send interval.
         */
        resume(): void;
        /**
         * Flush the batched events immediately (not synchronously).
         * Will not flush if the Sender has been paused.
         */
        flush(): void;
        /**
         * Flush the batched events synchronously (if possible -- based on configuration).
         * Will not flush if the Send has been paused.
         */
        onunloadFlush(): void;
        teardown(): void;
        initialize(config: IConfiguration & IConfig, core: IAppInsightsCore, extensions: IPlugin[], pluginChain?: ITelemetryPluginChain): void;
        processTelemetry(telemetryItem: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
        /**
         * xhr state changes
         */
        _xhrReadyStateChange(xhr: XMLHttpRequest, payload: string[], countOfItemsInPayload: number): void;
        /**
         * Immediately send buffered data
         * @param async {boolean} - Indicates if the events should be sent asynchronously
         * @param forcedSender {SenderFunction} - Indicates the forcedSender, undefined if not passed
         */
        triggerSend(async?: boolean, forcedSender?: SenderFunction, sendReason?: SendRequestReason): void;
        /**
         * error handler
         */
        _onError(payload: string[], message: string, event?: ErrorEvent): void;
        /**
         * partial success handler
         */
        _onPartialSuccess(payload: string[], results: IBackendResponse): void;
        /**
         * success handler
         */
        _onSuccess(payload: string[], countOfItemsInPayload: number): void;
        /**
         * xdr state changes
         */
        _xdrOnLoad(xdr: XDomainRequest, payload: string[]): void;
        /**
         * Add header to request
         * @param name   - Header name.
         * @param value  - Header value.
         */
        addHeader(name: string, value: string): void;
    }

    type SenderFunction = (payload: string[], isAsync: boolean) => void;

    /**
     * The EventsDiscardedReason enumeration contains a set of values that specify the reason for discarding an event.
     */
    const enum SendRequestReason {
        /**
         * No specific reason was specified
         */
        Undefined = 0,
        /**
         * Events are being sent based on the normal event schedule / timer.
         */
        NormalSchedule = 1,
        /**
         * A manual flush request was received
         */
        ManualFlush = 1,
        /**
         * Unload event is being processed
         */
        Unload = 2,
        /**
         * The event(s) being sent are sync events
         */
        SyncEvent = 3,
        /**
         * The Channel was resumed
         */
        Resumed = 4,
        /**
         * The event(s) being sent as a retry
         */
        Retry = 5,
        /**
         * Maximum batch size would be exceeded
         */
        MaxBatchSize = 10,
        /**
         * The Maximum number of events have already been queued
         */
        MaxQueuedEvents = 20
    }

    class Session implements ISession {
        /**
         * The session ID.
         */
        id?: string;
        /**
         * The date at which this guid was generated.
         * Per the spec the ID will be regenerated if more than acquisitionSpan milliseconds elapsed from this time.
         */
        acquisitionDate?: number;
        /**
         * The date at which this session ID was last reported.
         * This value should be updated whenever telemetry is sent using this ID.
         * Per the spec the ID will be regenerated if more than renewalSpan milliseconds elapse from this time with no activity.
         */
        renewalDate?: number;
    }

    class _SessionManager {
        static acquisitionSpan: number;
        static renewalSpan: number;
        static cookieUpdateInterval: number;
        automaticSession: Session;
        config: ISessionConfig;
        constructor(config: ISessionConfig, core?: IAppInsightsCore);
        update(): void;
        /**
         *  Record the current state of the automatic session and store it in our cookie string format
         *  into the browser's local storage. This is used to restore the session data when the cookie
         *  expires.
         */
        backup(): void;
    }

    /**
     * Defines the level of severity for the event.
     */
    enum SeverityLevel {
        Verbose = 0,
        Information = 1,
        Warning = 2,
        Error = 3,
        Critical = 4
    }

    /**
     *
     * @export
     * @interface Snippet
     */
    interface Snippet {
        config: IConfiguration & IConfig;
        queue?: Array<() => void>;
        sv?: string;
        version?: number;
    }

    /**
     * Stack frame information.
     */
    class StackFrame {
        /**
         * Level in the call stack. For the long stacks SDK may not report every function in a call stack.
         */
        level: number;
        /**
         * Method name.
         */
        method: string;
        /**
         * Name of the assembly (dll, jar, etc.) containing this function.
         */
        assembly: string;
        /**
         * File name or URL of the method implementation.
         */
        fileName: string;
        /**
         * Line number of the code implementation.
         */
        line: number;
    }

    interface Tags {
        [key: string]: any;
    }

    /**
     * Telemetry type classes, e.g. PageView, Exception, etc
     */
    const Telemetry: {
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
        AIData: typeof Data;
        AIBase: typeof Base;
        Envelope: typeof Envelope;
        Event: typeof Event_2;
        Exception: typeof Exception;
        Metric: typeof Metric;
        PageView: typeof PageView;
        PageViewData: typeof PageViewData;
        RemoteDependencyData: typeof RemoteDependencyData;
        Trace: typeof Trace;
        PageViewPerformance: typeof PageViewPerformance;
        Data: typeof Data_2;
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

    class TelemetryItemCreator {
        /**
         * Create a telemetry item that the 1DS channel understands
         * @param item domain specific properties; part B
         * @param baseType telemetry item type. ie PageViewData
         * @param envelopeName name of the envelope. ie Microsoft.ApplicationInsights.<instrumentation key>.PageView
         * @param customProperties user defined custom properties; part C
         * @param systemProperties system properties that are added to the context; part A
         * @returns ITelemetryItem that is sent to channel
         */
        static create<T>(item: T, baseType: string, envelopeName: string, logger: IDiagnosticLogger, customProperties?: {
            [key: string]: any;
        }, systemProperties?: {
            [key: string]: any;
        }): ITelemetryItem;
    }

    class Trace extends MessageData implements ISerializable {
        static envelopeType: string;
        static dataType: string;
        aiDataContract: {
            ver: FieldType;
            message: FieldType;
            severityLevel: FieldType;
            properties: FieldType;
        };
        /**
         * Constructs a new instance of the TraceTelemetry object
         */
        constructor(logger: IDiagnosticLogger, message: string, severityLevel?: SeverityLevel, properties?: any, measurements?: {
            [key: string]: number;
        });
    }

    const Util: IUtil;

    interface XDomainRequest extends XMLHttpRequestEventTarget {
        readonly responseText: string;
        send(payload: string): void;
        open(method: string, url: string): void;
    }

    class XHRMonitoringState {
        openDone: boolean;
        setRequestHeaderDone: boolean;
        sendDone: boolean;
        abortDone: boolean;
        stateChangeAttached: boolean;
        constructor();
    }

    interface XMLHttpRequestInstrumented extends XMLHttpRequest {
        ajaxData: ajaxRecord;
    }

    
}
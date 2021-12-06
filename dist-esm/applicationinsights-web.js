/*
 * Application Insights JavaScript SDK - Web, 2.7.1
 * Copyright (c) Microsoft and contributors. All rights reserved.
 */
export { Initialization as ApplicationInsights, Telemetry } from "./Initialization";
export { ApplicationInsightsContainer } from "./ApplicationInsightsContainer";
// Re-exports
export { AppInsightsCore, LoggingSeverity, _InternalMessageId, PerfEvent, PerfManager, doPerf, NotificationManager, BaseTelemetryPlugin, BaseCore, CoreUtils } from "@microsoft/applicationinsights-core-js";
export { Util, SeverityLevel, Event, Exception, Metric, PageView, PageViewPerformance, RemoteDependencyData, Trace, DistributedTracingModes } from "@microsoft/applicationinsights-common";
export { Sender } from "@microsoft/applicationinsights-channel-js";
export { ApplicationInsights as ApplicationAnalytics } from "@microsoft/applicationinsights-analytics-js";
export { PropertiesPlugin } from "@microsoft/applicationinsights-properties-js";
export { AjaxPlugin as DependenciesPlugin } from "@microsoft/applicationinsights-dependencies-js";
//# sourceMappingURL=applicationinsights-web.js.map
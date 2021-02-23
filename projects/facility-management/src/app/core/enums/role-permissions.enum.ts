/**
 * This enum is use to define client property.
 */
export enum SuperManager {
    view = 'SUPERMANAGER_VIEW',
}

/**
 * This enum is use to define client property.
 */
export enum Client {
    view = 'CLIENT_VIEW',
    add = 'CLIENT_ADD',
    update = 'CLIENT_UPDATE',
    updateLicensing = 'CLIENT_LICENSING',
    delete = 'CLIENT_DELETE',
    changeStatus = 'CLIENT_CHANGE_STATUS',
    configuration = 'CLIENT_CONFIGURATION'
}

/**
 * This enum is use to define copyit property.
 */
export enum CopyIt {
    view = 'COPYIT_VIEW',
    print = 'COPYIT_PRINT',
    exportPdf = 'COPYIT_EXPORT_PDF',
    add = 'COPYIT_ADD',
    update = 'COPYIT_UPDATE',
    delete = 'COPYIT_DELETE',
    priority = 'COPYIT_PRIORITY',
    distribution = 'COPYIT_DISTRIBUTION',
    shippingMethod = 'COPYIT_SHIPPING_METHOD',
    envelopeQTY = 'COPYIT_ENVELOPE_QTY',
    changeStatus = 'COPYIT_CHANGE_STATUS',
    changeAssignTo = 'COPYIT_CHANGE_ASSIGN_TO',
    pickAsset = 'COPYIT_PICK_ASSET',
    copyCenter = 'COPYIT_COPY_CENTER'
}

/**
 * This enum is use to define copyit property.
 */
export enum BookIt {
    view = 'BOOKIT_VIEW',
    print = 'BOOKIT_PRINT',
    exportPdf = 'BOOKIT_EXPORT_PDF',
    add = 'BOOKIT_ADD',
    update = 'BOOKIT_UPDATE',
    delete = 'BOOKIT_DELETE',
    changeStatus = 'BOOKIT_CHANGE_STATUS',
    changeAssignTo = 'BOOKIT_CHANGE_ASSIGN_TO',
}

/**
 * This enum is use to define client property.
 */
export enum User {
    view = 'USER_VIEW',
    add = 'USER_ADD',
    update = 'USER_UPDATE',
    delete = 'USER_DELETE',
    changeStatus = 'USER_CHANGE_STATUS',
    bulkUpload = 'USER_BULK_UPLOAD',
    changePassword = 'USER_CHANGE_PASSWORD'
}

/**
 * This enum is use to define Offices property.
 */
export enum Office {
    view = 'OFFICE_VIEW',
    add = 'OFFICE_ADD',
    update = 'OFFICE_UPDATE',
    delete = 'OFFICE_DELETE',
    changeStatus = 'OFFICE_CHANGE_STATUS',
}

/**
 * This enum is use to define Floors property.
 */
export enum Floor {
    view = 'FLOOR_VIEW',
    add = 'FLOOR_ADD',
    update = 'FLOOR_UPDATE',
    delete = 'FLOOR_DELETE',
    changeStatus = 'FLOOR_CHANGE_STATUS',
}

/**
 * This enum is use to define FloorsRooms property.
 */
export enum FloorsRoom {
    view = 'FLOOR_ROOM_VIEW',
    add = 'FLOOR_ROOM_ADD',
    update = 'FLOOR_ROOM_UPDATE',
    delete = 'FLOOR_ROOM_DELETE'
}

/**
 * This enum is use to define MailConfigurations property.
 */
export enum MailConfiguration {
    view = 'MAIL_CONFIGURATION_VIEW'
}

/**
 * This enum is use to define Slots property.
 */
export enum Slot {
    view = 'SLOT_VIEW',
    add = 'SLOT_ADD',
    update = 'SLOT_UPDATE',
    delete = 'SLOT_DELETE'
}

/**
 * This enum is use to define Slots property.
 */
export enum Reason {
    view = 'REASON_VIEW',
    add = 'REASON_ADD',
    update = 'REASON_UPDATE',
    delete = 'REASON_DELETE'
}

/**
 * This enum is use to define WorkFlowConfigurations property.
 */
export enum WorkFlowConfiguration {
    view = 'WORKFLOW_CONFIGURATION_VIEW',
    add = 'WORKFLOW_CONFIGURATION_ADD',
    update = 'WORKFLOW_CONFIGURATION_UPDATE',
    delete = 'WORKFLOW_CONFIGURATION_DELETE',
    changeStatus = 'WORKFLOW_CONFIGURATION_CHANGE_STATUS',
    copy = 'WORKFLOW_CONFIGURATION_COPY',
    viewReason = 'WORKFLOW_CONFIGURATION_VIEW_REASON',
    addReason = 'WORKFLOW_CONFIGURATION_ADD_REASON',
    updateReason = 'WORKFLOW_CONFIGURATION_UPDATE_REASON',
    deleteReason = 'WORKFLOW_CONFIGURATION_DELETE_REASON'
}

/**
 * This enum is use to define Tasks property.
 */
export enum Task {
    view = 'TASK_VIEW',
    add = 'TASK_ADD',
    update = 'TASK_UPDATE',
    delete = 'TASK_DELETE',
    updateSequence = 'TASK_UPDATE_SEQUENCE'
}

/**
 * This enum is use to define Reports copyit property.
 */
export enum ReportsCopyIt {
    view = 'REPORT_COPYIT_VIEW',
    timelinessView = 'TIMELINESS_VIEW',
    timelinessExportPdf = 'TIMELINESS_EXPORT_PDF',
    copyCenterImpColorView = 'COPY_CENTER_IMP',
    copyCenterImpColorExportPdf = 'COPY_CENTER_IMP_EXPORT_PDF',
    copyCenterImpBlackAndWhiteView = 'COPY_CENTER_IMP',
    copyCenterImpBlackAndWhiteExportPdf = 'COPY_CENTER_IMP_EXPORT_PDF',
    copyCenterImpScanView = 'COPY_CENTER_IMP',
    copyCenterImpScanExportPdf = 'COPY_CENTER_IMP_EXPORT_PDF',
    totalCopyVolumeView = 'TOTAL_COPY_VOLUME_VIEW',
    totalCopyVolumeExportPdf = 'TOTAL_COPY_VOLUME_EXPORT_PDF',
    totalCopyJobsView = 'TOTAL_COPY_JOBS_VIEW',
    totalCopyJobsExportPdf = 'TOTAL_COPY_JOBS_EXPORT_PDF',
    costRecoveryView = 'COST_RECOVERY_VIEW',
    costRecoveryExportExcel = 'COST_RECOVERY_EXPORT_EXCEL',
    chargebackView = 'CHARGEBACK_VIEW',
    chargebackExportExcel = 'CHARGEBACK_EXPORT_EXCEL'
}

/**
 * This enum is use to define Reports book it property.
 */
export enum ReportsBookIt {
    view = 'REPORT_BOOKIT_VIEW',
    facilityHelpDeskView = 'FACILITY_HELP_DESK_VIEW',
    facilityHelpDeskExportPdf = 'FACILITY_HELP_DESK_EXPORT_PDF',
    facilityAssistantsView = 'FACILITY_ASSISTANTS_VIEW',
    facilityAssistantsExportPdf = 'FACILITY_ASSISTANTS_EXPORT_PDF',
    calendarView = 'CALENDAR_VIEW',
    calendarPrint = 'CALENDAR_PRINT'
}

/**
 * This enum is use to define Reports fleet it property.
 */
export enum ReportsFleet {
    view = 'REPORT_FLEET_VIEW',
    summaryView = 'SUMMARY_VIEW',
    summaryExportExcel = 'SUMMARY_EXPORT_EXCEL',
    summaryExportPdf = 'SUMMARY_EXPORT_PDF'
}

/** Available roles for policy */
export enum PolicyRoles {
    superUser = 'SUPER_USER',
    manager = 'MANAGER',
    associate = 'ASSOCIATE',
    requestor = 'REQUESTOR'
}

/**
 * This enum is use to define VisitorLog property.
 */
export enum VisitorLog {
    viewVisitor = 'VISITOR_LOGS_VIEW',
    addVisitor = 'VISITOR_LOGS_ADD',
    updateVisitor = 'VISITOR_LOGS_UPDATE',
    deleteVisitor = 'VISITOR_LOGS_DELETE',
}

/** This enum is use to define Packages permissions */
export enum Packages {
    add = 'PACKAGE_ADD',
    update = 'PACKAGE_UPDATE',
    delete = 'PACKAGE_DELETE',
    webView = 'PACKAGE_WEB_VIEW',
}

/**
 * This enum is use to define copyit config options property. 
 */
export enum CopyItConfigurationOptions {
    view = 'COPYIT_VIEW_CONFIG_OPTIONS',
    change = 'COPYIT_CHANGE_CONFIG_OPTIONS'
}


/**
 * This enum is use to define copyit config default values property.
 */
export enum CopyItConfigurationDefaultValues {
    view = 'COPYIT_VIEW_DEFAULT_VALUES',
    change = 'COPYIT_CHANGE_DEFAULT_VALUES'
}

/**
 * This enum is use to define copyit manager account property.
 */
export enum CopyItManageAccount {
    view = 'COPYIT_VIEW_ACCOUNT_NO',
    add = 'COPYIT_ADD_ACCOUNT_NO',
    update = 'COPYIT_UPDATE_ACCOUNT_NO',
    delete = 'COPYIT_DELETE_ACCOUNT_NO'
}

/**
 * This enum is use to define fleet property.
 */
export enum Fleet {
    view = 'FLEET_VIEW',
    add = 'FLEET_ADD',
    update = 'FLEET_UPDATE',
    delete = 'FLEET_DELETE'
}

/**
 * This enum is use to define fleet add ticket property.
 */
export enum FleetAddTicket {
    view = 'FLEET_ADD_TICKET_VIEW',
    add = 'FLEET_ADD_TICKET_ADD',
    update = 'FLEET_ADD_TICKET_UPDATE'
}

/**
 * This enum is use to define fleet add ticket property.
 */
export enum FleetMeterReads {
    view = 'FLEET_METER_READS_VIEW',
    add = 'FLEET_METER_READS_ADD',
    print = 'FLEET_METER_READS_PRINT',
    exportAsPDF = 'FLEET_METER_READS_EXPORT_PDF',
    exportAsExcel = 'FLEET_METER_READS_EXPORT_EXCEL',
    delete = 'FLEET_METER_READS_DELETE_LATEST'
}

/**
 * Dashboard
 */
export enum Dashboard {
    summary = 'DASHBOARD_MODULE_SUMMARY',
    summaryFleet = 'DASHBOARD_MODULE_SUMMARY_FLEET',
    openRequests = 'DASHBOARD_OPEN_REQUESTS',
    clientStatusSummary = 'DASHBOARD_CLIENT_STATUS_SUMMARY',
    associateStatusSummary = 'DASHBOARD_ASSOCIATE_STATUS_SUMMARY',
    moduleChart = 'DASHBOARD_MODULE_CHART',
}

/** This enum is used to define permission of reports for Mail */
export enum ReportsMail {
    reportMailView = 'REPORT_MAIL_VIEW',
    reportMailExportExcel = 'REPORT_MAIL_EXPORT_EXCEL',
}

/** This enum is used to define permission of reports for Workflow */
export enum ReportsWorkflow {
    reportWorkflowView = 'REPORT_WORKFLOW_VIEW',
    reportWorkflowExportExcel = 'REPORT_WORKFLOW_EXPORT_EXCEL',
}

/** This enum is used to define permission of reports for Tasks */
export enum ReportsTask {
    reportTaskView = 'REPORT_TASK_VIEW',
    reportTaskExportExcel = 'REPORT_TASK_EXPORT_EXCEL',
}

/** This enum is used to define permission of reports for Tasks */
export enum ReportsMeterReads {
    reportMeterReadsView = 'REPORT_METER_READS_VIEW',
    reportMeterReadsExportExcel = 'REPORT_METER_READS_EXPORT_EXCEL',
}

// tslint:disable-next-line: typedef
export const Permission = {
    SuperManager,
    Client,
    CopyIt,
    BookIt,
    User,
    Office,
    Floor,
    FloorsRoom,
    MailConfiguration,
    Slot,
    Reason,
    WorkFlowConfiguration,
    Task,
    ReportsCopyIt,
    ReportsBookIt,
    ReportsFleet,
    ReportsMail,
    ReportsWorkflow,
    ReportsTask,
    ReportsMeterReads,
    VisitorLog,
    CopyItConfigurationOptions,
    CopyItConfigurationDefaultValues,
    CopyItManageAccount,
    Fleet,
    FleetAddTicket,
    FleetMeterReads,
    Dashboard,
    Packages,
}
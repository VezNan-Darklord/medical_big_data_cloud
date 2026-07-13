/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseHttpRequest } from './core/BaseHttpRequest';
import type { OpenAPIConfig } from './core/OpenAPI';
import { FetchHttpRequest } from './core/FetchHttpRequest';
import { AiAnalysisService } from './services/AiAnalysisService';
import { AssessmentReportService } from './services/AssessmentReportService';
import { AuthService } from './services/AuthService';
import { DashboardService } from './services/DashboardService';
import { DeviceService } from './services/DeviceService';
import { DoctorAccountService } from './services/DoctorAccountService';
import { ElderlyAccountService } from './services/ElderlyAccountService';
import { ElderlyProfileService } from './services/ElderlyProfileService';
import { HealthWarningService } from './services/HealthWarningService';
import { KeyPopulationService } from './services/KeyPopulationService';
import { ProfileService } from './services/ProfileService';
import { ReportStatisticsService } from './services/ReportStatisticsService';
import { UserAccountService } from './services/UserAccountService';
type HttpRequestConstructor = new (config: OpenAPIConfig) => BaseHttpRequest;
export class medical {
    public readonly aiAnalysis: AiAnalysisService;
    public readonly assessmentReport: AssessmentReportService;
    public readonly auth: AuthService;
    public readonly dashboard: DashboardService;
    public readonly device: DeviceService;
    public readonly doctorAccount: DoctorAccountService;
    public readonly elderlyAccount: ElderlyAccountService;
    public readonly elderlyProfile: ElderlyProfileService;
    public readonly healthWarning: HealthWarningService;
    public readonly keyPopulation: KeyPopulationService;
    public readonly profile: ProfileService;
    public readonly reportStatistics: ReportStatisticsService;
    public readonly userAccount: UserAccountService;
    public readonly request: BaseHttpRequest;
    constructor(config?: Partial<OpenAPIConfig>, HttpRequest: HttpRequestConstructor = FetchHttpRequest) {
        this.request = new HttpRequest({
            BASE: config?.BASE ?? 'http://localhost:8080/api/v1',
            VERSION: config?.VERSION ?? '1.0.0',
            WITH_CREDENTIALS: config?.WITH_CREDENTIALS ?? false,
            CREDENTIALS: config?.CREDENTIALS ?? 'include',
            TOKEN: config?.TOKEN,
            USERNAME: config?.USERNAME,
            PASSWORD: config?.PASSWORD,
            HEADERS: config?.HEADERS,
            ENCODE_PATH: config?.ENCODE_PATH,
        });
        this.aiAnalysis = new AiAnalysisService(this.request);
        this.assessmentReport = new AssessmentReportService(this.request);
        this.auth = new AuthService(this.request);
        this.dashboard = new DashboardService(this.request);
        this.device = new DeviceService(this.request);
        this.doctorAccount = new DoctorAccountService(this.request);
        this.elderlyAccount = new ElderlyAccountService(this.request);
        this.elderlyProfile = new ElderlyProfileService(this.request);
        this.healthWarning = new HealthWarningService(this.request);
        this.keyPopulation = new KeyPopulationService(this.request);
        this.profile = new ProfileService(this.request);
        this.reportStatistics = new ReportStatisticsService(this.request);
        this.userAccount = new UserAccountService(this.request);
    }
}


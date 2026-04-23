/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ReportTemplate } from '../models/ReportTemplate';
import type { StartGenerationResponse } from '../models/StartGenerationResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportTemplatesService {
    /**
     * Get all report templates
     * @returns ReportTemplate List of report templates
     * @throws ApiError
     */
    public static getApiReportTemplates(): CancelablePromise<Array<ReportTemplate>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report-templates',
        });
    }
    /**
     * Get report template by id
     * @param id
     * @returns ReportTemplate Report template
     * @throws ApiError
     */
    public static getApiReportTemplates1(
        id: string,
    ): CancelablePromise<ReportTemplate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/report-templates/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Template not found`,
            },
        });
    }
    /**
     * Start asynchronous report generation
     * @param id
     * @returns StartGenerationResponse Generation started
     * @throws ApiError
     */
    public static postApiReportTemplatesGenerate(
        id: string,
    ): CancelablePromise<StartGenerationResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/report-templates/{id}/generate',
            path: {
                'id': id,
            },
            errors: {
                404: `Template not found`,
            },
        });
    }
}

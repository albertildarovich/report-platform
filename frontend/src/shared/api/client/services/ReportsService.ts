/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaginatedReportsResponse } from '../models/PaginatedReportsResponse';
import type { Report } from '../models/Report';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReportsService {
    /**
     * Get report runs with pagination
     * @param page
     * @param limit
     * @returns PaginatedReportsResponse Paginated report runs
     * @throws ApiError
     */
    public static getApiReports(
        page: number = 1,
        limit: number = 10,
    ): CancelablePromise<PaginatedReportsResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reports',
            query: {
                'page': page,
                'limit': limit,
            },
        });
    }
    /**
     * Get report run status
     * @param id
     * @returns Report Report run
     * @throws ApiError
     */
    public static getApiReportsStatus(
        id: string,
    ): CancelablePromise<Report> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reports/{id}/status',
            path: {
                'id': id,
            },
            errors: {
                404: `Report not found`,
            },
        });
    }
    /**
     * Download generated report
     * @param id
     * @returns any Report file (PDF or XLSX)
     * @throws ApiError
     */
    public static getApiReportsDownload(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reports/{id}/download',
            path: {
                'id': id,
            },
            errors: {
                404: `Result not available`,
            },
        });
    }
}

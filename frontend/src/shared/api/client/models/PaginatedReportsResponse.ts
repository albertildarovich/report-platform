/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Report } from './Report';
export type PaginatedReportsResponse = {
    reports?: Array<Report>;
    pagination?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
};


/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RunStatus } from './RunStatus';
export type Report = {
    id?: string;
    reportTemplateId?: string;
    status?: RunStatus;
    startedAt?: string | null;
    completedAt?: string | null;
    error?: string | null;
    resultUrl?: string | null;
    createdAt?: string;
    updatedAt?: string;
};


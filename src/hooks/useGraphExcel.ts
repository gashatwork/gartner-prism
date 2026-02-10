import { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";
import * as XLSX from 'xlsx';
import type { UseCase } from '../data/types';

export const useGraphExcel = () => {
    const { instance, accounts } = useMsal();
    const [graphData, setGraphData] = useState<UseCase[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchExcelFile = async (siteId: string, itemId: string) => {
        setIsLoading(true);
        setError(null);

        const request = {
            ...loginRequest,
            account: accounts[0]
        };

        try {
            const response = await instance.acquireTokenSilent(request);
            const accessToken = response.accessToken;

            const graphEndpoint = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${itemId}/content`;

            const fileResponse = await fetch(graphEndpoint, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (!fileResponse.ok) {
                throw new Error(`Graph API Error: ${fileResponse.statusText}`);
            }

            const arrayBuffer = await fileResponse.arrayBuffer();
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });

            const sheetName = 'Sandbox';
            const sheet = workbook.Sheets[sheetName];

            if (!sheet) {
                throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
            }

            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[];
            const useCases: UseCase[] = [];

            // Parsing logic matches the extraction script
            for (let i = 3; i < json.length; i++) {
                const row = json[i];
                if (!row || row.length < 2) continue;

                const id = row[0];
                const name = row[1];

                if (!name || name === '0' || name === 0) continue;
                if (typeof row[2] !== 'number' || typeof row[3] !== 'number') continue;

                useCases.push({
                    id: String(id),
                    name: String(name),
                    feasibility: Number(row[2]),
                    businessValue: Number(row[3]),
                    translatedX: Number(row[8] ?? 0), // Default to 0 if null
                    translatedY: Number(row[9] ?? 0)
                });
            }

            setGraphData(useCases);

        } catch (e: any) {
            console.error(e);
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { fetchExcelFile, graphData, isLoading, error };
};

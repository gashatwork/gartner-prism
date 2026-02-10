import React, { useState } from 'react';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/authConfig";
import { useGraphExcel } from '../hooks/useGraphExcel';
import type { UseCase } from '../data/types';
import { Database, FileSpreadsheet, Loader2, Check } from 'lucide-react';

interface SharePointConnectProps {
    onDataLoaded: (data: UseCase[]) => void;
}

export const SharePointConnect: React.FC<SharePointConnectProps> = ({ onDataLoaded }) => {
    const { instance, accounts } = useMsal();
    const { fetchExcelFile, graphData, isLoading, error } = useGraphExcel();
    const [siteId, setSiteId] = useState('');
    const [driveItemId, setDriveItemId] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    const handleLogin = () => {
        instance.loginPopup(loginRequest).catch((e: unknown) => {
            console.error(e);
        });
    };

    const handleFetch = async () => {
        if (!siteId || !driveItemId) {
            alert("Please enter Site ID and Drive Item ID");
            return;
        }
        await fetchExcelFile(siteId, driveItemId);
    };

    // Propagate data to parent when loaded
    React.useEffect(() => {
        if (graphData) {
            onDataLoaded(graphData);
            setIsConnected(true);
        }
    }, [graphData, onDataLoaded]);

    const isAuthenticated = accounts.length > 0;

    return (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-200">
                    <Database size={20} className="text-blue-400" />
                    <h3 className="font-semibold">Data Source</h3>
                </div>
                {isAuthenticated ? (
                    <span className="text-xs text-green-400 font-mono bg-green-900/30 px-2 py-1 rounded border border-green-800">
                        {accounts[0].username}
                    </span>
                ) : (
                    <button
                        onClick={handleLogin}
                        className="text-sm bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors"
                    >
                        Sign in with Microsoft
                    </button>
                )}
            </div>

            {isAuthenticated && (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Site ID</label>
                            <input
                                type="text"
                                value={siteId}
                                onChange={(e) => setSiteId(e.target.value)}
                                placeholder="Paste Site ID from Graph Explorer"
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">Drive Item ID</label>
                            <input
                                type="text"
                                value={driveItemId}
                                onChange={(e) => setDriveItemId(e.target.value)}
                                placeholder="Paste Drive Item ID"
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleFetch}
                        disabled={isLoading || isConnected}
                        className={`w-full flex items-center justify-center gap-2 py-2 rounded text-sm font-medium transition-colors ${isConnected
                            ? 'bg-green-600/20 text-green-400 border border-green-600/50 cursor-default'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Connecting to SharePoint...
                            </>
                        ) : isConnected ? (
                            <>
                                <Check size={16} />
                                Connected & Loaded
                            </>
                        ) : (
                            <>
                                <FileSpreadsheet size={16} />
                                Load Excel File
                            </>
                        )}
                    </button>

                    {error && (
                        <p className="text-xs text-red-400 mt-2 bg-red-900/20 p-2 rounded border border-red-900/50">
                            Error: {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

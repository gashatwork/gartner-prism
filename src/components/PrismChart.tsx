import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { UseCase } from '../data/types';
import useCasesData from '../data/use-cases.json';

const data = (useCasesData as UseCase[]).filter(u => u.businessValue > 0 || u.feasibility > 0);

const PrismChart: React.FC = () => {
    return (
        <div className="w-full h-[600px] bg-slate-900/50 rounded-xl border border-slate-700 p-4 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20 pointer-events-none" />

            {/* Background Zones - simplified for now, can be SVG */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                {/* Add diagonal lines or zone backgrounds here if needed */}
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <XAxis
                        type="number"
                        dataKey="businessValue"
                        name="Business Value"
                        domain={[0, 5]}
                        tick={{ fill: '#94a3b8' }}
                        tickLine={{ stroke: '#475569' }}
                        axisLine={{ stroke: '#475569' }}
                        label={{ value: 'Business Value', position: 'bottom', fill: '#cbd5e1' }}
                    />
                    <YAxis
                        type="number"
                        dataKey="feasibility"
                        name="Feasibility"
                        domain={[0, 5]}
                        tick={{ fill: '#94a3b8' }}
                        tickLine={{ stroke: '#475569' }}
                        axisLine={{ stroke: '#475569' }}
                        label={{ value: 'Feasibility', angle: -90, position: 'insideLeft', fill: '#cbd5e1' }}
                    />
                    <ZAxis type="number" range={[60, 400]} />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload as UseCase;
                                return (
                                    <div className="bg-slate-800/90 border border-slate-600 p-3 rounded shadow-lg backdrop-blur-sm">
                                        <p className="font-bold text-white">{data.name}</p>
                                        <p className="text-blue-300 text-sm">Value: {data.businessValue.toFixed(2)}</p>
                                        <p className="text-purple-300 text-sm">Feasibility: {data.feasibility.toFixed(2)}</p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Scatter name="Use Cases" data={data} fill="#8884d8">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.feasibility > 3 ? '#a78bfa' : '#60a5fa'} />
                        ))}
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PrismChart;

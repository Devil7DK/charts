import { ResponsiveContainer, XAxis, YAxis, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import React, { useMemo } from 'react';

const dummyData = [
    {
        channel: 'Channel One',
        min: 3,
        avg: 5,
        max: 7,
    },
    {
        channel: 'Channel 2',
        min: 5,
        avg: 8,
        max: 12,
    },
    {
        channel: 'Channel 3',
        min: 4,
        avg: 8,
        max: 10,
    },
    {
        channel: 'Channel 4',
        min: 2,
        avg: 5,
        max: 9,
    },
    {
        channel: 'Channel 5',
        min: 3,
        avg: 8,
        max: 13,
    },
];

export const CustomTimelineChart = () => {
    const maxValue = useMemo(() => Math.max(...dummyData.map((item) => item.max)), [dummyData]);

    return (
        <ResponsiveContainer width={500} height={500}>
            <ScatterChart data={dummyData}>
                <YAxis dataKey="channel" type='category' width={100} />
                <XAxis type="number" domain={[0, maxValue]} padding={{ left: 10, right: 10 }} dataKey="min" xAxisId="min" visibility="hidden" height={0} />
                <XAxis type="number" domain={[0, maxValue]} padding={{ left: 10, right: 10 }} dataKey="avg" xAxisId="avg" visibility="hidden" height={0} />
                <XAxis type="number" domain={[0, maxValue]} padding={{ left: 10, right: 10 }} dataKey="max" xAxisId="max" />


                {dummyData.map((item) => (<ReferenceLine key={`line-${item.channel}`} stroke='#a3a3a3' segment={[
                    { x: item.min, y: item.channel },
                    { x: item.max, y: item.channel },
                ]} xAxisId="max" />))}

                <Scatter fill="red" xAxisId="min" />
                <Scatter fill="blue" xAxisId="avg" />
                <Scatter fill="green" xAxisId="max" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

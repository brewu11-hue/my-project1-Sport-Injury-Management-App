
'use client';

import { Injury } from '@/hooks/use-injury-data';
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';
import { format } from 'date-fns';

type RecoveryProgressChartProps = {
  injuries: Injury[];
};

export default function RecoveryProgressChart({ injuries }: RecoveryProgressChartProps) {
  
  if (!injuries || injuries.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        Log an injury to see your recovery progress.
      </div>
    );
  }

  const allHistory = injuries.flatMap(injury => 
    injury.recoveryHistory?.map(h => ({
        injuryId: injury.id,
        injuryType: injury.type,
        date: new Date(h.date), // Ensure it's a Date object
        severity: h.severity
      })) ?? []
  ).sort((a, b) => a.date.getTime() - b.date.getTime());


  if (allHistory.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        No recovery history yet. Update an injury's severity to see progress.
      </div>
    );
  }

  const chartDataMap = new Map<string, { [key: string]: any }>();

  for (const record of allHistory) {
    const dateString = format(record.date, 'yyyy-MM-dd');
    if (!chartDataMap.has(dateString)) {
        chartDataMap.set(dateString, { date: format(record.date, 'MMM d') });
    }
    const entry = chartDataMap.get(dateString)!;
    entry[record.injuryType] = record.severity;
  }
  
  const chartData = Array.from(chartDataMap.values());

  // Forward-fill missing data points
  const injuryTypes = injuries.map(i => i.type);
  for (let i = 1; i < chartData.length; i++) {
    for (const type of injuryTypes) {
        if (chartData[i][type] === undefined) {
            chartData[i][type] = chartData[i - 1][type];
        }
    }
  }


  const chartConfig = injuries.reduce((config, injury, index) => {
    config[injury.type] = {
      label: injury.type,
      color: `hsl(var(--chart-${(index % 5) + 1}))`,
    };
    return config;
  }, {} as ChartConfig);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <YAxis
          domain={[0, 10]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          label={{ value: 'Severity', angle: -90, position: 'insideLeft', offset: -5 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend/>
        {injuries.map((injury, index) => (
          <Line
            key={injury.id}
            dataKey={injury.type}
            type="monotone"
            stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

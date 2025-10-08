
'use client';

import { Injury } from '@/hooks/use-injury-data';
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';

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
        injuryType: injury.type,
        date: new Date(h.date),
        severity: h.severity
      })) ?? []
  );

  if (allHistory.length === 0) {
    return (
      <div className="flex h-[300px] w-full items-center justify-center text-muted-foreground">
        No recovery history yet. Update an injury's severity to see progress.
      </div>
    );
  }

  const dates = [...new Set(allHistory.map(h => new Date(h.date).toISOString().split('T')[0]))].sort();
  
  const chartData = dates.map(dateStr => {
    const record: { [key: string]: any } = { date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    injuries.forEach(injury => {
      if (!injury.recoveryHistory) return;

      const historyForDate = injury.recoveryHistory
        .map(h => ({ ...h, date: new Date(h.date) }))
        .filter(h => new Date(h.date).toISOString().split('T')[0] <= dateStr)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      if (historyForDate.length > 0) {
         record[injury.type] = historyForDate[0].severity;
      }
    });
    return record;
  });

  const chartConfig = injuries.reduce((config, injury, index) => {
    config[injury.type] = {
      label: injury.type,
      color: `hsl(var(--chart-${(index % 2) + 1}))`,
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
            stroke={`hsl(var(--chart-${(index % 2) + 1}))`}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

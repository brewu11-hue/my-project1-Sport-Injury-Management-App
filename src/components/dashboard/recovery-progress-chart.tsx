'use client';

import { Injury } from '@/hooks/use-injury-data';
import { ChartTooltip, ChartTooltipContent, ChartContainer, ChartConfig } from '@/components/ui/chart';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';

type RecoveryProgressChartProps = {
  injuries: Injury[];
};

export default function RecoveryProgressChart({ injuries }: RecoveryProgressChartProps) {
  
  const allHistory = injuries.flatMap(injury => 
    injury.recoveryHistory.map(h => ({
      injuryType: injury.type,
      date: h.date,
      severity: h.severity
    }))
  );

  const dates = [...new Set(allHistory.map(h => h.date.toISOString().split('T')[0]))].sort();
  
  const chartData = dates.map(dateStr => {
    const record: { [key: string]: any } = { date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    injuries.forEach(injury => {
      const historyPoint = injury.recoveryHistory
        .filter(h => h.date.toISOString().split('T')[0] <= dateStr)
        .sort((a, b) => b.date.getTime() - a.date.getTime())[0];
      
      if (historyPoint) {
         record[injury.type] = historyPoint.severity;
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
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

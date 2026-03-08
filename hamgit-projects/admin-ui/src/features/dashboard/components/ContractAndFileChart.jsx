import { useMemo } from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Line } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart'

const lineChartConfig = {
  file: {
    label: 'فایل',
    color: '#502CA8',
  },
  contract: {
    label: 'قرارداد',
    color: '#DADEE3',
  },
}

export const ContractAndFileChart = ({ report }) => {
  const data = useMemo(
    () =>
      Object.values(
        [
          ...(report?.contract_count_per_day_report || []).map((d) => ({
            ...d,
            type: 'contract',
          })),
          ...(report?.file_count_per_day_report || []).map((d) => ({
            ...d,
            type: 'file',
          })),
        ].reduce((acc, { created_at, count, type }) => {
          if (!acc[created_at]) acc[created_at] = { date: created_at, file: 0, contract: 0 }
          acc[created_at][type] = count
          return acc
        }, {})
      ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [report]
  )

  return (
    <div className="p-5 bg-white rounded-2xl border border-zinc-200">
      <div className="flex justify-between items-start pb-4 mb-4 border-b border-zinc-200">
        <h3 className="text-zinc-900 text-xl font-medium">روند قرارداد و فایل</h3>
      </div>

      <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
        <LineChart data={data}>
          <CartesianGrid />
          <YAxis width={28} tickMargin={25} tickLine={false} axisLine={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString('fa-IR', { day: '2-digit', month: '2-digit' })
            }
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="file" type="natural" stroke={lineChartConfig.file.color} strokeWidth={2} />
          <Line
            dataKey="contract"
            type="natural"
            stroke={lineChartConfig.contract.color}
            strokeWidth={2}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

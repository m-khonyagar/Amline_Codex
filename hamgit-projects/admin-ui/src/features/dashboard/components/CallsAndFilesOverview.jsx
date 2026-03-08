import { useMemo } from 'react'
import { PieChart, Pie } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const pieChartConfigs = {
  calls: {
    'تماس خروجی': {
      label: 'تماس خروجی',
      color: '#664BA8',
    },
    'تماس ورودی': {
      label: 'تماس ورودی',
      color: '#977BDB',
    },
  },
  files: {
    'فایل مالک': {
      label: 'فایل مالک',
      color: '#664BA8',
    },
    'فایل مستاجر': {
      label: 'فایل مستاجر',
      color: '#977BDB',
    },
  },
}

const PieChartSection = ({ title, data, chartConfig }) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-zinc-200">
      <div className="pb-4 mb-4 border-b border-zinc-200">
        <h3 className="text-zinc-900 text-xl font-medium">{title}</h3>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex-1 space-y-3">
          {data.map((item, index) => (
            <div key={index} className="flex items-center flex-wrap gap-x-3 fa">
              <div className="size-[8px] rounded-full" style={{ backgroundColor: item.fill }} />
              <div className="text-zinc-600 text-sm text-nowrap">{item.name}</div>
              <div className="text-zinc-900 text-sm text-nowrap">
                {item.value} - %{item.percentage}
              </div>
            </div>
          ))}

          <div className="flex items-center gap-x-3 flex-wrap fa">
            <div className="size-[8px] bg-gray-300" />
            <div className="text-zinc-600 text-sm text-nowrap">همه {title}</div>
            <div className="text-zinc-900 text-sm text-nowrap">
              {data.reduce((acc, item) => acc + item.value, 0)} - %100
            </div>
          </div>
        </div>

        <div className="w-[126px]">
          <ChartContainer config={chartConfig} className="aspect-square min-h-[126px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={data} dataKey="value" innerRadius={30} outerRadius={60} stroke="0" />
            </PieChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}

export const CallsAndFilesOverview = ({ report }) => {
  const callChartData = useMemo(() => {
    const callReport = report?.file_call_report?.[0]
    if (!callReport) return []

    const outgoingTotal = callReport.outgoing_answered + callReport.outgoing_no_answer
    const incomingTotal = callReport.incoming_answered + callReport.incoming_no_answer
    const totalCalls = outgoingTotal + incomingTotal

    return [
      {
        name: 'تماس خروجی',
        value: outgoingTotal,
        percentage: Math.round((outgoingTotal / totalCalls) * 100),
        fill: '#664BA8',
      },
      {
        name: 'تماس ورودی',
        value: incomingTotal,
        percentage: Math.round((incomingTotal / totalCalls) * 100),
        fill: '#977BDB',
      },
    ]
  }, [report])

  const fileChartData = useMemo(() => {
    const fileReport = report?.file_count_report
    if (!fileReport) return []

    const landlordFile = fileReport.landlord_file_count
    const tenantFile = fileReport.tenant_file_count
    const totalFiles = fileReport.total_count

    const getPercentage = (value, total) => {
      if (typeof total !== 'number' || total === 0) return 0
      return Math.round((value / total) * 100)
    }

    return [
      {
        name: 'فایل مالک',
        value: landlordFile,
        percentage: getPercentage(landlordFile, totalFiles),
        fill: '#664BA8',
      },
      {
        name: 'فایل مستاجر',
        value: tenantFile,
        percentage: getPercentage(tenantFile, totalFiles),
        fill: '#977BDB',
      },
    ]
  }, [report])

  return (
    <div className="grid xl:grid-cols-2 gap-5">
      <PieChartSection title="تماس‌ها" data={callChartData} chartConfig={pieChartConfigs.calls} />
      <PieChartSection title="فایل‌ها" data={fileChartData} chartConfig={pieChartConfigs.files} />
    </div>
  )
}

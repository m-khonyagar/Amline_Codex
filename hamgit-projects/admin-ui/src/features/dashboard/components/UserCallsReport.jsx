import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  incoming_answered: {
    label: 'ورودی موفق',
    color: '#E0B7FF',
  },
  incoming_no_answer: {
    label: 'ورودی ناموفق',
    color: '#F8A37F',
  },
  outgoing_answered: {
    label: 'خروجی موفق',
    color: '#ADBDFF',
  },
  outgoing_no_answer: {
    label: 'خروجی ناموفق',
    color: '#FFDEC2',
  },
  total: {
    label: 'مجموع',
    color: '#FFDEC2',
  },
}

export const UserCallsReport = ({ data }) => {
  return (
    <div className="p-5 bg-white rounded-2xl border border-zinc-200">
      <div className="flex justify-between items-start pb-4 mb-2 border-b border-zinc-200">
        <div>
          <h3 className="text-zinc-900 text-xl font-medium">
            گزارش و میانگین تماس‌ به تفکیک کارشناس
          </h3>
          <p className="text-[#61E0AD] text-sm mt-2">تارگت هفته: ۵۰ تماس</p>
        </div>

        <div className="grid grid-cols-2 gap-x-2">
          <div className="flex items-center gap-2">
            <div className="size-[10px] bg-purple-300 rounded-full" />
            <div className="text-zinc-600">ورودی موفق</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-[10px] bg-orange-300 rounded-full" />
            <div className="text-zinc-600">ورودی ناموفق</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-[10px] bg-indigo-300 rounded-full" />
            <div className="text-zinc-600">خروجی موفق</div>
          </div>

          <div className="flex items-center gap-2">
            <div className="size-[10px] bg-amber-300 rounded-full" />
            <div className="text-zinc-600">خروجی ناموفق</div>
          </div>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart data={data}>
          <CartesianGrid vertical={false} />
          <YAxis width={28} tickMargin={25} tickLine={false} axisLine={false} />
          <XAxis
            dataKey="name"
            tickMargin={15}
            tickLine={false}
            axisLine={false}
            angle={-30}
            height={40}
            tickFormatter={(value) => {
              const label = value.split(' ')
              return label[label.length - 1]
            }}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                footerRenderer={(item, index) =>
                  index === 3 && (
                    <div className="text-muted-foreground mt-1.5 border-t pt-1.5 fa">
                      <div className="flex items-center gap-1 text-xs">
                        زمان تماس
                        <div className="text-foreground tabular-nums">{item.payload.duration}</div>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        مجموع موفق
                        <div className="text-foreground tabular-nums">
                          {item.payload.incoming_answered + item.payload.outgoing_answered}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs">
                        مجموع ناموفق
                        <div className="text-foreground tabular-nums">
                          {item.payload.incoming_no_answer + item.payload.outgoing_no_answer}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-medium">
                        مجموع
                        <div className="text-foreground font-medium tabular-nums">
                          {Object.values(item.payload)
                            .filter((v) => typeof v === 'number')
                            .reduce((acc, value) => acc + value, 0)}
                        </div>
                      </div>
                    </div>
                  )
                }
              />
            }
          />
          <Bar
            dataKey="incoming_answered"
            stackId="a"
            fill={chartConfig.incoming_answered.color}
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="incoming_no_answer"
            stackId="a"
            fill={chartConfig.incoming_no_answer.color}
          />
          <Bar dataKey="outgoing_answered" stackId="a" fill={chartConfig.outgoing_answered.color} />
          <Bar
            dataKey="outgoing_no_answer"
            stackId="a"
            fill={chartConfig.outgoing_no_answer.color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

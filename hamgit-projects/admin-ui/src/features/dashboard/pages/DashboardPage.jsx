import { useMemo, useState } from 'react'
import { useGetReport } from '../api/get-report'
import { Page } from '@/features/misc'
import { DurationSelector } from '../components/DurationSelector'
import { StatCards } from '../components/StatCards'
import { FileStatusProgress } from '../components/FileStatusProgress'
import { CallsAndFilesOverview } from '../components/CallsAndFilesOverview'
import { DailyCallsReport } from '../components/DailyCallsReport'
import { UserCallsReport } from '../components/UserCallsReport'
import { ContractAndFileChart } from '../components/ContractAndFileChart'
import { format } from 'date-fns'
import { PermissionGuard } from '@/components/guards/PermissionGuard'

const DashboardPage = () => {
  const [duration, setDuration] = useState('MONTHLY')
  const [dates, setDates] = useState([
    format(Date.now() - 86_400_000, 'yyyy-MM-dd'),
    format(Date.now(), 'yyyy-MM-dd'),
  ])

  const getReportQuery = useGetReport(
    duration === 'CUSTOM' ? { start_date: dates[0], end_date: dates[1] } : { duration }
  )
  const report = useMemo(() => getReportQuery.data || {}, [getReportQuery.data])

  return (
    <Page title="داشبورد">
      <PermissionGuard requiredRoles={['SUPERUSER', 'STAFF']} fallback="داشبورد">
        <div className="grid xl:grid-cols-2 gap-5">
          <div className="col-span-full">
            <DurationSelector
              duration={duration}
              onChangeDuration={setDuration}
              date={dates}
              onChangeDate={setDates}
            />
          </div>

          <StatCards
            totalIncome={report?.total_income_report}
            newContractsCount={report?.contract_count_report}
          />

          <FileStatusProgress fileStatus={report?.file_status_count_report} />

          <CallsAndFilesOverview report={report} />

          <DailyCallsReport data={report?.voip_call_daily_report || []} duration={duration} />

          <UserCallsReport
            data={(report?.voip_call_user_report || [])
              .filter((item) => item.name && item.duration)
              .map((item) => ({
                ...item,
                duration: String(item.duration),
              }))}
          />

          <div className="col-span-full">
            <ContractAndFileChart report={report} />
          </div>
        </div>
      </PermissionGuard>
    </Page>
  )
}

export default DashboardPage

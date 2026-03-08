import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { ActivityTab } from './ActivityTab'
import { CallTab } from './CallTab'
import { SmsTab } from './SmsTab'
import { AssignedTab } from './AssignedTab'
import { RealtorSharedTab } from './RealtorSharedTab'
import { AllHistoryTab } from './AllHistoryTab'

const tabs = [
  { key: 'all', label: 'همه' },
  { key: 'sms', label: 'پیام ها' },
  { key: 'call', label: 'تماس ها' },
  { key: 'activity', label: 'فعالیت ها' },
  { key: 'assigned', label: 'ارجاعات' },
  { key: 'realtor-shared', label: 'ارسال به مشاور املاک' },
]

export const History = ({ fileId }) => {
  return (
    <Tabs defaultValue="all" dir="rtl" className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            disabled={tab.disabled}
            className="px-2.5 py-1 rounded-lg border text-sm ml-3"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="all">
        <AllHistoryTab fileId={fileId} />
      </TabsContent>

      <TabsContent value="sms">
        <SmsTab fileId={fileId} />
      </TabsContent>

      <TabsContent value="call">
        <CallTab fileId={fileId} />
      </TabsContent>

      <TabsContent value="activity">
        <ActivityTab fileId={fileId} />
      </TabsContent>

      <TabsContent value="assigned">
        <AssignedTab fileId={fileId} />
      </TabsContent>

      <TabsContent value="realtor-shared">
        <RealtorSharedTab fileId={fileId} />
      </TabsContent>
    </Tabs>
  )
}

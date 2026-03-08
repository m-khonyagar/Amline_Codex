import { Page } from '@/features/misc'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { FileSources, FileLabels, Districts } from '../components/settings'

export default function SettingsPage() {
  return (
    <Page title="تنظیمات بازار">
      <Tabs defaultValue="file-sources" dir="rtl">
        <TabsList className="mb-8">
          <TabsTrigger value="file-sources" className="text-base">
            مدیریت منابع فایل
          </TabsTrigger>

          <TabsTrigger value="file-labels" className="text-base">
            مدیریت برچسب های فایل
          </TabsTrigger>

          <TabsTrigger value="user-labels" className="text-base">
            مدیریت برچسب های کاربر
          </TabsTrigger>

          <TabsTrigger value="districts" className="text-base">
            مدیریت محله ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file-sources">
          <FileSources />
        </TabsContent>

        <TabsContent value="file-labels">
          <FileLabels type="FILE" />
        </TabsContent>

        <TabsContent value="user-labels">
          <FileLabels type="USER" />
        </TabsContent>

        <TabsContent value="districts">
          <Districts />
        </TabsContent>
      </Tabs>
    </Page>
  )
}

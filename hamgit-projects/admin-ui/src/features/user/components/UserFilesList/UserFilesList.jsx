import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useState } from 'react'
import { LandlordFilesList } from './LandlordFilesList'
import { TenantFilesList } from './TenantFilesList'
import { BuyerFilesList } from './BuyerFilesList'
import { SellerFilesList } from './SellerFilesList'
import { RealtorFilesList } from './RealtorFilesList'

export const UserFilesList = () => {
  const [tab, setTab] = useState('landlord')

  return (
    <div className="bg-white rounded-2xl p-4">
      <Tabs value={tab} onValueChange={setTab} dir="rtl">
        <TabsList>
          <TabsTrigger value="landlord">فایل اجاره مالک</TabsTrigger>
          <TabsTrigger value="tenant">فایل اجاره مستاجر</TabsTrigger>
          <TabsTrigger value="buyer">فایل خریدار</TabsTrigger>
          <TabsTrigger value="seller">فایل فروشنده</TabsTrigger>
          <TabsTrigger value="realtor">فایل مشاور املاک</TabsTrigger>
        </TabsList>

        <TabsContent value="landlord">
          <LandlordFilesList />
        </TabsContent>

        <TabsContent value="tenant">
          <TenantFilesList />
        </TabsContent>

        <TabsContent value="buyer">
          <BuyerFilesList />
        </TabsContent>

        <TabsContent value="seller">
          <SellerFilesList />
        </TabsContent>

        <TabsContent value="realtor">
          <RealtorFilesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

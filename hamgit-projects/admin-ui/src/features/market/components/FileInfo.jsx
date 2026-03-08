import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { MarketRole, MarketRoles } from '@/data/enums/market_enums'
import { DepositRentFileInfo } from './deposit-rent/DepositRentInfo/DepositRentFileInfo'
import { DepositRentLandlordInfo } from './deposit-rent/DepositRentInfo/DepositRentLandlordInfo'
import { DepositRentTenantInfo } from './deposit-rent/DepositRentInfo/DepositRentTenantInfo'
import { BuySellFileInfo } from './buy-sell/BuySellFileInfo/BuySellFileInfo'
import { FileConnections } from './FileConnections'
import { History } from './History'
import { BuySellBuyerInfo } from './buy-sell/BuySellFileInfo/BuySellBuyerInfo'
import { BuySellSellerInfo } from './buy-sell/BuySellFileInfo/BuySellSellerInfo'

export const FileInfo = ({ data }) => (
  <div className="bg-white rounded-lg">
    <Tabs defaultValue="file_info" dir="rtl">
      <TabsList className="pt-2">
        <TabsTrigger value="file_info">اطلاعات فایل</TabsTrigger>

        {data.role === MarketRole.LANDLORD && (
          <TabsTrigger value="landlord_info">اطلاعات مالک</TabsTrigger>
        )}

        {data.role === MarketRole.TENANT && (
          <TabsTrigger value="tenant_info">اطلاعات مستاجر</TabsTrigger>
        )}

        {data.role === MarketRole.BUYER && (
          <TabsTrigger value="buyer_info">اطلاعات خریدار</TabsTrigger>
        )}

        {data.role === MarketRole.SELLER && (
          <TabsTrigger value="seller_info">اطلاعات فروشنده</TabsTrigger>
        )}

        <TabsTrigger value="intro_file">معرفی فایل</TabsTrigger>

        <TabsTrigger value="history">تاریخچه</TabsTrigger>
      </TabsList>

      <TabsContent value="file_info" className="py-8">
        {MarketRoles.DEPOSIT_RENT.includes(data.role) && <DepositRentFileInfo fileInfo={data} />}
        {MarketRoles.BUY_SELL.includes(data.role) && <BuySellFileInfo fileInfo={data} />}
      </TabsContent>

      {data.role === MarketRole.LANDLORD && (
        <TabsContent value="landlord_info" className="py-8">
          <DepositRentLandlordInfo landlordInfo={data} />
        </TabsContent>
      )}

      {data.role === MarketRole.TENANT && (
        <TabsContent value="tenant_info" className="py-8">
          <DepositRentTenantInfo tenantInfo={data} />
        </TabsContent>
      )}

      {data.role === MarketRole.BUYER && (
        <TabsContent value="buyer_info" className="py-8">
          <BuySellBuyerInfo buyerInfo={data} />
        </TabsContent>
      )}

      {data.role === MarketRole.SELLER && (
        <TabsContent value="seller_info" className="py-8">
          <BuySellSellerInfo sellerInfo={data} />
        </TabsContent>
      )}

      <TabsContent value="intro_file" className="py-8">
        <FileConnections data={data} />
      </TabsContent>

      <TabsContent value="history" className="p-6">
        <History fileId={data.id} />
      </TabsContent>
    </Tabs>
  </div>
)

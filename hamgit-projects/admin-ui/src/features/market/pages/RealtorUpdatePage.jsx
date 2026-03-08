import { useParams } from 'react-router-dom'
import { Page } from '@/features/misc'
import { RealtorForm } from '../components/RealtorForm'

export default function RealtorUpdatePage() {
  const { id } = useParams()

  return (
    <Page title="ویرایش فایل مشاور املاک">
      <RealtorForm id={id} />
    </Page>
  )
}

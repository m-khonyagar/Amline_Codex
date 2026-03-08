import dynamic from 'next/dynamic'

const LocationPreview = dynamic(() => import('./LocationPreview'), {
  ssr: false,
  loading: () => <div style={{ height: '160px' }} />,
})

function NextLocationPreview(props) {
  return <LocationPreview {...props} />
}

export default NextLocationPreview

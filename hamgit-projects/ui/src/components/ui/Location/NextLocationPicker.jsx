import dynamic from 'next/dynamic'

const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => <div style={{ height: '420px' }} />,
})

function NextLocationPicker(props) {
  return <LocationPicker {...props} />
}

export default NextLocationPicker

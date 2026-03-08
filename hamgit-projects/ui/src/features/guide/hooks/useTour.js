import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const useTour = (steps) => {
  const driverObj = driver({
    popoverClass: 'custom-tour',
    stagePadding: 6,
    showProgress: true,
    steps,
  })

  return { startTour: driverObj.drive, highlight: driverObj.highlight }
}

export default useTour

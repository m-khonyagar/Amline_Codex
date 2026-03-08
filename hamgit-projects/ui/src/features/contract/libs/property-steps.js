const propertyInformationSteps = [
  {
    title: 'مشخصات ملک',
    link: 'specifications',
    disabled: false,
    completed: false,
    checkCompleted: (statuses) => statuses?.steps?.PROPERTY_SPECIFICATIONS,
  },
  {
    title: 'جزئیات ملک',
    link: 'details',
    disabled: false,
    completed: false,
    checkCompleted: (statuses) => statuses?.steps?.PROPERTY_DETAILS,
  },
  {
    title: 'امکانات ملک',
    link: 'features',
    disabled: false,
    completed: false,
    checkCompleted: (statuses) => statuses?.steps?.PROPERTY_FACILITIES,
  },
]

const getPropertyInformationSteps = (statuses) => {
  return propertyInformationSteps.map((step) => ({
    ...step,
    completed: step.checkCompleted ? step.checkCompleted(statuses, step) : step.completed,
  }))
}

export { propertyInformationSteps, getPropertyInformationSteps }

import { createContext, useContext, useMemo, useState } from 'react'

const GuideContext = createContext()

export default function GuideProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)

  const values = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      isSupportModalOpen,
      setIsSupportModalOpen,
    }),
    [isOpen, isSupportModalOpen]
  )

  return <GuideContext.Provider value={values}>{children}</GuideContext.Provider>
}

export const useGuideContext = () => {
  const context = useContext(GuideContext)

  if (context === undefined) {
    throw new Error('useGuideContext was used outside of its Provider')
  }

  return context
}

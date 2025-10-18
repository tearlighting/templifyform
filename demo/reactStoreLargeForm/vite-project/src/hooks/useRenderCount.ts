import { useRef } from "react"

export const useRenderCount = () => {
  const renderTimesRef = useRef(0)
  renderTimesRef.current += 1
  return renderTimesRef.current
}

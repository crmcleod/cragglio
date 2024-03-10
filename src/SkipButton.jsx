import { useEffect, useState } from "react"

export const SkipButton = ({hidden, inGame, currentText, handleSkipButtonClick}) => {

  const [active, setActive] = useState(false)
  useEffect(() => {
    setTimeout(() => setActive(true), 2000)
  },[])

  if(active)
    return (
            !hidden && inGame && currentText && (
            <button className={`skip-button ${hidden ? 'hidden' : 'visible'}`} key={hidden} onClick={handleSkipButtonClick} >
              Skip
            </button>
          )
    )
}
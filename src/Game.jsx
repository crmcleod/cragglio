import React, { useContext, useState } from "react"
import Dust from "./Dust"
import DiffusingPixels from "./IntroDiffuse"
import { Credits } from "./Credits"
import { Menu } from "./Menu"
import { OptionsContainer } from "./OptionsContainer"
import { MainContext } from "./App"
export const Game = () => {

  const [clicked, setClicked] = useState(false)

  const {
    currentText, currentOptions, storyLevel, currentChapterLevel, hidden, inGame, intro, handleOptionClick, closedRoutes,timer, count, setTimer, setCount
  } = useContext(MainContext)


  const skipText = () => {
    setTimer(count + 10)
    setClicked(true)
    setTimeout(() => {
      setClicked(false)
    },3000)
  }
  return (
    <>
      <Dust />
      {!inGame && <DiffusingPixels />}
      <div className='App h100 w100 fixed flex-column'>
        {
          !inGame && intro &&
          <Credits />
        }
        {
          !intro && !inGame &&
          <Menu />
        }
          {
            (timer > 30) && !clicked && inGame && currentText && !currentOptions && <button className={`skip-button ${hidden ? 'hidden' : 'visible'}`} onClick={skipText}>Skip</button>
          }
        {
          inGame && currentText &&
          <p key={currentChapterLevel + storyLevel + currentOptions?.length} className={`normal-text ${hidden ? 'hidden' : 'visible'}`}>
            {currentText}
          </p>
        }
        {
          inGame && currentOptions &&
          <OptionsContainer handleOptionClick={handleOptionClick} currentOptions={currentOptions} closedRoutes={closedRoutes}/>
        }
      </div>
    </>
  )
}
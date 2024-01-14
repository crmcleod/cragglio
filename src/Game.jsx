import React, { useContext } from "react"
import Dust from "./Dust"
import DiffusingPixels from "./IntroDiffuse"
import { Credits } from "./Credits"
import { Menu } from "./Menu"
import { OptionsContainer } from "./OptionsContainer"
import { MainContext } from "./App"
export const Game = () => {

  const {
    currentText, currentOptions, storyLevel, currentChapterLevel, hidden, inGame, intro, handleOptionClick
  } = useContext(MainContext)

  return (
    <>
      <Dust />
      <DiffusingPixels />
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
          inGame && currentText &&
          <p key={currentChapterLevel + storyLevel + currentOptions?.length} className={`normal-text ${hidden ? 'hidden' : 'visible'}`}>
            {currentText}
          </p>
        }
        {
          inGame && currentOptions &&
          <OptionsContainer handleOptionClick={handleOptionClick} currentOptions={currentOptions} />
        }
      </div>
    </>
  )
}
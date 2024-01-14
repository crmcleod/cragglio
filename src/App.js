import './App.css';
import { useState, useEffect } from 'react'
import Dust from './Dust';
import axios from 'axios'
import DiffusingPixels from './IntroDiffuse';
import { Menu } from './Menu';
function App() {

  const [currentText, setCurrentText] = useState(null);
  const [text, setText] = useState(null)
  const [currentOptions, setCurrentOptions] = useState(null)
  const [storyLevel, setStoryLevel] = useState(1)
  const [currentChapterLevel, setCurrentChapterLevel] = useState(0)
  const [hidden, setHidden] = useState(true)
  const [inGame, setInGame] = useState(false)
  const [intro, setIntro] = useState(true)

  useEffect(() => {
    axios.get('https://raw.githubusercontent.com/crmcleod/cragglio/main/src/text.json').then(res => setText(res.data))
    setTimeout(() => {
      setIntro(false)
      setTimeout(() => {
        setInGame(true)
      }, 10000)
    }, 12000)
  }, [])

  useEffect(() => {
    if (inGame) {

      if (text?.[`${storyLevel}`]?.[currentChapterLevel]?.text) {
        setTimeout(() => {

          setCurrentText(text?.[`${storyLevel}`]?.[currentChapterLevel]?.text)
          setHidden(false)
          const timeOut = setTimeout(() => {
            setCurrentChapterLevel(currentChapterLevel + 1)
            setHidden(true)

          }, (text?.[`${storyLevel}`]?.[currentChapterLevel]?.text?.split(' ').length * 330) + 2000)
        }, 1500)
      }
      else
        if (text?.[`${storyLevel}`]?.[currentChapterLevel]?.options) {
          setCurrentText(null)
          setCurrentOptions(text[`${storyLevel}`]?.[currentChapterLevel])
        }
    }
  }, [currentChapterLevel, storyLevel, text, inGame])

  const advanceStory = (chapterLevel, storyLevel) => {
    setCurrentChapterLevel(chapterLevel)
    setStoryLevel(storyLevel)
  }

  const handleOptionClick = (e) => {

    const tempOptions = currentOptions;
    setCurrentOptions(null)
    setCurrentText(tempOptions?.options?.[e]?.action + (tempOptions?.['continuity-text'] ? (' ' + tempOptions['continuity-text']) : ''))
    setTimeout(() => {
      tempOptions?.options?.[e]?.hasOwnProperty('chapter-level') ?
        advanceStory(tempOptions?.options?.[e]['chapter-level'], tempOptions?.options?.[e]['story-level']) :
        setCurrentChapterLevel(currentChapterLevel + 1)
    }, (((((tempOptions?.['continuity-text'] ? tempOptions?.['continuity-text'] : ' ') + (tempOptions?.options?.[e]?.action)).split(' ')).length) * 330) + 2000)

  }
  return (
    <>
      <Dust />
      <DiffusingPixels />
      <div className='App'>
        {
          !inGame &&
          intro &&
          <div id='logo'>
            <p>
              Created by
            </p>
            <img src="https://fontmeme.com/permalink/240114/9dfb864c8712a01b5f582a9bc8beee30.png" alt="rockredugly logo" border="0" />
          </div>
        }
        {
          !intro && !inGame &&
          <Menu />
        }
        {
          inGame &&
          currentText &&
          <p key={currentChapterLevel + storyLevel + currentOptions?.length} className={`normal-text ${hidden ? 'hidden' : 'visible'}`}>
            {currentText}
          </p>
        }
        {
          inGame &&
          currentOptions &&
          <div id='options-container'>
            {currentOptions.options.map((x, i) => {
              return (
                <p key={i + new Date().getTime()} onClick={() => handleOptionClick(i)} className='options-text'>
                  {x.text}
                </p>
              )
            })}
          </div>
        }
      </div>
    </>
  );
}

export default App;

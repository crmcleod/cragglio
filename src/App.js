import './App.css';
import { useState, useEffect } from 'react'
import text from './text.json'
import Dust from './Dust';

function App() {

  const [currentText, setCurrentText] = useState(null);
  const [currentOptions, setCurrentOptions] = useState(null)
  const [storyLevel, setStoryLevel] = useState(1)
  const [currentChapterLevel, setCurrentChapterLevel] = useState(0)

  useEffect(() => {
    if (text[`${storyLevel}`]?.[currentChapterLevel]?.text) {
      setCurrentText(text[`${storyLevel}`]?.[currentChapterLevel]?.text)
      const timeOut = setTimeout(() => {
        setCurrentChapterLevel(currentChapterLevel + 1)
      }, (text[`${storyLevel}`]?.[currentChapterLevel]?.text.split(' ').length * 330) + 2000)
      // }, 400)
    }
    else
      if (text[`${storyLevel}`]?.[currentChapterLevel]?.options) {
        setCurrentText(null)
        setCurrentOptions(text[`${storyLevel}`]?.[currentChapterLevel])
      }
  }, [currentChapterLevel, storyLevel])

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
      <div className='App'>
        {
          currentText &&
          <p key={currentChapterLevel + storyLevel + currentOptions?.length} className='normal-text'>
            {currentText}
          </p>
        }
        {currentOptions &&
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

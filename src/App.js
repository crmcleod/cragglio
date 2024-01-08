import './App.css';
import { useState, useEffect } from 'react'
import text from './text.json'
import Dust from './Dust';

function App() {

  const [currentText, setCurrentText] = useState(null);
  const [currentOptions, setCurrentOptions] = useState(null)
  const [timer, setTimer] = useState(0)
  const [storyLevel, setStoryLevel] = useState(1)
  const [currentChapterLevel, setCurrentChapterLevel] = useState(0)

  useEffect(() => {
    if (text[`${storyLevel}`]?.[currentChapterLevel]?.text) {
      setCurrentText(text[`${storyLevel}`]?.[currentChapterLevel]?.text)
      const timeOut = setTimeout(() => {
        setCurrentChapterLevel(currentChapterLevel + 1)
      }, (text[`${storyLevel}`]?.[currentChapterLevel]?.text.split(' ').length*300) + 2000)
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
    setCurrentText(currentOptions?.options?.[e]?.action + (currentOptions?.['continuity-text'] ? (' ' + currentOptions['continuity-text']) : ''))
    const tempOptions = currentOptions;
    setCurrentOptions(null)
    
    setTimeout(() => {
      tempOptions?.options?.[e]?.hasOwnProperty('chapter-level') ?
      advanceStory(currentOptions?.options?.[e]['chapter-level'], currentOptions?.options?.[e]['story-level']) :
      setCurrentChapterLevel(currentChapterLevel + 1)
    }, (((currentOptions?.['continuity-text'] ? currentOptions?.['continuity-text'] : ' ') + currentOptions?.options?.[e]?.text.split(' ').length ) * 300) + 4000)
  // }, 400)

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

import './Styles/App.css';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios'
import { Game } from './Game';
import mineText from './mine.json'

export const MainContext = createContext();

export const App = () => {

  // currentText only for narrative and not options
  const [currentText, setCurrentText] = useState(null);
  // whole jsonScript
  const [text, setText] = useState(null)
  // options for story advancement
  const [currentOptions, setCurrentOptions] = useState(null)
  // story refers to current section, chapter refers to index of subsection of story
  const [storyLevel, setStoryLevel] = useState(1)
  const [currentChapterLevel, setCurrentChapterLevel] = useState(0)
  // purely for state driven class
  const [hidden, setHidden] = useState(true)
  const [inGame, setInGame] = useState(false)
  const [intro, setIntro] = useState(true)
  const [route, setRoute] = useState([{ story: 1, chapter: 0 }])


  useEffect(() => {
    setText(mineText)
    // axios.get('https://raw.githubusercontent.com/crmcleod/cragglio/main/src/text.json').then(res => setText(res.data))
    setTimeout(() => { // credit screen
      setIntro(false)
      setTimeout(() => { // title screen
        setInGame(true)
      }, 10000)
    }, 12000)
  }, [])


  useEffect(() => {
    const env = process.env
    if (currentChapterLevel === 0 && storyLevel === 1 && route.length > 1) {
      axios.post(`https://discord.com/api/webhooks/${env.REACT_APP_webhook_id}/${env.REACT_APP_webhook_token}`, { "content": JSON.stringify(route) })
    }
    if (inGame) {
      // if text successfully set to state
      if (text?.[`${storyLevel}`]?.[currentChapterLevel]?.text) {

        ////////////////////////////
        // TO DO - HANDLE ENDING! //
        ////////////////////////////


        setTimeout(() => { // 1.5s time out to allow fade in of text

          setCurrentText(text?.[`${storyLevel}`]?.[currentChapterLevel]?.text)
          setHidden(false)
          setTimeout(() => { // set correct story elemen with 330ms/word plus 2 timer
            setCurrentChapterLevel(currentChapterLevel + 1)
            setHidden(true)

          }, (text?.[`${storyLevel}`]?.[currentChapterLevel]?.text?.split(' ').length * 3) + 20) // 330
        }, 150) // 1500
      }
      else
        // if text not set and options exist then set options
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

    const newRouteList = [...route, { currentPosition: { storyLevel, currentChapterLevel }, story: tempOptions?.options?.[e]?.['story-level'], chapter: tempOptions?.options?.[e]?.['chapter-level'], choice: e }]
    setRoute(newRouteList)

    setCurrentOptions(null)

    setTimeout(() => {

      // additional text prop available as "continuity text", this can be used to add common text to all options
      // action is immediate action after selecting option
      setCurrentText(tempOptions?.options?.[e]?.action + (tempOptions?.['continuity-text'] ? (' ' + tempOptions['continuity-text']) : ''))
      setHidden(false)
      setTimeout(() => {
        // if options has chapter-level prop use the options, otherwise presume script and move forward
        tempOptions?.options?.[e]?.hasOwnProperty('chapter-level') ?
          advanceStory(tempOptions?.options?.[e]['chapter-level'], tempOptions?.options?.[e]['story-level']) :
          setCurrentChapterLevel(currentChapterLevel + 1)
        setHidden(true)
      }, (((((tempOptions?.['continuity-text'] ? tempOptions?.['continuity-text'] : ' ') + (tempOptions?.options?.[e]?.action)).split(' ')).length) * 3) + 2000) // 330

    }, 1000)
  }
  return (
    <MainContext.Provider value={{ currentText, currentOptions, storyLevel, currentChapterLevel, hidden, inGame, intro, handleOptionClick }}>
      <Game />
    </MainContext.Provider>
  );
}

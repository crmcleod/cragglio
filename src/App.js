import './Styles/App.css';
import { useState, useEffect, createContext } from 'react';
import axios from 'axios'
import { Game } from './Game';

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
  const [closedRoutes, setClosedRoutes] = useState({})
  // game tick - in 100ms intervals
  const [tick, setTick] = useState(false)
  const [count, setCount] = useState(0)
  const [timer, setTimer] = useState(0)


  const handleTimerTick = () => {
    const newTick = !tick;
    setTick(newTick);

    if (count <= timer && inGame) {
      setCount(count + 1);
    } else if (inGame && count > timer) {
      setCurrentChapterLevel(currentChapterLevel + 1);
      setHidden(true);
      setCount(0);
    }
  };

  useEffect(() => {
    if (!currentOptions) {
      const timerId = setTimeout(handleTimerTick, 100);
      return () => clearTimeout(timerId);
    }
  }, [tick])


  useEffect(() => {

    const currentUrl = window.location.href.split('story=').pop()
    axios.get(`https://raw.githubusercontent.com/crmcleod/cragglio/main/src/${currentUrl === 'mine' ? 'mine' : 'text'
      }.json`).then(res => {
        setTimeout(() => { // credit screen
          setIntro(false)
          setTimeout(() => { // title screen
            setInGame(true)
            const chapterText = res.data?.[`${storyLevel}`]?.[currentChapterLevel]?.text;
            const textLength = chapterText?.split(' ').length || 0;

            setTimer((textLength * 330 + 2000) / 100);
            setCount(0)
          }, 10000)
        }, 12000)
        setText(res.data)
      })
  }, [])


  useEffect(() => {
    const env = process.env
    if ((currentChapterLevel === 0 && storyLevel === 1 && route.length > 1) || text?.[storyLevel]?.[currentChapterLevel]?.hasOwnProperty('end')) {
      axios.post(`https://discord.com/api/webhooks/${env.REACT_APP_webhook_id}/${env.REACT_APP_webhook_token}`, { "content": JSON.stringify(route) })
    }
    if (inGame) {
      // if text successfully set to state
      if (text?.[`${storyLevel}`]?.[currentChapterLevel]?.text) {
        setTimeout(() => { // 1.5s time out to allow fade in of text
          setCurrentText(text?.[`${storyLevel}`]?.[currentChapterLevel]?.text)
          setTimer(((text?.[`${storyLevel}`]?.[currentChapterLevel]?.text?.split(' ').length * 330) + 2000) / 100)
          setCount(0)
          setHidden(false)
        }, 1500) // 1500
      }
      else
        // if text not set and options exist then set options
        if (text?.[`${storyLevel}`]?.[currentChapterLevel]?.options) {
          setCurrentText(null)
          setCurrentOptions(text[`${storyLevel}`]?.[currentChapterLevel])
        }
    }
  }, [currentChapterLevel, storyLevel, text, inGame])

  const advanceStory = (chapterLevel, nextStoryLevel) => {
    if (chapterLevel === currentChapterLevel && storyLevel === nextStoryLevel) {
      setCurrentChapterLevel(null)
      setStoryLevel(null)
    }
    // allow slight delay to return to same point in story
    setTimeout(() => {
      setCurrentChapterLevel(chapterLevel)
      setStoryLevel(nextStoryLevel)
    }, 50)
  }

  const handleOptionClick = (e) => {

    const tempOptions = currentOptions;

    // for feeding back to discord
    const newRouteList = [...route, { currentPosition: { storyLevel, currentChapterLevel }, story: tempOptions?.options?.[e]?.['story-level'], chapter: tempOptions?.options?.[e]?.['chapter-level'], choice: e }]
    setRoute(newRouteList)
    setTick(!tick)

    const currentOption = tempOptions?.options?.[e];
    // all option tags have been satisfied to lock route
    const optionSatisfied = currentOption?.['option-tag']?.every(tag => closedRoutes[tag]);
    setCurrentOptions(null)
    const actionOrLockedAction = optionSatisfied ? currentOption?.['locked-action'] : currentOption?.action
    const continuityText = tempOptions?.['continuity-text'] ? (' ' + tempOptions['continuity-text']) : ''
    const rawReadingTime = ( actionOrLockedAction + ' ' + continuityText ).split(' ').length * 330
    // 2000 extra ms for comfort reading shorter blocks; correction of 100 matches up with game counter
    setTimer((rawReadingTime + 2000) / 100)
    setCount(0)

    setTimeout(() => {

      // additional text prop available as "continuity text", this can be used to add common text to all options
      // action is immediate action after selecting option
      setCurrentText(
        (optionSatisfied ? currentOption?.['locked-action'] : currentOption?.action)
        + (tempOptions?.['continuity-text'] ?
          (' ' + tempOptions['continuity-text']) : ''))
      setHidden(false)
      setTimeout(() => {

        // if options has chapter-level prop use the options, otherwise presume script and move forward
        if (currentOption?.hasOwnProperty('chapter-level')) {
          // presence of option tag indicates that a path is closable
          if (currentOption?.hasOwnProperty('option-tag')) {
            // if there are multiple option tags, there are conditions to locked options
            if (currentOption['option-tag'].length > 1) {
              // start wtih optionSatisfied as true; any false means not satisfied, in reverse, false can be changed to true on a single true

              // if multi option tag satisfied, use locked levels
              if (optionSatisfied) {
                advanceStory(currentOption['locked-chapter-level'], tempOptions?.options?.[e]['locked-story-level'])
              } else {
                advanceStory(currentOption['chapter-level'], currentOption['story-level'])
              }
            } else
              if (closedRoutes?.[currentOption['option-tag']]) {
                advanceStory(currentOption['locked-chapter-level'], currentOption['locked-story-level'])
              } else {
                const newClosedRouteObject = { ...closedRoutes }
                newClosedRouteObject[currentOption['option-tag']] = true
                setClosedRoutes(newClosedRouteObject)
                advanceStory(currentOption['chapter-level'], currentOption['story-level'])
              }
          } else {
            advanceStory(currentOption['chapter-level'], currentOption['story-level'])
          }
        }
        else {
          setCurrentChapterLevel(currentChapterLevel + 1)
        }
        setHidden(true)
      }, (((((tempOptions?.['continuity-text'] ? tempOptions?.['continuity-text'] : ' ') + (currentOption?.action)).split(' ')).length) * 330) + 2000) // 330

    }, 1000)
  }
  return (
    <MainContext.Provider value={{ currentText, currentOptions, storyLevel, currentChapterLevel, hidden, inGame, intro, handleOptionClick, closedRoutes, timer, count, setTimer, setCount }}>
      <Game />
    </MainContext.Provider>
  );
}

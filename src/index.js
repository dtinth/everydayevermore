/* eslint import/no-webpack-loader-syntax: off */

import _ from 'lodash'
import assert from 'assert'
import invariant from 'invariant'

document.body.style.background = '#000'
document.body.style.textAlign = 'center'

function div (style) {
  const el = document.createElement('div')
  el.setAttribute('style', style)
  return el
}

function append (child) {
  return { to (container) {
    container.appendChild(child)
    return child
  } }
}

function createKaraview () {
  const container = div(`white-space:nowrap;`)
  const white = append(div(``)).to(container)
  const blueContainer = append(div(`
    position: absolute;
    top: 0; left: 0; width: 540px; height: 540px;
    overflow: hidden;
  `)).to(container)
  const blue = append(div(`
    position: absolute;
    top: 0; left: 0; width: 960px; height: 540px;
  `)).to(blueContainer)


  function outline (max, min, color) {
    const out = [ ]
    for (let i = -max; i <= max; i += 0.5) {
      for (let j = -max; j <= max; j += 0.5) {
        if (Math.abs(i) < min && Math.abs(j) < min) continue
        out.push(`${i}px ${j}px 0 ${color}`)
      }
    }
    return out
  }

  const textFont = 'bold 59px kinnari,aozora mincho,serif'
  const measurer = append(div(`
    position: absolute;
    left: 0;
    top: 0;
    font: ${textFont};
    white-space: pre;
    color: transparent;
  `)).to(container)
  const englishText = append(div(`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 15px;
    font: 24px 'Avenir Next Condensed',sans-serif;
    font-weight: 500;
    color: white;
    text-shadow: 0 1px 3px black;
    text-align: center;
    -webkit-font-smoothing: antialiased;
  `)).to(container)
  const text = append(div(`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 366px;
    font: ${textFont};
    white-space: pre;
    color: transparent;
  `)).to(white)
  const textContent = append(div(`
    position: relative;
    color: white;
    text-shadow:
      ${outline(2,0.5,'black')};
  `)).to(text)
  const counter = append(div(`
    position: absolute;
    top: 0.2em;
    left: -1.25em;
    color: white;
    font-family: serif;
    text-shadow:
      ${outline(2,0.5,'black')};
  `)).to(text)
  counter.textContent = ''

  const translation = append(div(`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 462px;
    font: 30px Futura,sans-serif;
    color: transparent;
  `)).to(white)
  const translationContent = append(div(`
    position: relative;
    color: #DD7700;
    text-shadow:
      ${outline(2,0.5,'black')};
  `)).to(translation)

  const blueText = append(div(`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 366px;
    font: ${textFont};
    white-space: pre;
    color: transparent;
  `)).to(blue)
  const blueTextContent = append(div(`
    position: relative;
    color: #353433;
    text-shadow:
      ${outline(1.5,0.5,'white')},
      ${outline(3,1.5,'black')};
  `)).to(blueText)

  const blueTranslation = append(div(`
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 462px;
    font: 30px Futura,sans-serif;
    color: transparent;
  `)).to(blue)
  const blueTranslationContent = append(div(`
    position: relative;
    color: #353433;
    text-shadow:
      ${outline(1.5,0.5,'white')},
      ${outline(3,1.5,'black')};
  `)).to(blueTranslation)

  function setText (thai, english) {
    textContent.textContent = thai
    blueTextContent.textContent = thai
    translationContent.textContent = english
    blueTranslationContent.textContent = english
    const scaleX = Math.min(1, textContent.offsetWidth / translationContent.offsetWidth)
    translationContent.style.transform = `scaleX(${scaleX})`
    blueTranslationContent.style.transform = `scaleX(${scaleX})`
  }

  function setEnglish (text) {
    englishText.innerHTML = text
  }

  function setProgress (progress) {
    blueContainer.style.width = Math.min(960, Math.max(0, progress * 960)) + 'px'
  }

  function measure (text) {
    measurer.textContent = text
    return measurer.offsetWidth
  }

  function setOpacity (o) {
    container.style.opacity = o
  }

  function setCounter (t) {
    counter.textContent = t
  }

  return { element: container, setText, setProgress, setOpacity, measure, setEnglish, setCounter }
}

const cont = div(`
  background: #0f0;
  width: 960px;
  height: 540px;
  position: relative;
  display: inline-block;
  overflow: hidden;
  text-align: left;
`)

const karaview = createKaraview()
append(karaview.element).to(cont)
append(cont).to(document.body)

/*
karaview.setText('เพราะวันเวลาที่ผ่านมา', 'PRAW-WAN-VE-LA-TEE-PAAN-MA')
window.onmousemove = function (e) {
  karaview.setProgress((e.pageX - cont.offsetLeft) / 640)
}
*/

const rawData = {
  midi: require('!!arraybuffer-loader!./karaoke.mid'),
  lyrics: require('!!raw-loader!./lyrics-thai.txt').default,
  romanization: require('!!raw-loader!./lyrics-romanized.txt').default,
  english: require('!!raw-loader!./lyrics-english.txt').default,
  japanese: require('!!raw-loader!./lyrics-japanese.txt').default,
  songUrl: require('!!file-loader!./song.mp3').default
}
console.log(rawData)
const lyrics = rawData.lyrics.trim().split('\n')
const translations = rawData.romanization.trim().split('\n')

const w = (text) => !text ? '' : `<span style="display:inline-block;background:rgba(0,0,0,0.5);padding:0 8px 2px;border-radius:4px;">${text}</span>`
const englishRaw = (() => {
  if (!rawData.english) return [ ]
  return _.zip(
    rawData.english.trim().split('\n'),
    rawData.japanese.trim().split('\n')
  ).map(([ en, jp ]) => `${(en.match(/^\/+/) || [''])[0]}${
    en+jp
    ? w(`<div style="font-family:osaka,sans-serif;font-weight:300;">${jp}</div><div style="${jp?'font-size:72%':''};">${en.replace(/^\/*/, '')}</div>`)
    :''}`)
})()

const karaokeData = (() => {
  const MIDIFile = require('midifile')
  const MIDIEvents = require('midievents')
  const midi = new MIDIFile(rawData.midi)
  let currentPage = { start: 0, ticks: [ ] }
  const pages = [ currentPage ]
  for (const event of midi.getMidiEvents()) {
    if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_ON) {
      if (event.param1 === 59) {
        currentPage.ticks.push(event.playTime)
      }
      if (event.param1 === 50) {
        currentPage = { start: event.playTime, ticks: [ ] }
        pages.push(currentPage)
      }
    }
    if (event.subtype === MIDIEvents.EVENT_MIDI_NOTE_OFF) {
      if (event.param1 === 59) {
        currentPage.lastTick = event.playTime
      }
    }
  }
  invariant(pages.length === lyrics.length, 'Expected %d lines === %d pages', lyrics.length, pages.length)
  return _.zipWith(lyrics, pages, translations, (lyric, page, translation) => {
    const split = lyric.split('|')
    const ticks = [ ...page.ticks, page.lastTick ]
    invariant(split.length + 1 === ticks.length, 'Expected %s to have %s ticks', lyric, ticks.length)
    return { start: page.start, timing: ticks, lyrics: split, translation }
  })
})()

const englishData = _.zipWith(karaokeData.slice(0, englishRaw.length), englishRaw, (page, text) => {
  let leading = 0
  text = text.replace(/^\/+/, (a) => {
    leading = a.length * (60000 / 240)
    return ''
  })
  return { start: page.start - leading, text }
})

function resolver (values) {
  const domains = _.map(values, 0)
  return (t) => {
    const index = _.sortedIndex(domains, t) - 1
    if (index === -1) {
      const dx = (values[1][1] - values[0][1]) / (values[1][0] - values[0][0])
      const Δt = t - values[0][0]
      return values[0][1] + Δt * dx
    }
    const use = Math.min(index, values.length - 2)
    const dx = (values[use + 1][1] - values[use][1]) / (values[use + 1][0] - values[use][0])
    const Δt = t - values[index][0]
    return values[index][1] + Δt * dx
  }
}

assert.equal(resolver([ [ 5000, 50 ], [ 5100, 60 ] ])(4900), 40)
assert.equal(resolver([ [ 5000, 50 ], [ 5100, 60 ] ])(5000), 50)
assert.equal(resolver([ [ 5000, 50 ], [ 5100, 60 ] ])(5100), 60)
assert.equal(resolver([ [ 5000, 50 ], [ 5100, 60 ] ])(5200), 70)

const displayer = (() => {
  let currentIndex = -1
  let currentResolver
  let currentPage
  let currentStart, currentEnd
  let currentCounter

  let currentEnglishIndex = -1
  const englishStarts = _.map(englishData, 'start')

  function display (time) {
    updateKaraoke()
    updateEnglish()

    function updateKaraoke () {
      const index = (() => {
        for (let i = 0; i < karaokeData.length; i ++) {
          if (time >= karaokeData[i].start) {
            if (i + 1 >= karaokeData.length || time < karaokeData[i + 1].start) {
              return i
            }
          }
        }
        return 0
      })()
      if (currentIndex !== index) {
        currentIndex = index
        const page = karaokeData[index]
        karaview.setText(page.lyrics.join(''), page.translation)
        const width = karaview.measure(page.lyrics.join(''))
        const widths = [ 0 ]
        let acText = ''
        for (let i = 0; i < page.lyrics.length; i ++) {
          acText += page.lyrics[i]
          widths.push(karaview.measure(acText))
        }
        const map = [ ]
        for (let i = 0; i < page.timing.length; i ++) {
          const x = (480 - width / 2 + widths[i]) / 960
          map.push([ page.timing[i], x ])
        }
        currentPage = page
        currentResolver = resolver(map)
        currentStart = page.timing[0]
        currentEnd = page.timing[page.timing.length - 1]
      }
      if (currentResolver) {
        let sum = 0, count = 0
        for (let i = -5; i <= 10; i ++) {
          sum += currentResolver(time + i * 50)
          count += 1
        }
        karaview.setProgress(sum / count)
        karaview.setOpacity(
          Math.max(0, Math.min(1,
            Math.min(
              (time - currentStart) / 2000 + 2,
              (currentEnd - time) / 2000 + 2
            )
          ))
        )
        const beat = 60000 / 238
        const counter = (currentStart - currentPage.start > 4000
          ? (() => {
            if (time + 0 >= currentStart) return ''
            if (time + 0 >= currentStart - 1 * beat) return '' // '④③②①''
            if (time + 0 >= currentStart - 2 * beat) return '①' // '④③②①''
            if (time + 0 >= currentStart - 3 * beat) return '②' // '④③②①''
            if (time + 0 >= currentStart - 4 * beat) return '③' // '④③②①''
            return ''
          })()
          : ''
        )
        if (counter !== currentCounter) {
          currentCounter = counter
          karaview.setCounter(currentCounter)
        }
      }
    }

    function updateEnglish () {
      const englishIndex = _.sortedIndex(englishStarts, time) - 1
      if (currentEnglishIndex !== englishIndex) {
        karaview.setEnglish(englishData[englishIndex].text)
      }
    }
  }

  return { display }
})()

const audio = document.createElement('audio')
audio.controls = true
audio.src = rawData.songUrl
audio.load()
audio.style.marginTop = '16px'
audio.style.width = '960px'
document.body.appendChild(audio)

function frame () {
  displayer.display(audio.currentTime * 1000)
  requestAnimationFrame(frame)
}

requestAnimationFrame(frame)

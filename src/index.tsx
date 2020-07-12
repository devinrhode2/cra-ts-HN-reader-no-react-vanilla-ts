// import 'intersection-observer' // polyfill window.IntersectionObserver
import { IItem } from 'hacker-news-api-types'

const rootDiv = document.querySelector('#root') || document.body // Quiet TS

const config = {
  storyToLoadAtOnce: 30, // number of stories to request+render at once
  staggeringMs: 20, // ms to space out story requests by (since sending 30 at once seems foolish)
}

const sleep = (ms: number): Promise<number> =>
  new Promise((resolve) => setTimeout(resolve, ms))

interface Renderer {
  renderMoreStories: () => void
}

function createRenderer(storyIds: Array<number>): Renderer {
  const lastLoadedStoryIndex = 0
  const storiesContainer = document.querySelector('#stories') as Element
  if (typeof storiesContainer?.appendChild !== 'function') {
    throw new TypeError('missing #stories container element')
  }
  function addStoryLi(story: IItem): void {
    const storyLi = document.createElement('li')
    storyLi.innerHTML = `
      <h3>
        <a href="${story.url || '/404'}">
          ${story.title || 'ERROR: Missing story.title'}
        </a>
      </h3>
      <div>
        <span>
          ${story.by || 'ERROR: Missing story.by'}
          - 
          ${story.time || 'ERROR: Missing story.time'}
        </span>
      </div>
    `
    storiesContainer.append(storyLi)
  }
  function renderMoreStories(): void {
    console.log(
      `loading ${config.storyToLoadAtOnce} more past ${
        lastLoadedStoryIndex + 1
      }`
    )
    storyIds
      .slice(
        lastLoadedStoryIndex,
        lastLoadedStoryIndex + config.storyToLoadAtOnce
      )
      .map((id, index) => {
        const url = `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        return sleep(index * config.staggeringMs).then(() =>
          // eslint-disable-next-line promise/no-nesting
          fetch(url)
            .then((response) => response.json())
            .then(addStoryLi)
            .catch(() => {
              console.error(`failed to load ${url}`)
            })
        )
      })
  }
  return { renderMoreStories }
}

function init(): void {
  rootDiv.innerHTML = `
    <style>
      ul#stories > li h3 {
        margin-bottom: 5px
      }
    </style>
    <ul id="stories">
    </ul>
    <h3 id="load-more-detector">Loading stories...</h3>
  `
  fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
    .then((response) => response.json())
    .then((storyIds: Array<number>) => {
      const renderer = createRenderer(storyIds)
      new IntersectionObserver((entries) => {
        if (entries.length !== 1)
          console.error('expected only one observer, but have:', entries)
        if (entries[0].isIntersecting) {
          console.log('calling renderMoreStories')
          renderer.renderMoreStories()
        }
      }).observe(document.querySelector('#load-more-detector') as Element)
      return renderer
    })
    .catch(() => {
      ;(document.querySelector('#stories') as Element).innerHTML =
        'Failed to load story ids. Try reloading page!'
    })
}

init()

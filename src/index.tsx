import './index.css'

function main() {
  fetch('https://hacker-news.firebaseio.com/v0/newstories.json')
    .then((response) => response.json())
    .then((stories) => {
      // @ts-expect-error
      document.querySelector('#root').innerHTML = `
        <div id="stories">
          ${JSON.stringify(stories, null, 2)}
        </div>
      `
    })
}
main()

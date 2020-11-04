const RANDOM_QUOTE_API_URL = 'http://cors.io/?http://api.quotable.io/random'
const textarea      = document.querySelector('.textarea')
const overlayEl     = document.querySelector('.overlay')
const startMsg      = document.querySelector('.start_msg')
const endMsg        = document.querySelector('.end_msg')
const wpmEls        = document.querySelectorAll('.wpm') 
const accuracyEl    = document.querySelector('.accuracy_perc') 
let content = [] 
let original = [] 
let index = 0 
let start = false 
let charCount = 0 
let accuracy = 0 
let totalTime 
let startTime
let wordsPerMin 
let lastInveral 
let typedChars 
const skipKeys = [ 'Enter', 'Escape', 'Tab', 'Shift', 'Control',
                    'Alt', 'Meta', 'F1', 'F2', 'F3', 'F4', 'F5', 
                    'F11', 'F12', 'F6', 'F7', 'F8', 'F9', 'F10', 
                    'Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown', 'NumLock']

function calculateTime() {
    totalTime = Date.now() - startTime 
}

function calculateWPM() {
    wordsPerMin = (charCount / 5) / (totalTime / 60)
    wordsPerMin = Math.round(wordsPerMin * 1000)
    wpmEls.forEach(el => el.textContent = wordsPerMin)
}

function validKey(key) {
    const regex = /^[\w "',;![\]()\.\-?]+$/i
    return (start && regex.test(key))
}    

function init() {
    content = [] 
    original = [] 
    index = 0 
    start = true 
    accuracy = 0 
    totalTime = 0 
    wordsPerMin = 0 
    typedChars = 0
    charCount = 0 
    startTime = Date.now() 
    clearInterval(lastInveral)
    lastInterval = setInterval(calculateTime, 1000);
    overlayEl.style.display = 'none'
    accuracyEl.textContent = '0.00'
    wpmEls.forEach(el => el.textContent = wordsPerMin)
    fetch(RANDOM_QUOTE_API_URL)
        .then(res => res.json())
        .then(res => {
            [...content] = res.content 
            original = [...content] 
            content[0] = `<span class="green__block">${content[0]}</span>`
            textarea.innerHTML = content.join('')
        }) 
}

window.addEventListener('keyup', (e) => {
    if (skipKeys.includes(e.key)) return
    if(validKey(e.key)) {
        if(index === content.length) {
            start = false 
            calculateWPM()
            overlayEl.style.display = 'flex'
            startMsg.style.display = 'none'
            endMsg.style.display = 'block'
            return 
        }
    }
})

window.addEventListener('keydown', e => {
    if (skipKeys.includes(e.key)) return
    if(validKey(e.key)) {
        if(original[index] === e.key) {
            content[index] = `<span class="green">${e.key}</span>`
            if(content[index + 1]) {
                content[index + 1] = `<span class="green__block">${content[index + 1]}</span>`
            }
            index++ 
            charCount++
            if(e.key === ' ') {
               calculateWPM()
            }
            textarea.innerHTML = content.join('')
        } else {
            content[index] = `<span class="red__block">${original[index]}</span>`
            textarea.innerHTML = content.join('')
        }
        typedChars++
        accuracyEl.textContent = ((charCount / typedChars) * 100).toFixed(2)
    }
})

document.querySelector('.button').addEventListener('click', () => {
    start = true
    init();
})
document.querySelector('.special_button').addEventListener('click', () => {
    start = true
    init();
}) 
document.querySelector('.restart_img').addEventListener('click', () => {
    start = true
    init();
})  


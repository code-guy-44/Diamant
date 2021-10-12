import { highScoreArrayType } from './components/HighScores/types'

const defaultDeckState = [
    { id: 1, label: '1' }, { id: 2, label: '2' }, { id: 3, label: '3' },
    { id: 4, label: '4' }, { id: 5, label: '5' }, { id: 6, label: '6' },
    { id: 7, label: '7' }, { id: 8, label: '8' }, { id: 9, label: '9' },
    { id: 10, label: '10' }, { id: 11, label: '11' }, { id: 12, label: '12' },
    { id: 13, label: '13' }, { id: 14, label: '14' }, { id: 15, label: '15' },
    { id: 16, label: 'snake' }, { id: 17, label: 'snake' }, { id: 18, label: 'snake' },
    { id: 19, label: 'spider' }, { id: 20, label: 'spider' }, { id: 21, label: 'spider' },
    { id: 22, label: 'falling rock' }, { id: 23, label: 'falling rock' }, { id: 24, label: 'falling rock' },
    { id: 25, label: 'lava' }, { id: 26, label: 'lava' }, { id: 27, label: 'lava' },
    { id: 28, label: 'zombie' }, { id: 29, label: 'zombie' }, { id: 30, label: 'zombie' }
]

export const getShuffledDeck = () => {
    const deck = [...defaultDeckState]
    for (var i = deck.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1))
        var temp = deck[i]
        deck[i] = deck[j]
        deck[j] = temp
    }
    return deck
}

export const getHighScoresToDisplay = (highScores: highScoreArrayType) =>{
        return highScores.length === 10 ?
        highScores
        :
        highScores.concat(Array.from(Array(10 - highScores.length).keys()).map(() => ({ initials: 'ABC', score: 0 })))
}

export const getHighScoreIndex = (score: number, highScores: highScoreArrayType) => highScores.findIndex(v => v.score <= score)

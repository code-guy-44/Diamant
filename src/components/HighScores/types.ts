export type highScoreType = {
    initials: string,
    score: number
}

export type highScoreArrayType = highScoreType[]

export type HighScoreProps = {
    highScores: highScoreType[]
}
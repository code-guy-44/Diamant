import { Fragment, useState } from 'react'
import HighScores from '../HighScores/View'
import { getHighScoresToDisplay, getShuffledDeck, getHighScoreIndex } from '../../helpers'
import { CardType } from './types'
import { Alert, Button, ButtonGroup, Card, Drawer, Grid, TextField, Typography } from '@mui/material'
import { useStyles } from './Styles'

const MainLayout = () => {
  const classes = useStyles()
  const [deckState, updateDeckState] = useState(getShuffledDeck())
  const [currentAlert, updateCurrentAlert] = useState('')
  const [isGameInProgress, updateGameInProgress] = useState(false)
  const [cardDisplayed, updateCardDisplayed] = useState({ id: 0, label: 'none' })
  const [hazardsPicked, updateHazardsPicked] = useState<string[]>([])
  const [currentScore, updateCurrentScore] = useState(0)
  const [showHighScores, updateShowHighScores] = useState(false)
  const [highScores, updateHighScores] = useState(JSON.parse(localStorage.getItem('highScores') || '[]'))
  const [highScoreInitials, updateHighScoreInitials] = useState('')
  const [highScoreIndex, updateHighScoreIndex] = useState(-1)
  const highScoresToDisplay = getHighScoresToDisplay(highScores)

  const handleClickToPlay = () => {
    updateGameInProgress(true)
  }

  const handleCardDraw = () => {
    const deckCopy = [...deckState]
    const cardToShow: CardType | undefined = deckCopy.pop()
    if (cardToShow) {
      updateCardDisplayed(cardToShow)
      const { id, label } = cardToShow
      if (id > 15) {
        updateHazardsPicked([...hazardsPicked, label])
        if (hazardsPicked.includes(label)) {
          updateCurrentAlert(`You lose b/c you picked two ${label}s`)
          updateGameInProgress(false)
        }
      } else {
        updateCurrentScore(currentScore + id)
      }
    }
    updateDeckState(deckCopy)
  }

  const initializeNewGame = () => {
    updateDeckState(getShuffledDeck())
    updateHazardsPicked([])
    updateCardDisplayed({ id: 0, label: 'none' })
    updateGameInProgress(false)
    updateCurrentScore(0)
    updateCurrentAlert('')
    updateHighScores(JSON.parse(localStorage.getItem('highScores') || '[]'))
    updateHighScoreInitials('')
    updateHighScoreIndex(-1)
  }

  const handleCashOut = () => {
    const highScoreIndex = getHighScoreIndex(currentScore, highScoresToDisplay)
    if (highScoreIndex === -1) {
      updateCurrentAlert('You Did Not Qualify for a High Score')
    } else {
      updateCurrentAlert('Congratulations, you earned a high score! Enter your initials to join the leaderboard.')
      updateHighScoreIndex(highScoreIndex)
    }
  }

  const handleSaveToScoreBoard = () => {
    const highScoresCopy = [...highScoresToDisplay]
    highScoresCopy.splice(highScoreIndex, 0, { initials: highScoreInitials, score: currentScore })
    localStorage.setItem('highScores', JSON.stringify(highScoresCopy.slice(0, 10)))
    updateHighScores(highScoresCopy.slice(0, 10))
    initializeNewGame()
    updateShowHighScores(true)
  }

  const handleAlertClose = (alert: string) => {
    initializeNewGame()
  }

  const showLastCard = cardDisplayed.id > 0
  const hasPoints = currentScore > 0
  const isLossMessageDisplayed = currentAlert.includes('lose')
  const isHighScoreMessageDisplayed = currentAlert.includes('high score')

  return (

    <Grid className={classes.mainContainer} container>

      <Grid item xs={12}>
        <Typography variant='h3'>
          Diamant
        </Typography>

        <Typography color='textSecondary' variant='h5'>
          {hasPoints ? `Current Score: ${currentScore}` : ``}
        </Typography>
      </Grid>

      <Grid sx={{ m: 1 }} item xs={12} >

        <ButtonGroup variant='contained' >
          {!currentAlert && !isGameInProgress && (
            <Button variant='outlined' onClick={handleClickToPlay}> Click to Play </Button>
          )}

          {((!currentAlert && isGameInProgress && !hasPoints) || isLossMessageDisplayed || isHighScoreMessageDisplayed) && (
            <Button variant='outlined' onClick={initializeNewGame}> Start Over </Button>
          )}

          {!currentAlert && isGameInProgress && hasPoints && (
            <Button variant='outlined' onClick={handleCashOut}> Take Money and Run </Button>
          )}

          <Button variant='outlined' onClick={() => updateShowHighScores(true)}> See High Scores</Button>
        </ButtonGroup>

      </Grid>

      <Grid sx={{ m: 1 }} item xs={12} >
        {!currentAlert && isGameInProgress && (
          <Button variant='contained' size='large' onClick={handleCardDraw}> Draw Card </Button>
        )}
      </Grid>

      <Grid sx={{ m: 1 }} item xs={12}>
        {showLastCard && (
          <Fragment>
            <Typography variant='h5'>
              You drew:
            </Typography>

            <Card className={classes.card}>
              <Typography variant='h4'>
                {cardDisplayed.label}
              </Typography>
            </Card>
          </Fragment>
        )}
      </Grid>

      <Grid sx={{ m: 1 }} item xs={12}>
        {currentAlert && (
          <Alert
            severity={currentAlert.includes('lose') ? 'error' : 'success'}
            onClose={() => isHighScoreMessageDisplayed ? undefined : handleAlertClose(currentAlert)}
          >
            {currentAlert}
            {isHighScoreMessageDisplayed && (
              <Grid sx={{ m: 1 }} item xs={12}>
                <TextField size='small' label='Initials' variant='outlined' value={highScoreInitials} onChange={e => updateHighScoreInitials(e.target.value)} />
                <Button disabled={highScoreInitials.length < 2} sx={{ m: 1 }} size='small' variant='contained' onClick={handleSaveToScoreBoard}>Save to Scoreboard</Button>
              </Grid>
            )}

          </Alert>
        )}

        {hazardsPicked.length > 0 && (
          <div className={classes.hazardContainer}>
            <Typography variant="h5" color='textPrimary'>
              Hazards Collected:
            </Typography>
            <Grid container item xs={12} justifyContent='center'>
              {hazardsPicked.map((hazardName: string, i) => (
                <Card className={classes.hazardCards} key={i}>
                  <Typography variant='body2' color='textPrimary'>
                    {hazardName}
                  </Typography>
                </Card>
              ))}
            </Grid>
          </div>
        )}

      </Grid>

      <Drawer anchor={'right'} open={showHighScores} onClose={() => updateShowHighScores(false)}>
        <HighScores highScores={highScoresToDisplay} />
      </Drawer>

    </Grid>

  );
}

export default MainLayout

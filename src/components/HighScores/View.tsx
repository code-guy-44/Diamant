import { Fragment } from 'react'
import { Grid, Typography } from '@mui/material'
import { HighScoreProps } from './types'
import { useStyles } from './Styles'

const HighScores = ({ highScores }: HighScoreProps) => {
    const classes = useStyles()

    return (
        <Grid className={classes.mainContainer} container>
            <Typography sx={{ m: 2 }} className={classes.leaderBoardHeader} color='textSecondary' variant='h5'>
                Leader Board
            </Typography>
            {highScores.map((obj, i) => (
                <Fragment>
                    <Grid item xs={3}>
                        {`${i + 1}.`}
                    </Grid>
                    <Grid item xs={6}>
                        {obj.initials}
                    </Grid>
                    <Grid item xs={3}>
                        {obj.score}
                    </Grid>
                </Fragment>
            ))}
        </Grid>
    )
}

export default HighScores


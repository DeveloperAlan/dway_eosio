import React from 'react'

import score from './Score/Score'

const Scores = ({ scores, deletescore, editscore, likescore }) => scores.map(score => (
  <score
    score={score}
    key={JSON.stringify(score._id)}
  />
))
Scores.displayName = 'Scores' // Tell React Dev Tools the component name

export default Scores

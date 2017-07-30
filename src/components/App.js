import React from 'react'
import Navbar from './Navbar'
import PreviewContainer from '../containers/PreviewContainer'
import RepoSelectorContainer from '../containers/RepoSelectorContainer'
import { Grid } from 'semantic-ui-react'

export default class App extends React.Component {
  render () {
    return (
      <div>
        <Navbar />
        <Grid style={{maxWidth: 1200, margin: '0 auto'}}>

          <Grid.Column
            mobile={16}
            tablet={16}
            computer={6}
            style={{maxWidth: 500, margin: '0 auto'}}>
            <RepoSelectorContainer />
          </Grid.Column>

          <Grid.Column mobile={16} tablet={16} computer={10}>
            <PreviewContainer />
          </Grid.Column>

        </Grid>
      </div>
    )
  }
}

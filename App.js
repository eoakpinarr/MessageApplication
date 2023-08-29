import React from 'react'
import StackNavigator from './src/StackNavigator'
import { UserContext } from './src/UserContext'

const App = () => {

  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  )
}

export default App
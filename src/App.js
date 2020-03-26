import React, { useState, useCallback } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { ME, SEARCH_REPOSITORIES } from './graphql'

const DEFAULT_STATE = {
  first: 5,
  after: null,
  last: null,
	before: null,
	query: "フロントエンドエンジニア"
}

const App = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const { query, first, last, before, after } = state
  console.log({ query })

  const handleChange = useCallback(e => {
    setState({
      ...state,
      query: e.target.value,
    })
  }, [state])

  const handleSubmit = e => {
    e.preventDefault()
  }

  return (
    <ApolloProvider client={client} >
      <form onSubmit={handleSubmit}>
        <input value={query} onChange={handleChange} />
      </form>

      <Query
        query={SEARCH_REPOSITORIES}
        variables={{ query, first, last, before, after }}
      >
        {
          ({ loading, error, data }) => {
            if (loading) return `Loading...`
            if (error) return `Error! ${error.message}`

            console.log(data.search)
            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1 ? 'Reposotory' : 'Repositories'
            const title = `Github Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
            return (
              <h3>{title}</h3>
            )
          }
        }
      </Query>
    </ApolloProvider>
  )
}

export default App

import React, { useState, useCallback } from 'react'
import { ApolloProvider } from 'react-apollo'
import { Query } from 'react-apollo'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const PER_PAGE = 5
const DEFAULT_STATE = {
  first: PER_PAGE,
  after: null,
  last: null,
	before: null,
	query: "フロントエンドエンジニア"
}

const App = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const { query, first, last, before, after } = state

  const handleChange = useCallback(e => {
    setState({
      ...state,
      query: e.target.value,
    })
  }, [state])

  const handleSubmit = e => {
    e.preventDefault()
  }

  const goNext = useCallback(search => {
    setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      before: null,
      last: null,
      query: "フロントエンドエンジニア"
    })
  }, [])

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

            console.log({ pageInfo: data.search.pageInfo })
            const search = data.search
            const repositoryCount = search.repositoryCount
            const repositoryUnit = repositoryCount === 1 ? 'Reposotory' : 'Repositories'
            const title = `Github Repositories Search Results - ${repositoryCount} ${repositoryUnit}`
            return (
              <>
                <h3>{title}</h3>
                <ul>
                  {
                    search.edges.map(edge => {
                      const node = edge.node
                      return (
                        <li key={node.id}>
                          <a target="_blank" rel="noopener noreferrer" href={node.url}>{node.name}</a>
                        </li>
                      )
                    })
                  }
                </ul>
                {
                  search.pageInfo.hasNextPage ?
                    <button onClick={() => goNext(search)}>Next</button> :
                    null
                }
              </>
            )
          }
        }
      </Query>
    </ApolloProvider>
  )
}

export default App

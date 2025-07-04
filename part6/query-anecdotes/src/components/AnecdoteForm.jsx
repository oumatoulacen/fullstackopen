import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import anecdoteContext from "../anecdoteContext"

import { createAnecdote } from '../requests'
import { asObject } from "../utils/helpers"


const AnecdoteForm = () => {
  const [ notification, notificationDispatch ] = useContext(anecdoteContext)
  const queryClient = useQueryClient()
  const anecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    // onSuccess: () => {
    //   queryClient.invalidateQueries({queryKey: ['anecdotes']})
    // }
    onSuccess: (anecdote) => { // more efficient than invalidateQueries
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(anecdote))
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: `you created '${anecdote.content}'` })
    },
    onError: (error) => {
      console.error('Error creating anecdote:', error)
      notificationDispatch({ type: 'SET_NOTIFICATION', payload: error.response.data.error })
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    anecdoteMutation.mutate(asObject(content))
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

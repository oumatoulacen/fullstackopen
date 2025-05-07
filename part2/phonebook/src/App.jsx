import { useState, useEffect } from 'react'
import phonebookService from './services/phonebooks'

import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('effect')
    phonebookService
      .getAllPhonebooks()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error('Error fetching phonebooks:', error)
        alert('Failed to fetch phonebooks. Please try again later.')
      })
    
  }
  , [])

  console.log('render', persons.length, 'persons')


  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      { searchTerm && <Filter persons={persons} searchTerm={searchTerm} /> }
      <h2>Add a new</h2>
      <PersonForm
        persons={persons}
        newName={newName}
        newNumber={newNumber}
        setPersons={setPersons}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} setPersons={setPersons} />
    </div>
  )
}


export default App
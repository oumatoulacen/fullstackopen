import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null })

  useEffect(() => {
    personService.getAll()
      .then((initialPersons) => { setPersons(initialPersons) })
      .catch((error) => {
        notifyWith(error.response.data.error, true)
      })
  }, [])

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  const clearForm = () => {
    setNewName('')
    setNewNumber('')
  }

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const updatePerson = (person) => {
    const ok = window.confirm(
      `${newName} is already added to phonebook, replace the old number with a new one?`
    )
    if (ok) {
      personService
        .update({ ...person, number: newNumber })
        .then((updatedPerson) => {
          setPersons(
            persons.map((p) => (p.id !== person.id ? p : updatedPerson))
          )
          notifyWith(`Phonenumber of ${updatedPerson.name} updated!`)
        })
        .catch((error) => {
          notifyWith(error.response.data.error, true)
        })
        .finally(() => {
          clearForm()
        })
    }
  }

  const onAddNew = (event) => {
    event.preventDefault()

    // Check if the number already exists
    if (newNumber.trim() === '') {
      notifyWith('Please provide a number', true)
      console.log('Number is empty')
      return
    }
    if (newName.trim() === '') {
      notifyWith('Please provide a name', true)
      return
    }

    if (persons.find((p) => p.number === newNumber)) {
      notifyWith(
        `${newNumber} is already added to phonebook`,
        true
      )
      clearForm()
      return
    }
    const existingPerson = persons.find((p) => p.name === newName)
    if (existingPerson) {
      updatePerson(existingPerson)
      return
    }

    console.log('Adding new person, name', newName, "num", newNumber)

    personService
      .create({ name: newName, number: newNumber })
      .then((createdPerson) => {
        setPersons(persons.concat(createdPerson))
        notifyWith(`Added ${createdPerson.name}`)
      })
      .catch((error) => {
        console.log('At catch: ', error)
        notifyWith(error.response.data.error, true)
      })
      .finally(() => {
        clearForm()
      })
  }

  const onRemove = (person) => {
    const ok = window.confirm(`Delete ${person.name} ?`)
    if (ok) {
      personService
        .remove(person.id)
        .then(() => setPersons(persons.filter((p) => p.id !== person.id)))
        .catch((error) => {
          notifyWith(error.response.data.error, true)
        })

      notifyWith(`Deleted ${person.name}`)
    }
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />
      <Filter filter={filter} setFilter={setFilter} />

      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onAddNew={onAddNew}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} onRemove={onRemove} />
    </div>
  )
}

export default App
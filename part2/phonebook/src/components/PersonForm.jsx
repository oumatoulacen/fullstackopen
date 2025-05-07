import phonebookService from "../services/phonebooks"

export default function PersonForm({
  persons, newName, newNumber, setPersons, setNewName, setNewNumber
  , setNotification
}) {


  const handleSubmit = (event) => {
    event.preventDefault() // Prevent the default form submission behavior

    // Check if the name already exists
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      setNotification({message:`${newName} is already added to phonebook`, type:'error'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }

    // Check if newNumber is valid
    if (!/^[\d-]+$/.test(newNumber)) {
      setNotification({message: 'Invalid number format. Please enter a valid phone number.', type:'error'})
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }

    // Check if the number already exists
    if (persons.some(person => person.number === newNumber)) {
      if (window.confirm(`${newNumber} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.number === newNumber)
        const updatedPerson = { ...personToUpdate, name: newName }

        phonebookService
          .updatePhonebook(personToUpdate.id, updatedPerson)
          .then((response) => {
            setNotification({message: `Updated existing number ${newNumber} with new name ${newName}`, type: 'info'})
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            // Update the person in the state;
            setPersons(persons.map(person => person.id !== personToUpdate.id ? person : response))
          })
          .catch((error) => {
            console.error('Error updating person:', error)
            setNotification({message: 'Failed to update person. Please try again.', type: 'error'})
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
        setNewNumber('')
        setNewName('')

        return
      }
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    // Add the new person to the list/server
    phonebookService
      .createPhonebook(personObject)
      .then((response) => {
        setPersons(persons.concat(response))
        setNotification({ message: `Added ${newName} with number ${newNumber}`, type: 'info'}) 
        setTimeout(() => {
          setNotification(null)
        }, 5000)
        
      })
      .catch((error) => {
        console.error('Error adding person:', error)  
        setNotification({message: 'Failed to add person. Please try again.', type: 'error'})
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })

    // Clear the input fields
    setNewNumber('')
    setNewName('')
  }


  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

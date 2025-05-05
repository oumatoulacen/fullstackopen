
export default function PersonForm({persons, newName, newNumber, setPersons, setNewName, setNewNumber}) {
    const handleSubmit = (event) => {
        event.preventDefault()
        const personObject = {
          name: newName,
          number: newNumber,
        }
    
        // Check if the name already exists
        if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
          alert(`${newName} is already added to phonebook`)
          return
        }
    
        // Check if the name is empty
        if (newName === '') {
          alert('Name cannot be empty')
          return
        }
    
        // Validate name length and characters
        if (newName.length < 3) {
          alert('Name must be at least 3 characters long')
          return
        }
        if (newName.length > 20) {
          alert('Name must be less than 20 characters long')
          return
        }
        if (!/^[a-zA-Z\s]+$/.test(newName)) {
          alert('Name can only contain letters and spaces')
          return
        }
    
        // Check if the number is empty
        if (newNumber === '') {
          alert('Number cannot be empty')
          return
        }
    
        // Validate number length and characters
        if (newNumber.length < 7) {
          alert('Number must be at least 7 digits long')
          return
        }
        if (newNumber.length > 15) {
          alert('Number must be less than 15 digits long')
          return
        }
        if (!/^[\d-]+$/.test(newNumber)) {
          alert('Number can only contain digits')
          return
        }
        // Check if the number already exists
        if (persons.some(person => person.number === newNumber)) {
          alert(`${newNumber} is already added to phonebook`)
          return
        }
    
        // Add the new person to the list
        setPersons(persons.concat(personObject))
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

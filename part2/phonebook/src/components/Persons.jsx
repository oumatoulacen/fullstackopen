import phonebookService from "../services/phonebooks";

export default function Persons({persons, setPersons}) {
  const deletePhonebook = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
        .deletePhonebook(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
          alert('Failed to delete person. Please try again.');
        });
    }
  }
  
  return (
    <ul>
        {persons.map((person) => (
        <li key={person.name}>
            {person.name} {person.number}
            <button onClick={() => deletePhonebook(person.id, person.name)}>Delete</button>
        </li>
        ))}
    </ul>
  )
}

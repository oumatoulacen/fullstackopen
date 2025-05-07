import phonebookService from "../services/phonebooks";

export default function Persons({persons, setPersons, setNotification}) {
  const deletePhonebook = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phonebookService
        .deletePhonebook(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setNotification({message: `Deleted ${name}`, type: 'info'});
          setTimeout(() => {
            setNotification(null);
          }, 5000);
        })
        .catch((error) => {
          console.error('Error deleting person:', error);
          setNotification({message: `Information of ${name} has already been removed from server`, type: 'error'});
          setTimeout(() => {
            setNotification(null);
          }, 5000);
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


export default function Filter({ persons, searchTerm }) {
    return (
        <div>
            <h4>Filtered Numbers</h4>
            <ul>{
                persons
                    .filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(person => (
                        <li key={person.name}>
                            {person.name} {person.number}
                        </li>
                    ))}
            </ul>
        </div>
    )
}

import React, { useState, useEffect } from 'react';

// Define the EmployeeList component
export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Editing status

    // An effect hook to fetch employee data when the component runs
    useEffect(() => {
        getEmployees().then(setEmployees);
    }, []);

    // Fetch all employee data from the database
    async function getEmployees() {
        return fetch("/employees").then(response => response.json());
    }

    // Create new employee
    async function createEmployee(name, value) {
        return fetch("/employees", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    // Update existing employee
    async function updateEmployee(name, value) {
        return fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    // Handles the form used for editing employees
    function handleEdit(name, value) {
        setName(name);
        setValue(value);
        setIsEditing(true);
    }

    // Handles the form submission
    function handleSubmit(e) {
        e.preventDefault();

        // Assigns a particular action based on user selection
        const action = isEditing ? updateEmployee : createEmployee;

        // Action is performed, then the employee list is refreshed upon completion
        action(name, value).then(() => { 
            getEmployees().then(setEmployees);
            setIsEditing(false);
            setName('');
            setValue('');
        });
    }

    // Render the list of employees with actions to be performed
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                <input type="text" value={value} onChange={e => setValue(e.target.value)} required />
                <button type="submit">{isEditing ? 'Update' : 'Create'} Employee</button>
            </form>
            <ul>
                {employees.map(employee => (
                    <li key={employee.name}>
                        {employee.name}: {employee.value}
                        <button onClick={() => handleEdit(employee.name, employee.value)}>Edit</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

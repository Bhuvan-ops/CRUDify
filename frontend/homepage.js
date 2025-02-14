const userForm = document.getElementById('userForm');
const userIdField = document.getElementById('userId');
const userNameField = document.getElementById('userName');
const userEmailField = document.getElementById('userEmail');
const userAgeField = document.getElementById('userAge');
const userTableBody = document.getElementById('userTable').getElementsByTagName('tbody')[0];

async function fetchUsers() {
    const response = await fetch('/users');
    const users = await response.json();
    userTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>
            <td>
                <button class="edit" onclick="editUser('${user._id}')">Edit</button>
                <button class="delete" onclick="deleteUser('${user._id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

userForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userData = {
        name: userNameField.value,
        email: userEmailField.value,
        age: userAgeField.value
    };

    const userId = userIdField.value;
    let response;

    if (userId) {
        response = await fetch(`/users/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
    } else {
        response = await fetch('/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
    }

    const result = await response.json();
    if (response.ok) {
        resetForm();
        fetchUsers();
    } else {
        alert(result.message || 'An error occurred');
    }
});

async function editUser(id) {
    fetch(`/users/${id}`)
        .then(response => response.json())
        .then(user => {
            userNameField.value = user.name;
            userEmailField.value = user.email;
            userAgeField.value = user.age;
        });
}

async function deleteUser(id) {
    console.log(id)
    if (confirm('Are you sure you want to delete this user?')) {
        const response = await fetch(`/users/${id}`, { method: 'DELETE' });
        if (response.ok) {
            fetchUsers();
        } else {
            console.log(response)
            alert('An error occurred while deleting the user.');
        }
    }
}

async function resetForm() {
    userForm.reset();
    userIdField.value = '';
    userNameField.value = '';
    userEmailField.value = '';
    userAgeField.value = '';
}

async function getUserById(id) {
    const response = await fetch(`/users/${id}`);
    
    if (response.ok) {
        const user = await response.json();
        
        userIdField.value = user.id;
        userNameField.value = user.name;
        userEmailField.value = user.email;
        userAgeField.value = user.age;
    } else {
        alert('User not found');
    }
}

searchButton.addEventListener('click', function () {
    const searchId = searchUserIdField.value.trim();

    if (searchId) {
        getUserById(searchId);
    } else {
        alert('Please enter a user ID to search');
    }
});

fetchUsers();

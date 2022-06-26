$(async function () {
    await getTableWithUsers()
})

const allRoles = fetch(`/api/roles`)
let allRolesArr = []
allRoles
    .then(roles => roles.json())
    .then(roles => {
        roles.forEach(r => {
            allRolesArr[r.id] = r.roleName
            document.getElementById('rolesForm').append(new Option(r.roleName, r.id))
        })
    })
const newUserTab = document.getElementById('newUserTab')
const defaultUserForm = document.getElementById('defaultFormGroup')

const fetchParams = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Referer': null
    },
    url: '/api/users'
}

function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    fetch(fetchParams.url)
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let rolesString = user.roles.map(role => `<p>${role.roleName}</p>`).join('')
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${rolesString}</td>
                            <td>
                                <div class="modal fade" id="editModal${user.id}" tabindex="-1" role="dialog" aria-labelledby="defaultModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                
                                            <div class="modal-body">
                                            </div>
                                
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                        data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="submit" 
                                                        class="btn btn-primary"
                                                        data-toggle="modal"
                                                        id="${user.id}"
                                                        onclick="editUser(${user.id})">
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onclick="editUserModal(${user.id})" id="editUser" data-userid="${user.id}" data-action="edit" class="btn btn-primary" 
                                data-toggle="modal" data-target="#editModal${user.id}">Edit</button>
                            </td>
                            <td>
                                <div class="modal fade" id="deleteModal${user.id}" tabindex="-1" role="dialog" aria-labelledby="defaultModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                
                                            <div class="modal-header">
                                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                
                                            <div class="modal-body">
                                            </div>
                                
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-secondary"
                                                        data-dismiss="modal">
                                                    Close
                                                </button>
                                                <button type="submit" class="btn btn-primary btn-danger"
                                                        data-toggle="modal"
                                                        id="${user.id}"
                                                        onclick="deleteUser(${user.id})">
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="button" onclick="deleteUserModal(${user.id})" id="deleteUser" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#deleteModal${user.id}">Delete</button>
                            </td>
                        </tr>
                )`;

                table.append(tableFilling);
            })
        })
}

function editUserModal(userId) {
    let userModal = document.getElementById('editModal' + userId)
    let userModalBody = userModal.getElementsByClassName('modal-body')[0]
    userModalBody.append(defaultUserForm)
    document.getElementById('idForm').parentNode.hidden = false

    fetch(fetchParams.url + '/' + userId)
        .then(dbUser => dbUser.json())
        .then(jsonUser => {
                document.getElementById('idForm').value = jsonUser.id
                $("#idForm").prop('disabled', false)
                document.getElementById('firstNameForm').value = jsonUser.firstName
                $("#firstNameForm").prop('disabled', false)
                document.getElementById('lastNameForm').value = jsonUser.lastName
                $("#lastNameForm").prop('disabled', false)
                document.getElementById('ageForm').value = jsonUser.age
                $("#ageForm").prop('disabled', false)
                document.getElementById('emailForm').value = jsonUser.email
                $("#emailForm").prop('disabled', false)
                document.getElementById('passwordForm').value = jsonUser.password
                $("#passwordForm").prop('disabled', false)
                $("#rolesForm").prop('disabled', false)
            }
        )
    defaultUserForm.hidden = false
    $("#modalEdit").modal("show")
}

function editUser(userId) {
    let firstNameNew = document.getElementById('firstNameForm').value
    let lastNameNew = document.getElementById('lastNameForm').value
    let ageNew = document.getElementById('ageForm').value
    let emailNew = document.getElementById('emailForm').value
    let passwordNew = document.getElementById('passwordForm').value
    let rolesNew = document.getElementById('rolesForm')

    let newUser = {
        firstName: firstNameNew,
        lastName: lastNameNew,
        age: ageNew,
        email: emailNew,
        password: passwordNew,
        roles: [].filter
            .call(rolesNew.options, option => option.selected)
            .map(function (r) {
                return {
                    'id': r.value,
                    'roleName': r.text
                }
            })
    }
    fetch(fetchParams.url + `/` + userId, {
        method: 'PATCH',
        headers: fetchParams.head,
        body: JSON.stringify(newUser)
    })
        .then(data => {
            if (data.status === 200) {
                document.getElementById('firstNameForm').value = ''
                document.getElementById('lastNameForm').value = ''
                document.getElementById('ageForm').value = ''
                document.getElementById('emailForm').value = ''
                document.getElementById('passwordForm').value = ''
                $('.modal-backdrop').remove();
                defaultUserForm.hidden = true
                getTableWithUsers()
                document.getElementById('allUsersTab').click()
            }
        })
        .catch(
            error => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            <b>Что-то пошло не так!</b>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                document.getElementById('defaultFormGroup').insertAdjacentHTML('beforebegin', alert)
            })
}

// удаляем юзера из модалки удаления
function deleteUserModal(userId) {
    let userModal = document.getElementById('deleteModal' + userId)
    let userModalBody = userModal.getElementsByClassName('modal-body')[0]
    userModalBody.append(defaultUserForm)
    document.getElementById('idForm').parentNode.hidden = false

    fetch(fetchParams.url + '/' + userId)
        .then(dbUser => dbUser.json())
        .then(jsonUser => {
                document.getElementById('idForm').value = jsonUser.id
                $("#idForm").prop('disabled', true)
                document.getElementById('firstNameForm').value = jsonUser.firstName
                $("#firstNameForm").prop('disabled', true)
                document.getElementById('lastNameForm').value = jsonUser.lastName
                $("#lastNameForm").prop('disabled', true)
                document.getElementById('ageForm').value = jsonUser.age
                $("#ageForm").prop('disabled', true)
                document.getElementById('emailForm').value = jsonUser.email
                $("#emailForm").prop('disabled', true)
                document.getElementById('passwordForm').value = jsonUser.password
                $("#passwordForm").prop('disabled', true)
                $("#rolesForm").prop('disabled', true)
            }
        )
    defaultUserForm.hidden = false
    $("#modalDelete").modal("show")
}

async function deleteUser(userId) {
    fetch(fetchParams.url + `/` + userId, {
        method: 'DELETE',
        headers: fetchParams.head,
    })
        .then(data => {
            if (data.status === 200) {
                document.getElementById('firstNameForm').value = ''
                $("#firstNameForm").prop('disabled', false)
                document.getElementById('lastNameForm').value = ''
                $("#lastNameForm").prop('disabled', false)
                document.getElementById('ageForm').value = ''
                $("#ageForm").prop('disabled', false)
                document.getElementById('emailForm').value = ''
                $("#emailForm").prop('disabled', false)
                document.getElementById('passwordForm').value = ''
                $("#passwordForm").prop('disabled', false)
                $("#rolesForm").prop('disabled', false)
                $('.modal-backdrop').remove();
                defaultUserForm.hidden = true
                getTableWithUsers()
                document.getElementById('allUsersTab').click()
            }
        })
        .catch(
            error => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            <b>Что-то пошло не так!</b>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                document.getElementById('defaultFormGroup').insertAdjacentHTML('beforebegin', alert)
            })
}


// Добавление нового юзера
document.getElementById('newUserTab').addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('newUserForm').append(defaultUserForm)

    document.getElementById('idForm').value = ''
    document.getElementById('firstNameForm').value = ''
    document.getElementById('lastNameForm').value = ''
    document.getElementById('ageForm').value = ''
    document.getElementById('emailForm').value = ''
    document.getElementById('passwordForm').value = ''
    document.getElementById('rolesForm').options.forEach(option => option.selected = false)

    $("#idForm").prop('disabled', true)
    $("#firstNameForm").prop('disabled', false)
    $("#lastNameForm").prop('disabled', false)
    $("#ageForm").prop('disabled', false)
    $("#emailForm").prop('disabled', false)
    $("#passwordForm").prop('disabled', false)
    $("#rolesForm").prop('disabled', false)

    defaultUserForm.hidden = false
})

document.getElementById('addNewUserBtn').addEventListener('click', (e) => {
    e.preventDefault()

    let firstNameNew = document.getElementById('firstNameForm').value
    let lastNameNew = document.getElementById('lastNameForm').value
    let ageNew = document.getElementById('ageForm').value
    let emailNew = document.getElementById('emailForm').value
    let passwordNew = document.getElementById('passwordForm').value
    let rolesNew = document.getElementById('rolesForm')

    let newUser = {
        firstName: firstNameNew,
        lastName: lastNameNew,
        age: ageNew,
        email: emailNew,
        password: passwordNew,
        roles: [].filter
            .call(rolesNew.options, option => option.selected)
            .map(function (r) {
                return {
                    'id': r.value,
                    'roleName': r.text
                }
            })
    }
    fetch(fetchParams.url, {
        method: 'POST',
        headers: fetchParams.head,
        body: JSON.stringify(newUser)
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
        })
        .then(() => {
            getTableWithUsers()
            document.getElementById('allUsersTab').click()
            document.getElementById('firstNameForm').value = ''
            document.getElementById('lastNameForm').value = ''
            document.getElementById('ageForm').value = ''
            document.getElementById('emailForm').value = ''
            document.getElementById('passwordForm').value = ''
            document.getElementById('rolesForm').options.forEach(option => option.selected = false)
        })
        .catch(
            error => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            <b>Email уже занят!</b>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                document.getElementById('defaultFormGroup').insertAdjacentHTML('beforebegin', alert)
            })
})
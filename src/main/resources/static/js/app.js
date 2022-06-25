$(async function () {
    await getTableWithUsers();
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
const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json; charset=UTF-8',
        'Referer': null
    },
    // bodyAdd : async function(user) {return {'method': 'POST', 'headers': this.head, 'body': user}},
    findAllUsers: async () => await fetch('/api/users'),
    findOneUser: async (id) => await fetch(`/api/users/${id}`),
    addNewUser: async (user) => await fetch('/api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`/api/users/${id}`, {method: 'DELETE', headers: userFetchService.head})
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
                                <button type="button" data-userid="edit${user.id}" data-action="edit" class="btn btn-primary" 
                                data-toggle="modal" data-target="#defaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="delete${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#defaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // обрабатываем нажатие на любую из кнопок edit или delete
    // достаем из нее данные и отдаем модалке, которую к тому же открываем
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

// что то деалем при открытии модалки и при закрытии
// основываясь на ее дата атрибутах
async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

// редактируем юзера из модалки редактирования, забираем данные, отправляем
function editUser(modal, id) {
    let preuser = fetch(fetchParams.url + id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let editButton = `<button  type="submit" class="btn btn-primary" data-toggle="modal" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', () => {
        let id = modal.find("#id").val().trim();
        let firstName = modal.find("#firstName").val().trim();
        let lastName = modal.find("#lastName").val().trim();
        let age = modal.find("#age").val().trim();
        let email = modal.find("#email").val().trim();
        let password = modal.find("#password").val().trim();
        let roles = $('#rolesMulti').val();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        let response = userFetchService.updateUser(data, id);

        if (response.ok) {
            getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}


// удаляем юзера из модалки удаления
async function deleteUser(modal, id) {
    await userFetchService.deleteUser(id);
    await getTableWithUsers();
    modal.find('.modal-title').html('');
    modal.find('.modal-body').html('User was deleted');
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(closeButton);
}


// Добавление нового юзера
newUserTab.addEventListener('click', event => {
    event.preventDefault()
    document.getElementById('newUserForm').append(defaultUserForm)
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
        })
        .catch(
            error => {
                let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            <b>Email уже занят!</b>
                            <b>${error}</b>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`
                document.getElementById('defaultFormGroup').insertAdjacentHTML('beforebegin', alert)
            })
})
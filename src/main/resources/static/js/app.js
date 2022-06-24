$(async function () {
    getTableWithUsers();
    getDefaultModal();
    addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
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

const roleFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllRoles: async () => await fetch(`/api/roles`),
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
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
async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    let editButton = `<button  type="submit" class="btn btn-primary" data-toggle="modal" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="modal-body">
                    <div class="col-4 offset-4 text-center">
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="idModal">
                                First name
                            </label>
                            <input type="number"
                                   value="${user.id}"
                                   id="idModal"
                                   class="form-control"
                                   placeholder="id" 
                                   disabled="disabled"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="firstNameModal">
                                   First name
                            </label>
                            <input type="text"
                                   value="${user.firstName}"
                                   id="firstNameModal"
                                   class="form-control"
                                   placeholder="First name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="lastNameModal">
                                   Last name
                            </label>
                            <input type="text"
                                   value="${user.lastName}"
                                   id="lastNameModal"
                                   class="form-control"
                                   placeholder="Last name"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="ageModal">
                                   Age
                            </label>
                            <input type="number"
                                   value="${user.age}"
                                   id="ageModal"
                                   class="form-control"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="emailModal">
                                   Email
                            </label>
                            <input value="${user.email}"
                                   type="email" 
                                   class="form-control"
                                   id="inputEmail"
                                   placeholder="Email"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="passwordModal">
                                   Password
                            </label>
                            <input value="${user.password}"
                                   type="password"
                                   class="form-control"
                                   id="passwordModal"
                                   placeholder="Password"/>
                        </div>
                        <div class="form-group">
                            <label class="control-label font-weight-bold"
                                   for="rolesModal">
                                   Roles
                            </label>
                            <select multiple="multiple"
                                    id="rolesModal"
                                    class="form-control"/>
                                <option>
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
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
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
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


// готово
async function addNewUser() {
    const response = await roleFetchService.findAllRoles();
    const allRoles = response.json();
    $('#newUserTab').on('click', async () => {
        const select = $('#newUserForm').find('#rolesNew')
        allRoles.then(
            roles => {
                // const rolesForm =
                roles.map(r => select.append(new Option(r.roleName, r.id))
                    // `<option value="${r.id}">${r.roleName}</option>`
                );
                // .join('');
                // select.append(rolesForm);
            })
    })
    $('#addNewUserButton').on('click', async () => {
        const addUserForm = $('#newUserForm')
        const firstName = addUserForm.find('#firstNameNew').val().trim();
        const lastName = addUserForm.find('#lastNameNew').val().trim();
        const age = addUserForm.find('#ageNew').val().trim();
        const email = addUserForm.find('#emailNew').val().trim();
        const password = addUserForm.find('#passwordNew').val().trim();
        const select = addUserForm.find('#rolesNew option:selected').select()
        const roles = select.map(function () {
                    return {
                        'id': this.val(),
                        'roleName': this.text()
                    }
                }
            )
        const data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            email: email,
            password: password,
            roles: roles
        }
        const response = await userFetchService.addNewUser(data);
        if (response.ok) {
            await getTableWithUsers();
            addUserForm.find('#firstNameNew').val('');
            addUserForm.find('#lastNameNew').val('');
            addUserForm.find('#ageNew').val('');
            addUserForm.find('#emailNew').val('');
            addUserForm.find('#passwordNew').val('');
            addUserForm.find('#rolesNew').val('');
        } else {
            const body = await response.json();
            const alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            addUserForm.prepend(alert)
        }
    })
}
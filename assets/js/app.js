const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const blogForm = document.getElementById('blogForm');
const postContainer = document.getElementById('postContainer');
const addPost = document.getElementById('addPost');
const updatePost = document.getElementById('updatePost');

let baseUrl = 'https://node-crud-one-backend.onrender.com'

let blogsArr = [];

function snackbar(msg, icon) {
    Swal.fire({
        title: msg,
        icon: icon,
        timer: 3000
    })
}

function fetchPost() {
    fetch(`${baseUrl}/blogs`, {
        method: 'GET',
        body: null
    })
        .then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error(res);
            }
        })
        .then((result) => {
            blogsArr = result.data;
            console.log(blogsArr);

            createCards(blogsArr);
        })
        .catch(err => {
            snackbar(err, 'error');
        })

}

fetchPost();

function createCards(arr) {
    let res = " ";
    arr.forEach((ele) => {
        res += `<div class="col-md-4 mb-4 mt-5" id=${ele.id}>
                        <div class="card h-100">
                        <div class="card-header">
                              <h4>${ele.title}</h4>
                        </div>
                        <div class="card-body">
                              <h3>Content</h3>
                              <p>${ele.content}</p>
                        </div>

                        <div class="card-footer d-flex justify-content-between ">
                              <button onclick="onEdit(this)" class="btn btn-outline-primary">Edit</button>
                              <button  onclick="onRemove(this)" class="btn btn-outline-warning">Remove</button>
                              </div>
                        </div>
                        </div>`
    });
    postContainer.innerHTML = res;
}

blogForm.addEventListener('submit', (eve) => {
    eve.preventDefault();
    let newObj = {
        title: titleControl.value,
        content: contentControl.value,

    }

    fetch(`${baseUrl}/blogs`, {
        method: 'POST',
        body: JSON.stringify(newObj),
        headers: {
            'content-type': 'application/json',
            Auth: 'token'
        }
    })
        .then((res) => {
            return res.json();
        })
        .then((result) => {
            console.log(result);
            createSingleCard(result.data);
            blogsArr.unshift(result.data);
            blogForm.reset()
        })
        .catch((err) => {
            snackbar(err, 'error');
        })

});

function createSingleCard(newObj) {
    let div = document.createElement('div');
    div.id = newObj.id;
    div.className = 'col-md-4 mb-4 mt-5';
    div.innerHTML = `
                           <div class="card h-100">
                              <div class="card-header">
                                    <h4>${newObj.title}</h4>
                              </div>
                              <div class="card-body">
                                 <h3>Content</h3>
                                    <p>${newObj.content}</p>
                              </div>

                              <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn btn-inline-block btn-outline-primary">Edit</button>
                                    <button onclick="onRemove(this)" class="btn btn-inline-block btn-outline-warning">Remove</button>
                                 </div>
                           </div>`
    postContainer.prepend(div);
}

function onRemove(ele) {
    let removeId = ele.closest('.col-md-4').id;
    let removeUrl = `${baseUrl}/blogs/${removeId}`;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {

            fetch(removeUrl, {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                    Auth: 'Get token from'
                }
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    else {
                        throw new Error(res);
                    }
                })
                .then(() => {
                    document.getElementById(removeId).remove();
                    snackbar('Deleted successfully..', 'success');
                })
                .catch((err) => {
                    snackbar(err, 'error');
                })
                .finally(() => {
                })
        }
    });
}


function onEdit(ele) {
    let editId = ele.closest('.col-md-4').id;
    localStorage.setItem('editId', editId);

    let editObj = blogsArr.find(blog => blog.id == editId);
    console.log(editObj)

    titleControl.value = editObj.title;
    contentControl.value = editObj.content;

    addPost.classList.add('d-none');
    updatePost.classList.remove('d-none');
}

updatePost.addEventListener('click', (eve) => {

    let updateId = localStorage.getItem('editId');
    let updateUrl = `${baseUrl}/blogs/${updateId}`;

    let updateObj = {
        title: titleControl.value,
        content: contentControl.value
    }

    fetch(updateUrl, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            Auth: 'Get token from'
        },
        body: JSON.stringify(updateObj)
    })
        .then((res) => {
            if (!res.ok) {
                throw new Error(res);
            } else {
                return res.json();
            }
        })
        .then(() => {
            let div = document.getElementById(updateId);
            div.innerHTML = `<div class="card h-100">
                              <div class="card-header">
                                    <h4>${updateObj.title}</h4>
                              </div>
                              <div class="card-body">
                                 <h3>Content</h3>
                                    <p>${updateObj.content}</p>
                              </div>

                              <div class="card-footer d-flex justify-content-between ">
                                    <button onclick="onEdit(this)" class="btn  btn-outline-primary">Edit</button>
                                    <button onclick="onRemove(this)" class="btn  btn-outline-warning">Remove</button>
                                 </div>
                           </div>`

            addPost.classList.remove('d-none');
            updatePost.classList.add('d-none');
            blogForm.reset();

            snackbar('Updated successfully !!!', 'success');
        })
        .catch((err) => {
            snackbar(err, 'error');
        })
})
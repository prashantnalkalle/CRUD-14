const cl = console.log;
const spinner = document.getElementById('spinner')
const todoform = document.getElementById('todoform')
const title = document.getElementById('title')
const userId = document.getElementById('userId')
const completed = document.getElementById('completed')
const Addtodo = document.getElementById('Addtodo')
const Updatetodo = document.getElementById('Updatetodo')
const todocontainer = document.getElementById('todocontainer')

let todoArr =[]

let Base_url = `https://jsonplaceholder.typicode.com/todos`

function fetchtodo(){
    spinner.classList.remove('d-none')
    let xhr = new XMLHttpRequest()

    xhr.open('GET',Base_url)

    xhr.send(null)

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            todoArr = JSON.parse(xhr.response)

            createtodos(todoArr.reverse())
        }

        spinner.classList.add('d-none')
    }
}

fetchtodo()

function snackbar(msg,icon){
    swal.fire({
        title : msg,
        icon : icon,
        timer : 2000
    })
}


function showicon(status){
    if(status.toString() == 'true'){
        return `<i class="fa-regular fa-square-check fa-2x text-success"></i>`
    }else{
        return `<i class="fa-solid fa-square-xmark fa-2x text-danger"></i>`
    }
}

function createtodos(arr){
    let result =``
    arr.forEach((ele,i) =>{
        result+=`<tr id = ${ele.id}>
					<td>${arr.length-i}</td>
					<td>${ele.userId}</td>
					<td>${ele.title}</td>
					<td>${showicon(ele.completed)}</td>
					<td><i role='button' class="fa-regular fa-pen-to-square fa-2x text-primary" onclick='Onedit(${ele.id})'></i></td>
					<td><i role='button' class="fa-solid fa-trash fa-2x text-danger" onclick='Onremove(${ele.id})'></i></td>
				</tr>`
    })
    todocontainer.innerHTML = result 

}

function onsubmit(ele){
    spinner.classList.remove('d-none')

    ele.preventDefault()

    let newtodo ={
        title : title.value,
        userId : userId.value,
        completed : completed.value
    }

    todoArr.unshift(newtodo)

    let xhr = new XMLHttpRequest()

    xhr.open('POST',Base_url)
    
    xhr.send(JSON.stringify(newtodo))

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let res = JSON.parse(xhr.response)

            createnewtodo(newtodo,res)
            snackbar(`The new todo with Id ${res.id} is added successfully!!`,'success')

        }


        spinner.classList.add('d-none')

    }



}


function createnewtodo(newtodo,res){
    let tr = document.createElement('tr')
    tr.id = res.id

    tr.innerHTML =`<td>${todoArr.length}</td>
					<td>${newtodo.userId}</td>
					<td>${newtodo.title}</td>
					<td>${showicon(newtodo.completed)}</td>
					<td><i role='button' class="fa-regular fa-pen-to-square fa-2x text-primary" onclick='Onedit(${res.id})'></i></td>
					<td><i role='button' class="fa-solid fa-trash fa-2x text-danger" onclick='Onremove(${res.id})'></i></td>
				`

    todocontainer.prepend(tr)
    todoform.reset()
    
}

function Onedit(id){
    spinner.classList.remove('d-none')

    let editId = id
    localStorage.setItem('EditId',editId)
    let editURl = `${Base_url}/${editId}`

    let xhr = new XMLHttpRequest()

    xhr.open('GET',editURl)

    xhr.send(null)

    xhr.onload = function (){
        if(xhr.status >= 200 && xhr.status <= 299){
            let editObj = JSON.parse(xhr.response)

            title.value = editObj.title
            userId.value = editObj.userId
            completed.value = editObj.completed
            
            Addtodo.classList.add('d-none')
            Updatetodo.classList.remove('d-none')
            todoform.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }


        spinner.classList.add('d-none')

    }
}


function onupdate(){

    spinner.classList.remove('d-none')


    let updateId = localStorage.getItem('EditId')

    let updateUrl = `${Base_url}/${updateId}`

    let updateObj ={
        title : title.value,
        userId : userId.value,
        completed : completed.value,
        id : updateId
    }

    let xhr = new XMLHttpRequest()
    
    xhr.open('PUT',updateUrl)

    xhr.send(JSON.stringify(updateObj))

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status <= 299){
            let tr = document.getElementById(updateId).children

            tr[1].innerText = updateObj.userId
            tr[2].innerText = updateObj.title
            tr[3].innerHTML = showicon(updateObj.completed)

            Addtodo.classList.remove('d-none')
            Updatetodo.classList.add('d-none')
            
         todoform.reset()
          snackbar(`The  todo with Id ${updateId} is Updated successfully!!`,'success')
            let row = document.getElementById(updateId)
           row.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            row.classList.add('highlight');

            setTimeout(() => {
                row.classList.remove('highlight');
            }, 4000);


            
        }

        spinner.classList.add('d-none')

    }

}


function Onremove(ele){

    let removeId = ele;

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
        }).then((result) => {
        if (result.isConfirmed){
            spinner.classList.remove('d-none')
            
            let removeUrl  =`${Base_url}/${removeId}`

            let xhr = new XMLHttpRequest()
            
            xhr.open('DELETE',removeUrl)
            xhr.send()

            xhr.onload = function (){
                if(xhr.status >= 200 && xhr.status <= 299){
                    
                    document.getElementById(removeId).remove()
                }


                spinner.classList.add('d-none')

            }

        }
    });

}
todoform.addEventListener('submit',onsubmit)
Updatetodo.addEventListener('click',onupdate)
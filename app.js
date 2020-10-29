const todoList = document.querySelector('#todo-list');
const form = document.querySelector('#add-todo-form');
function addTodo(doc) {

    let li = document.createElement('li');
    let title = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id',doc.id);  
    title.textContent = doc.data().title; 
    cross.textContent ='x';

    li.appendChild(title);
    li.appendChild(cross);

    todoList.appendChild(li);
 
    //deleting data
    cross.addEventListener('click',(e) => {
       e.stopPropagation();
       let id = e.target.parentElement.getAttribute('data-id');
       db.collection('todos').doc(id).delete();
});
}



//getting data
// db.collection('todos').get().then((items) =>{
//     items.docs.forEach(doc => {
//         addTodo(doc);
//     });
// });
//saving data
form.addEventListener('submit',(e) => {
    e.preventDefault();
    db.collection('todos').add({
       title:form.title.value,
    });
});

//realtime listener
db.collection('todos').onSnapshot(items => {
  let changes = items.docChanges();
    changes.forEach(change => {
        if (change.type =='added') {
            addTodo(change.doc);
        }else if (change.type =='removed') {
            let li = todoList.querySelector('[data-id ='+ change.doc.id + ']');
            todoList.removeChild(li);
        }
    });
})
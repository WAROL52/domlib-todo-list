//@ts-check
class TodoList extends Domlib.Element{
    static localName="todo-list"
    constructor(){
        super()
        this.todo=""
        this.todos=[{
            text:"Etudier à la maison",
            completed:true
        },{
            text:"faire des courses ",
            completed:false
        }]
    }
    addTodo=()=>{
        this.todos.push({
            text:this.todo,
            completed:false
        })
    }
    render(){
        return /*html*/ ` 
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
        <div class="container">
        <div class="list-group">
            
    <li for:item.index="todos"   class="list-group-item list-group-item-action">
    {{index}}        
    <input class="form-check-input me-1" type="checkbox" bind:checked.input="item.completed">
            {{item}}  <hr> <br> {{item.text}}
            </li>
            
          </div>
          <div class="mb-3 row">
          <label for="staticEmail" class="col-sm-2 col-form-label">todo:</label>
          <div class="col-sm-10">
            <input type="text" readonly class="form-control-plaintext" id="staticEmail" bind:value="todo">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="input-group mb-3">
        <input bind:value.input="todo"  type="text" class="form-control" placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" on:click="addTodo" >Ajouter</button>
        </div>
        </div>
    </div>
    {{todos}}
        `
    }
}
const HTMLTodoList=Domlib.build(TodoList)
const elTodoList=new HTMLTodoList()
Domlib.appendChild(elTodoList)

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
        this.isDisabled=true
        this.$on.change('todo',()=>{
            if(this.todo==""){
                this.isDisabled=true
            }else{
                
                this.isDisabled=false
            }
        })
        this.labelEditer="editer"
    }
    addTodo=()=>{
        this.todos.push({
            text:this.todo,
            completed:false
        })
        this.todo=""
    }
    removeTodo=(e)=>{
        const index=Number(e.target.getAttribute('index'))
        this.todos.splice(index,1)
    } //scrollRevea   ScrollReveal().reveal('.headline');
    scrollRevea(e){
    }
    editTodo=(e)=>{
        const el=e.target.previousElementSibling
        console.log(el);
        const ishidden=el.getAttribute('ishidden')
        if(ishidden=='true'){
            el.setAttribute('ishidden','false')
            el.hidden=false
            this.labelEditer="cacher"
        }else{
            this.labelEditer="editer"
            el.setAttribute('ishidden','true')
            el.hidden=true
        }
    }
    render(){
        return /*html*/ ` 
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p" crossorigin="anonymous"></script>
            
            <div class="container"  >
        <div  class="overflow-auto list-group border " style="width: 100%;height:60vh;">
            
    <li for:item.index="todos"   class="mb-2 border border-secondary  list-group-item list-group-item-action">
    {{index}}        
    <input class="form-check-input me-1" type="checkbox" bind:checked.input="item.completed">{{item.text}}
            <div class=" d-grid gap-2 d-md-flex justify-content-md-end">
            <input bind:value.input="item.text" hidden ishidden="true"  type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm">
            <button class="btn btn-sm btn-primary me-md-2" type="button" on:click="editTodo" >{{labelEditer}}</button>
            <button class="btn btn-sm btn-danger"  type="button" bind:index:="index"  on:click="removeTodo" >Effacer</button>
          </div>
    </li>
            
          </div>
          <div class="mb-3 row">
          <label for="staticEmail" class="col-sm-2 col-form-label">todo:</label>
          <div class="col-sm-10">
            <input type="text" readonly disabled class="disabled form-control-plaintext" id="staticEmail" bind:value="todo">
          </div>
        </div>
        <div class="mb-3 row">
          <div class="input-group mb-3">
        <input bind:value.input="todo"   type="text" class="form-control" placeholder="Ecrivez ici votre nouvelle todo..." aria-label="Ecrivez ici votre nouvelle todo..." aria-describedby="button-addon2">
        <button class="btn btn-outline-secondary" type="button" id="button-addon2" on:click="addTodo" bind:disabled="isDisabled" >Ajouter</button>
        </div>
        </div>
    </div>
    {{todos}}
        `
    }
}
const HTMLTodoList=Domlib.build(TodoList)
const elTodoList=new HTMLTodoList()
Domlib.appendChild(elTodoList,document.querySelector('#app'))

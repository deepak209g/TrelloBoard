const TODO = 'todo'
const IN_PROGRESS = 'in_progress'
const DONE = 'done'

// using localforage module for persistance
// driver property in config tells which storage mechanism to use.
localforage.config({
    name: 'trello_tasks',
    driver: localforage.LOCALSTORAGE,
});


var model = {
    taskcount: 0,
    TODO: [],
    IN_PROGRESS: [],
    DONE: []
};
localforage.getItem('model').then(function(data){
    if (data != null) {
        // data present in local storage
        console.log(data)
        for(key in data){
            
            console.log(key)
            console.log(data[key])
            Vue.set(lists, key, data[key])
        }
        
        lists.data = model
    }else{
        console.log('No data present')
    }
})


// This is a simple constructor for a task object

var Task = function (name, description, taskid) {
    this.taskid = taskid
    this.name = name
    this.description = description
}


// model.TODO.push(new Task('first', 'checking the working'))


// Vue object for managing lists
// Note that the lists here are draggable and sortable due to draggable and sortable module used.
var lists = new Vue({
    el: "#lists",
    data: model,
    watch: watchfun(),
    methods: {
    }
});

function watchfun(){
    toret = {}
    for(key in model){
        toret[key] = function(newval, oldval){
            // var currkey = key;
            // console.log(currkey + ' new ' + newval)
            // console.log(currkey + ' old ' + oldval)
            localforage.setItem('model', model)
        }
    }
    console.log(toret)
    return toret;
}



// creating a new todo item
// This is a Vue object that encaptulates the functionlity of creation of new task.
var newtodo = new Vue({
    el: "#new-todo",
    data() {
        return {
            name: '',
            description: ''
        }
    },
    methods: {
        clearForm() {
            this.name = '';
            this.description = '';
        },
        handleOk(evt) {
            // Prevent modal from closing
            evt.preventDefault()
            if (!this.name) {
                alert('Please enter a cool title');
            } else if (!this.description) {
                alert('Please enter a small description');
            } else {
                this.handleSubmit()
            }
        },
        handleSubmit() {
            model.taskcount++;
            var count = model.taskcount
            model.TODO.push(new Task(this.name, this.description, count));
            this.clearForm()
            this.$refs.modal.hide()
        },
        showModal() {
            this.$refs.modal.show()
        },
        hideModal() {
            this.$refs.modal.hide()
        }
    }
})
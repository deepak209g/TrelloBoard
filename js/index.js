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


// Because I know that you will like the search functionality :D
var searchFun = new Vue({
    el: '#search-fun',
    data: {
        search_term: ''
    }
})


// Vue object for managing lists
// Note that the lists here are draggable and sortable due to draggable and sortable module used.
var lists = new Vue({
    el: "#lists",
    data: model,
    watch: watchfun(),
    methods: {
        removeElement : function(list, index){
            list.splice(index, 1);
        },
        editElement: function(list, index){
            todoeditor.updateTODO(list, index)
        },
        checkMove: function(evt){
            var from = evt.from.getAttribute('name')
            var to = evt.to.getAttribute('name')
            // logic for ticket movement
            // if a task is done we shouldnt be able to move it to other lists
            // rest all movements are possible
            // This logic is changable as per the needs
            if(from == DONE){
                return false
            }
            return true
        }
    }, 
    computed: {
        filteredTODO: function(){
            var s_term = searchFun.search_term;

            return keyword_filter(this.TODO, s_term)
        },
        filteredIN_PROGRESS: function(){
            var s_term = searchFun.search_term;

            return keyword_filter(this.IN_PROGRESS, s_term)
        },
        filteredDONE: function(){
            var s_term = searchFun.search_term;

            return keyword_filter(this.DONE, s_term)
        }
    }
});

function keyword_filter(origlist, s_term){
    console.log(typeof origlist)
    return origlist.filter(function(item){
        if (s_term == ''){
            return true;
        }else{
            var text = item.name + ' ' + item.description
            console.log(text)
            return text.toLowerCase().includes(s_term.toLowerCase())
        }
    })
}

function watchfun(){
    toret = {}
    for(key in model){
        toret[key] = function(newval, oldval){
            localforage.setItem('model', model)
        }
    }
    console.log(toret)
    return toret;
}



// creating a new todo item
// This is a Vue object that encaptulates the functionlity of creation of new task.
var todoeditor = new Vue({
    el: "#todo-editor",
    data() {
        return {
            name: '',
            description: '',
            editing: false
        }
    },
    methods: {
        clearForm() {
            console.log('Clear Form called')
            this.name = '';
            this.description = '';
            this.editing = false
            this.list = null;
            this.index = null;
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
            if(this.editing == true){
                var index = this.index;
                this.list[index].name = this.name;
                this.list[index].description = this.description;
            }else{
                model.TODO.push(new Task(this.name, this.description, count));
            }
            this.clearForm()
            this.$refs.modal.hide()
        },
        createNewTODO() {
            this.$refs.modal.show()
        },
        updateTODO(list, index){
            console.log(' IN Update todo')
            this.list = list;
            this.index = index
            this.editing = true;
            this.name = list[index].name;
            this.description = list[index].description
            console.log(this.name)
            console.log(this.description)
            this.$refs.modal.show()
        },
        hideModal() {
            this.$refs.modal.hide()
        }
    }
})


// Create new TODO
var todobutton = new Vue({
    el: '#todobutton',
    methods: {
        createNewTODO: function(){
            todoeditor.createNewTODO()
        }
    }
})



const columns = [
    { name: "A Fazer", id: "todo" },
    { name: "Em Progresso", id: "doing" },
    { name: "Concluído", id: "done" }
];

let tasks = { todo: [ {id:"1", title: "a", index:0},
                        {id:"2", title: "b", index:1},
                        {id:"3", title: "c", index:2},
                        {id:"4", title: "d", index:3},
                        {id:"5", title: "e", index:4}],

                doing: [],

                done: []
};
let dragTaskId = null;
let editingTaskId = null;

function renderBoard(columnId = null){
    pri("preRender: ");
    pri(tasks);
    orderTasks(columnId);
    console.log("render: ");
    pri(tasks);
    
    const board = document.getElementById("kanbanBoard");
    board.innerHTML = "";

    columns.forEach(col => {
    const colDiv = document.createElement("div");
    colDiv.className = "kanban-column";
    colDiv.innerHTML = `
        <h2>${col.name}</h2>
        <div class="kanban-cards" id="cards-${col.id}"
        ondragover="event.preventDefault()"
        ondrop="onDropColumn('${col.id}')"></div>
        <form class="add-task-form" onsubmit="addTask(event, '${col.id}')">
        <input type="text" placeholder="Nova tarefa..." required>
        <button type="submit">+</button>
        </form>
    `;
    board.appendChild(colDiv);

    const cardsDiv = colDiv.querySelector(".kanban-cards");
    var colTasks = tasks[col.id];
    var nova = [];
    //console.log("preset:");
    colTasks.forEach(function (t) {
        nova.push(t);
    });
    colTasks = [];
    nova.forEach(function (t) {
        // if (t != null){
        //     console.log(t.title + ": "+t.index);
        // }
        colTasks.push(t);
        // console.log(t);
    });
    console.log("appr:");
    var ind = 0;

    colTasks.forEach(task =>{
        if (task == null) return;
        const card = document.createElement("div");
        card.className = "kanban-card";
        card.draggable = true;
        card.dataset.id = task.id;
        console.log(task.index);

        card.ondragstart = e => {
        dragTaskId = task.id;
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        };

        card.ondragend = () => {
        dragTaskId = null;
        card.classList.remove("dragging");
        clearDropIndicators();
        };

        card.ondragover = e => {
        e.preventDefault();
        setDropIndicator(card, e);
        };

        card.ondragleave = () => {
        card.removeAttribute("data-drop-position");
        };

        card.ondrop = e => {
            e.preventDefault();
            handleDropOnCard(task.id, col.id, e);
        };

        card.innerHTML = `
        <div class="top-task">
            <span class="span-moving" data-id="${task.id}">${task.title}</span>
            <span class="kanban-actions">
            <button onclick="editTask(${task.id})">✏️</button>
            <button onclick="removeTask(${task.id})">🗑️</button>
            <!-- <button onclick="moveDown(${task.id})">▼</button> -->
            <!-- <button onclick="moveUp(${task.id})">▲</button> -->
            </span>
        </div>
        <span class="span-datas" data-id="${task.id}">${task.dataInicio} > ${task.dataFim}</span>
    
        `;

        cardsDiv.appendChild(card);
    });
    });
}

function orderTasks(columnId) {
    pri("orderTasks: ");
    pri(tasks[columnId]);           
    if (columnId == null) return;
    
    // Remove null/undefined
    var nova = new Array();
    var ind = tasks[columnId].reduce((a,b) => a.index < b.index ? a : b).index;
    while (nova.length != tasks[columnId].length){
        for (var t of tasks[columnId]){
            if (t.index == ind){
                pri("achou: "+t.title+" com index "+t.index);
                nova.push(t);
                break;
            }
        }
        ind ++;
    }
    nova.sort((a, b) => a.index - b.index);
    pri("nova: ");
    pri(nova);
    tasks[columnId] = nova;
    pri("ordenado: ");
    pri(tasks[columnId]);

    // Ordena por índice

    // Reindexa para garantir sequencial
    redefineIndexes(columnId);
}


function pri(thing){
    console.log(thing);
}

function setDropIndicator(card, e) {
    const bounding = card.getBoundingClientRect();
    const offset = e.clientY - bounding.top;
    const height = bounding.height;

    if (offset < height / 2) {
    card.dataset.dropPosition = "before";
    } else {
    card.dataset.dropPosition = "after";
    }
}

function clearDropIndicators() {
    document.querySelectorAll('.kanban-card').forEach(card => {
    card.removeAttribute("data-drop-position");
    });
}

function handleDropOnCard(targetId, columnId, e) {
    
    if (dragTaskId === null || dragTaskId === targetId) return;
    pri("entering");
    //redefineIndexes();

    const dragIdx = tasks[columnId].findIndex(t => t.id.toString() === dragTaskId.toString());
    const targetIdx = tasks[columnId].findIndex(t => t.id.toString() === targetId.toString());
    const dragged = tasks[columnId][dragIdx];
    const dropPosition = e.currentTarget.dataset.dropPosition;

    // Remove da posição original
    tasks[columnId].splice(dragIdx, 1);

    // Recalcula tarefas da coluna destino (depois do splice acima)
    const colTasks = tasks[columnId];
    const newTargetIdx = colTasks.findIndex(t => t.id.toString() === targetId.toString());

    let insertIdx = newTargetIdx;
    if (dropPosition === "after"){
        insertIdx+=1;
        if (targetIdx < dragIdx) insertIdx--;
    }
    else insertIdx--;

    // Encontra o índice global onde inserir
    dragged.index = insertIdx;
    console.log("dragged index: " + dragged.index + " "+ targetIdx);

    // altera os q vem depois
    var tasksC = [];
    tasks[columnId].forEach(t => {
        tasksC.push(t);
    });
    for (var t of tasksC){
        if (t.index > insertIdx) {
            t.index++;
        }
        if (t.index <= insertIdx){
            t.index--;
        }
    }
    tasks[columnId].push(dragged);
    pri("handle: ");pri(tasks);
    renderBoard(columnId);
}

function redefineIndexes(columnId){
    var i = 0;
    tasks[columnId].forEach(function (t) {
        t.index = i;    
        console.log(i + ": "+t.title); 
        i++;
    });
    pri("redefinido: ");
    pri(tasks[columnId]);

    var nova = [];
    tasks[columnId].forEach(function (t) {
        nova.push(t);
    });
    tasks[columnId].splice(0, tasks[columnId].length);
    pri("redefinido2: ");
    pri(tasks[columnId]);
    nova.forEach(function (t) {
        tasks[columnId].push(t);
    });


    
}

function onDropColumn(columnId) {
    if (dragTaskId !== null) {
        const dragIdx = tasks[columnId].findIndex(t => t.id === dragTaskId);
        const dragged = tasks[columnId][dragIdx];
        tasks[columnId].splice(dragIdx, 1);
        
        tasks[columnId].push(dragged);
        renderBoard();
    }
}

function addTask(event, columnId) {
    event.preventDefault();
    const input = event.target.querySelector("input");
    var newTask = {
    id: String(Date.now()) + Math.random().toString(36).substring(2, 6),
    title: input.value,
    index: tasks.filter(t => t.column === columnId).lengt
    };
    tasks.push(newTask);
    console.log(newTask);
    input.value = "";
    renderBoard();
}

function editTask(id) {
    var task = null;
    for (var item in tasks){
        pri(tasks[item]);
        task = tasks[item].find(t => t.id === ""+id);
        if (task != null) break;
    }
    editingTaskId = id;
    document.getElementById("editInput").value = task.title;
    document.getElementById("editModal").style.display = "flex";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
    editingTaskId = null;
}

// edição
const hoje = new Date().toISOString().split('T')[0]; // pega só a parte da data
document.getElementById("dataInicio").min = hoje;

function saveEdit() {
    const newTitle = document.getElementById("editInput").value.trim();
    var task = null;
    for (var item in tasks){
    task = tasks[item].find(t => ""+t.id === ""+editingTaskId);
    if (task != null) break;
    }
    if (newTitle && editingTaskId !== null) {
    
    task.title = newTitle;  
    task.dataInicio = document.getElementById("dataInicio").value;
    task.dataFim = document.getElementById("dataFim").value;
    renderBoard();
    closeEditModal();
    }
}

renderBoard();
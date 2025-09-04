//
let sheetLink = ""; //link da planilha

//
const columns = [
    { name: "A Fazer", id: "todo" },
    { name: "Em Progresso", id: "doing" },
    { name: "Concluído", id: "done" }
];

//  todo: [ {id:"1", title: "a", index:0},
//                         {id:"2", title: "b", index:1},
//                         {id:"3", title: "c", index:2},
//                         {id:"4", title: "d", index:3},
//                         {id:"5", title: "e", index:4}],

//                 doing: [],
// {"id":"5", "title": "e", "index":4}
//                 done: []
//                        {id:"5", title: "e", index:4}]

let tasks = null;
let dragTaskId = null;
let editingTaskId = null;
let pauseLeituraJSON = false;
var canReadJSON = true;

function renderBoard(columnId = null) {
    if (tasks == null) return;

    pri("preRender: ");
    print(tasks);
    orderTasks(columnId);
    pri("render: ");
    print(tasks);

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
        let colTasks = [...tasks[col.id]].sort((a, b) => a.index - b.index); // IA
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
        pri("appr:");
        var ind = 0;

        colTasks.forEach(task => {
            if (task == null) return;
            const card = document.createElement("div");
            card.className = "kanban-card";
            card.draggable = true;
            card.dataset.id = task.id;
            pri(task.index);

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
                pri("at render: t " + task.id + " c " + col.id);
                handleDropOnCard(task.id, col.id, e);
            };

            card.innerHTML = `
            <div class="top-task">
                <span class="span-moving" data-id="${task.id}">${task.title}</span>
                <span class="kanban-actions">
                    <button onclick="editTask('${task.id}')">✏️</button>
                    <button onclick="removeTask('${task.id}')">🗑️</button>
                </span>
            </div>
            <span class="span-datas" data-id="${task.id}">${(task.dataInicio == undefined) ? "---" : task.dataInicio} > ${(task.dataFim == undefined) ? "---" : task.dataFim}</span>
        
            `;

            cardsDiv.appendChild(card);
        });
    });
}

function handleDropOnCard(targetId, columnId, e) {

    if (dragTaskId === null || dragTaskId === targetId) return;
    pri("entering");
    //redefineIndexes();

    const dragIdx = tasks[columnId].findIndex(t => t.id.toString() === dragTaskId.toString());
    const targetIdx = tasks[columnId].findIndex(t => t.id.toString() === targetId.toString());
    const dragged = tasks[columnId][dragIdx];
    if (dragged == null) { // colunas diferentes
        pri("dragged null");
        return;
    }
    const dropPosition = e.currentTarget.dataset.dropPosition;

    // define os indices 
    var indiceIns = tasks[columnId][targetIdx].index;

    // Remove da posição original
    tasks[columnId].splice(dragIdx, 1);

    pri("place: ");
    print(tasks);


    pri("after splice: ");
    pri(targetId + " " + columnId + " " + dragIdx + ">" + tasks[columnId][dragIdx] + " " + tasks[columnId][targetIdx]);

    // Recalcula tarefas da coluna destino (depois do splice acima)
    // const colTasks = tasks[columnId];
    // const newTargetIdx = colTasks.findIndex(t => t.id.toString() === targetId.toString());      

    let insertIdx = indiceIns;
    if (dropPosition === "after") {
        // insertIdx+=1;
        // if (dragIdx+1 >= targetIdx) insertIdx--;
    }
    else insertIdx--;

    // Encontra o índice global onde inserir
    dragged.index = insertIdx;

    pri(dropPosition + " dragged index: " + dragged.index + " " + indiceIns);

    // altera os q vem depois
    var tasksC = [];
    tasks[columnId].forEach(t => {
        tasksC.push(t);
    });
    pri("tasksC: ");
    print(tasksC);
    for (var t of tasksC) {
        if (t.index > insertIdx) {
            // t.index++;
        }
        if (t.index <= insertIdx) {
            t.index--;
        }
    }
    tasks[columnId].splice(0, tasks[columnId].length);
    tasksC.splice(dragged.index, 0, dragged);
    tasks[columnId] = tasksC;
    pri("handle: "); print(tasks);
    renderBoard(columnId);
}

function orderTasks(columnId) {
    // return;
    pri("orderTasks: ");
    print(tasks[columnId]);
    if (columnId == null) return;

    // Remove null/undefined
    var nova = new Array();
    var ind = tasks[columnId].reduce((a, b) => a.index < b.index ? a : b).index;
    while (nova.length != tasks[columnId].length) {
        for (var t of tasks[columnId]) {
            if (t.index == ind) {
                pri("achou: " + t.title + " com index " + t.index);
                nova.push(t);
                break;
            }
        }
        ind++;
    }
    // nova.sort((a, b) => a.index - b.index);
    pri("nova: ");
    print(nova);
    tasks[columnId].splice(0, tasks[columnId].length);
    tasks[columnId] = nova;
    pri("ordenado: ");
    print(tasks[columnId]);

    // Ordena por índice

    // Reindexa para garantir sequencial
    redefineIndexes(columnId);
}

function redefineIndexes(columnId) {
    var i = 0;
    tasks[columnId].forEach(function (t) {
        t.index = i;
        pri(i + ": " + t.title);
        i++;
    });
    pri("redefinido: ");
    print(tasks[columnId]);
}

function pri(thing) {
    // return;
    console.log(thing);
}
function print(thing) {
    // return;
    if (thing == null || thing == undefined) pri(thing);
    else console.log(JSON.parse(JSON.stringify(thing)));
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

function onDropColumn(columnId) {
    if (dragTaskId !== null) {
        print("Finding: "+columnId);
        var dragIdx = null, dragged = null, column = null;
        for (var col in tasks) {
            if (col == columnId) continue;
            dragIdx = tasks[col].findIndex(t => t.id === dragTaskId.toString());
            if (dragIdx != null && dragIdx != -1) {
                column = col;
                break;
            }
        }
        pri("CHANGING: ");
        print(tasks);
        pri(column);
        pri(dragIdx);
        try{
            if (col != null) dragged = tasks[column][dragIdx];

            if (dragged != null) {
                tasks[column].splice(dragIdx, 1);

                tasks[columnId].push(dragged);
            }
            redefineIndexes(column);
        }catch (e){
            
        }
        redefineIndexes(columnId);
        sendTasks();
        renderBoard();
    }
}

function addTask(event, columnId) {
    event.preventDefault();
    const input = event.target.querySelector("input");
    var newTask = {
        id: String(Date.now()) + Math.random().toString(36).substring(2, 6),
        title: input.value,
        index: tasks[columnId].length
    };
    tasks[columnId].push(newTask);
    pri(newTask);
    input.value = "";
    sendTasks();
    renderBoard();
}

function editTask(id) {
    var task = null;
    for (var item in tasks) {
        pri(tasks[item]);
        task = tasks[item].find(t => t.id === "" + id);
        if (task != null) break;
    }
    editingTaskId = id;
    document.getElementById("editInput").value = task.title;
    document.getElementById("editModal").style.display = "flex";
}

function removeTask(id) {
    for (const col in tasks) {
        const idx = tasks[col].findIndex(t => t.id === "" + id);
        if (idx !== -1) {
            tasks[col].splice(idx, 1);
            sendTasks();
            renderBoard();
            break;
        }
    }
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
    editingTaskId = null;
}

// edição
const hoje = new Date().toISOString().split('T')[0]; // pega só a parte da data
document.getElementById("dataInicio").min = hoje;
document.getElementById("dataFim").min = hoje;

function saveEdit() {
    const newTitle = document.getElementById("editInput").value.trim();
    var task = null;
    for (var item in tasks) {
        task = tasks[item].find(t => "" + t.id === "" + editingTaskId);
        if (task != null) break;
    }
    if (newTitle && editingTaskId !== null) {
        task.title = newTitle;

        task.dataInicio = document.getElementById("dataInicio").value.split("-").reverse().join("/");
        task.dataFim = document.getElementById("dataFim").value.split("-").reverse().join("/");;
        sendTasks();
        closeEditModal();
        renderBoard();
    }
}

// salvamento JSON
async function escreverJSON(dados) {
    pauseLeituraJSON = true;
    fetch("data/write.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
    })
        .then(res => res.text())
        .then(resp => {
            console.log('JSON salvo!');

        }
        )
        .catch(err => console.error('Erro:', err));
    pauseLeituraJSON = false;
    canReadJSON = true;
}
async function lerJSON(lastData, nomeArquivo = takeName()) {
    while (pauseLeituraJSON) { }

    fetch(nomeArquivo)
        .then(res => res.json())
        .then(data => {
            if (JSON.stringify(data) !== JSON.stringify(lastData) && canReadJSON) {
                tasks = data;
                console.log("JSON carregado !");
                // pri(tasks);
                // pri(last)
                renderBoard();
                canReadJSON = true;
            }
        })
        .catch(err => console.error('Erro ao carregar JSON:', err));
    return tasks;
}
function takeName() {
    // "+Math.floor(Date.now() / 1000)+"
    return "data/tasks.json";
}

// document.getElementById("fileInput").addEventListener("change", function(event){
//     const file = event.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = function(e) {
//         try {
//             const dados = JSON.parse(e.target.result);
//             tasks = dados;
//             renderBoard(); // atualiza a board
//         } catch(err) {
//             console.error("Erro ao ler JSON:", err);
//         }
//     };
//     reader.readAsText(file);
// });

async function sendTasks() {
    pri("----------SALVING----------");
    imagemAtualizacaoSheets("carregando");
    escreverJSON(tasks);
    enviarParaSheets(tasks);
}

async function imagemAtualizacaoSheets(tipo) {
    var angulo = 0;
    if (tipo == "carregando") {
        var img = document.getElementById("attSheets");
        img.src = "imgs/carregando.png";
        img.id = "attSheets";

        // Gira a cada 50ms (ajuste se quiser mais rápido/lento)
        intervalo = setInterval(() => {
            angulo += 5;
            img.style.transform = `rotate(${angulo}deg)`;
        }, 25);

        setTimeout(() => {
            clearInterval(intervalo);
        }, 1500);
    } else {
        clearInterval(intervalo);

        var img = document.getElementById("attSheets");
        img.style.transform = `rotate(0deg)`;
        img.src = "imgs/carregado.png";
        img.id = "attSheets";
        document.getElementById("sheetsInteraction").appendChild(img);

        img.style.transform = `rotate(${angulo}deg))`;
        img.style.transition = "transform 6s"; // animação suave
    }
}

async function enviarParaSheets(tasks) {
    console.log("Enviando dados para Google Sheets...");

    fetch(sheetLink, {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(tasks)
    }).then(() => {
        imagemAtualizacaoSheets("carregado");
        console.log("Dados enviados para Google Sheets !");
    }).catch(err => console.error(err));
}

async function getLink() {
    while (true) {
        fetch('data/linkGS.txt')
            .then(response => response.text())
            .then(texto => {
                var link = texto.trim();
                if (link != sheetLink) {
                    sheetLink = link;
                    console.log("Link GS:", sheetLink.split("/")[5]);
                }
            })
            .catch(err => console.error("Erro ao carregar linkGS.txt", err));

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

async function getJSON() {
    var data = null;
    while (true) {
        var data = await lerJSON(data);
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
}

async function iden(){
    while (true){
        document.getElementById("iden").style = (!canReadJSON)?"color: red;":"color: green";
        await new Promise(resolve => setTimeout(resolve, 500));
    }
}
//  
getLink();
getJSON();
// iden();
renderBoard();
// salvarJSON();

// atualizar  no sheets quando edita uma task


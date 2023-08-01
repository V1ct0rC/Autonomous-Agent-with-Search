// CIn - UFPE
// IF684EC - Sistemas Inteligentes
//
// Authors: Jeferson Severino de Araújo (jsa2)
//          Lucas Nascimento Brandao (lnb)
//          Matheus Julio Boncsidai de Oliveira (mjbo)
//          Pedro Henrique Almeida Girao Peixinho (phagp)
//          Victor Gabriel de Carvalho (vgc3)
//
// Professors: Filipe Calegario
//             Germano Crispim Vasconcelos
//
// Atividade 3.0: Projeto - Agente Autônomo com Busca


// Global variables
let selected_search = "None";
let agent;
let world;

let reset = false;

let editing = false;
let block = 0;

// The user chooses which type of search will be performed (2)
// Getting user's choice from UI buttons
const bfs_btn = document.getElementById('bfs_btn');
const dfs_btn = document.getElementById('dfs_btn');
const unc_btn = document.getElementById('unc_btn');
const grd_btn = document.getElementById('grd_btn');
const ast_btn = document.getElementById('ast_btn');

bfs_btn.addEventListener('click', function() {
  selected_search = "BFS";
  
  bfs_btn.style.backgroundColor = '#47b854';
  dfs_btn.style.backgroundColor = '#3333330d';
  unc_btn.style.backgroundColor = '#3333330d';
  grd_btn.style.backgroundColor = '#3333330d';
  ast_btn.style.backgroundColor = '#3333330d';
});
dfs_btn.addEventListener('click', function() {
  selected_search = "DFS";
  
  bfs_btn.style.backgroundColor = '#3333330d';
  dfs_btn.style.backgroundColor = '#47b854';
  unc_btn.style.backgroundColor = '#3333330d';
  grd_btn.style.backgroundColor = '#3333330d';
  ast_btn.style.backgroundColor = '#3333330d';
});
unc_btn.addEventListener('click', function() {
  selected_search = "uniform_cost";
  
  bfs_btn.style.backgroundColor = '#3333330d';
  dfs_btn.style.backgroundColor = '#3333330d';
  unc_btn.style.backgroundColor = '#47b854';
  grd_btn.style.backgroundColor = '#3333330d';
  ast_btn.style.backgroundColor = '#3333330d';
});
grd_btn.addEventListener('click', function() {
  selected_search = "greedy";
  
  bfs_btn.style.backgroundColor = '#3333330d';
  dfs_btn.style.backgroundColor = '#3333330d';
  unc_btn.style.backgroundColor = '#3333330d';
  grd_btn.style.backgroundColor = '#47b854';
  ast_btn.style.backgroundColor = '#3333330d';
});
ast_btn.addEventListener('click', function() {
  selected_search = "a_star";
  
  bfs_btn.style.backgroundColor = '#3333330d';
  dfs_btn.style.backgroundColor = '#3333330d';
  unc_btn.style.backgroundColor = '#3333330d';
  grd_btn.style.backgroundColor = '#3333330d';
  ast_btn.style.backgroundColor = '#47b854';
});

// A few more optins
const reset_btn = document.getElementById('reset_btn');
const config_btn = document.getElementById('config_btn');
const play_btn = document.getElementById('play_btn');

reset_btn.addEventListener('click', function() {
  reset = true;
});
config_btn.addEventListener('click', function() {
  editing = true;
});
play_btn.addEventListener('click', function() {
  editing = false;
});

/* 
 * Setting up our world
 */
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  world = new World(40, 50, 20, 2, 1);  // Each grid square will have 40 px
  agent = world.agent;
}

/* 
 * p5js drawing loop
 */
function draw() {
  background(0);
  
  if(reset){
    world = new World(40, 50, 20, 2, 1);  // Resetting world
    agent = world.agent;
    reset = false;
    selected_search = "None";
    
    bfs_btn.style.backgroundColor = '#3333330d';
    dfs_btn.style.backgroundColor = '#3333330d';
    unc_btn.style.backgroundColor = '#3333330d';
    grd_btn.style.backgroundColor = '#3333330d';
    ast_btn.style.backgroundColor = '#3333330d';
  }
  
  world.run();
  agent.run(selected_search);
  
  if (agent.done){  // Agent has eaten its food
    // Go back to step 4 (other food appears in the environment) (10)
    agent.done = false;
    world.setFood();
  }
  
  //console.log(editing)
}

const btn0 = document.getElementById("0_btn");
const btn1 = document.getElementById("1_btn");
const btn2 = document.getElementById("2_btn");
const btn3 = document.getElementById("3_btn");

function showDiv() {
  const myDiv = document.getElementById("edit_div");
  const cBtn = document.getElementById("config_btn");
  
  const legenddiv = document.getElementById("legend_div");
  const selectdiv = document.getElementById("select_div");
  
  myDiv.style.display = "flex";
  cBtn.style.backgroundColor = '#47b854';
  
  legenddiv.style.display = "none";
  selectdiv.style.display = "none";
}

function hideDiv() {
  const myDiv = document.getElementById("edit_div");
  const cBtn = document.getElementById("config_btn");
  
  const legenddiv = document.getElementById("legend_div");
  const selectdiv = document.getElementById("select_div");
  
  myDiv.style.display = "none";
  cBtn.style.backgroundColor = '#3333330d'
  
  btn0.style.backgroundColor = '#3333330d';
  btn1.style.backgroundColor = '#3333330d';
  btn2.style.backgroundColor = '#3333330d';
  btn3.style.backgroundColor = '#3333330d';
  
  legenddiv.style.display = "block";
  selectdiv.style.display = "block";
}

function infoDiv(){
  const myDiv = document.getElementById("info_div");
  
  if ((myDiv.style.display === "flex")) {
    myDiv.style.display = "none";
  } else {
    myDiv.style.display = "flex";
  }
}

function editGrass(){
  btn0.style.backgroundColor = '#47b854';
  btn1.style.backgroundColor = '#3333330d';
  btn2.style.backgroundColor = '#3333330d';
  btn3.style.backgroundColor = '#3333330d';
  block = 0;
}

function editSwamp(){
  btn0.style.backgroundColor = '#3333330d';
  btn1.style.backgroundColor = '#47b854';
  btn2.style.backgroundColor = '#3333330d';
  btn3.style.backgroundColor = '#3333330d';
  block = 1;
}

function editLake(){
  btn0.style.backgroundColor = '#3333330d';
  btn1.style.backgroundColor = '#3333330d';
  btn2.style.backgroundColor = '#47b854';
  btn3.style.backgroundColor = '#3333330d';
  block = 2;
}

function editRock(){
  btn0.style.backgroundColor = '#3333330d';
  btn1.style.backgroundColor = '#3333330d';
  btn2.style.backgroundColor = '#3333330d';
  btn3.style.backgroundColor = '#47b854';
  block = 3;
}

// It is possible to edit our scenario
function mousePressed() {
  //console.log(mouseX, mouseY);
  if(editing) world.edit(block, mouseX, mouseY)
}

function mouseDragged() {
  if(editing) world.edit(block, mouseX, mouseY)
}
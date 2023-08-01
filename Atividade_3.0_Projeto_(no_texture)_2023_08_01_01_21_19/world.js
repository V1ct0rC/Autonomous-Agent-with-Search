/*
 * Represents the scenario where our agent will seek its food.
 */
class World{
  /*
   * Create a world instance.
   *
   * @param {number} cell_size - the dimension (in pixels) of each square cell.
   * @param {number} padding - the spacing (in pixels) from a cell to its egde.
   * @param {number} rnum - the desired number of rock seeds 
   * @param {number} snum - the desired number of swamp seeds
   * @param {number} lnum - the desired number of lake seeds
   */
  constructor(cell_size, padding, rnum, snum, lnum){
    this.cell_size = cell_size;
    this.padding = padding;
    
    // Grid size depends on the user's current window size
    this.columns = parseInt(windowWidth/(cell_size+4));
    this.rows = parseInt(windowHeight/(cell_size+4));
    
    if(this.columns > 30) this.columns = 30;
    if(this.rows > 30) this.rows = 30;
    
    // Creating the grid (it has no structures yet)
    this.cells = new Array(this.columns);
    for (let col=0; col<this.columns; col++) {
      this.cells[col] = new Array(this.rows);
    }
    let code = 0;
    for (let col=0; col<this.columns; col++) {
      for (let row=0; row<this.rows; row++) {
        // All cells begin as grass (1)
        this.cells[col][row] = new Cell(col, row, 0, code);  
        code ++;  // A code for each cell
      }
    }
    
    this.cell_count = this.columns * this.rows;
    this.agent = null;
    
    // Generating terrain varieties
    this.createScenario(rnum, snum, lnum);
    // Placing our agent
    this.setAgent();
    // Placing its food
    this.setFood();
  }
  
  /*
   * Runs the world processes and drawings.
   */
  run(){
    // Drawing each cell
    for (let col=0; col<this.columns; col++) {
      for (let row=0; row<this.rows; row++) {
        
        fill(this.cells[col][row].typecolor)  // Color for each cell
        
        let left = this.padding + (col * this.cell_size);
        let top = this.padding + (row * this.cell_size);
        let sizec = this.cell_size - 2;

        rect(left, top, sizec, sizec);  // Representing cells as squares
        
        // Food will appear as a yellow square
        if (this.cells[col][row].has_food){  
          fill('#DD9500')
          rect(left+15, top+15, sizec-30, sizec-30)
        }
      }
    }
  }
  
  /*
   * Places the food somewhere on the map (except inside an obstacle).
   */
  setFood(){
    // Checking if any food got depreciated
    for (let col=0; col<this.columns; col++) {
      for (let row=0; row<this.rows; row++) {
        if (this.cells[col][row].has_food) {
          this.cells[col][row].has_food = false;
          //this.cells[col][row].is_rotten = true;
        }
      }
    }
    
    // A food appears in a random position in the environment (4)
    // It can not appear on rocks
    let x, y;
    do {
      x = parseInt(random(0, this.columns));
      y = parseInt(random(0, this.rows));
    } while(this.cells[x][y].type == 3 || this.cells[x][y].has_food);

    this.cells[x][y].has_food = true;
    // The agent perceives the food in the environment and sets the position of the 
    // food as the objective state; (5)
    this.agent.setTarget(x, y);
    
    this.cells[this.agent.coord.x][this.agent.coord.y].has_food = false;
  }
  
  /*
   * Initializes the agent somewhere on the map (except inside an obstacle).
   */
  setAgent(){
    // The agent appears in a random position in the environment (3)
    // It can only appear on grass or swamp
    let x, y;
    do {
      x = parseInt(random(0, this.columns));
      y = parseInt(random(0, this.rows));
    } while(this.cells[x][y].type == 3 || this.cells[x][y].type == 2);

    this.cells[x][y].has_agent = true;
    this.agent = new Agent(x, y, this.cells, this.cell_size, this.padding);
  }
  
  /*
   * Populates the terrain with its four available types (grass, rocks, swamps and 
   * lakes). Rocks are not transpassable, swamps are not as easy to go trough as 
   * grass and lakes are the hardest type of terrain.
   *
   * @param {number} rocks - the desired number of rock seeds 
   * @param {number} swamp - the desired number of swamp seeds
   * @param {number} lake - the desired number of lake seeds
   */
  createScenario(rocks, swamp, lake){
    // The map is randomly generated with the 4 types of terrains (1)
    // Setting ground types
    for (let i=0; i<rocks; i++){
      this.setRock()
    }
    for (let i=0; i<swamp; i++){
      this.setSwamp()
    }
    for (let i=0; i<lake; i++){
      this.setLake()
    }
  }
  
  /*
   * Places a rock (3x3 cross shaped structure) randomly.
   */
  setRock(){
    let x = parseInt(random(1, this.columns-1));
    let y = parseInt(random(1, this.rows-1));

    this.cells[x][y].changeType(3)  // Rock seed
    
    // Each rock is generated as a cross shaped structure, rocks can merge to create
    // bigger structures
    this.cells[x-1][y].changeType(3)
    this.cells[x][y-1].changeType(3)
    this.cells[x+1][y].changeType(3)
    this.cells[x][y+1].changeType(3)
  }
  
  /*
   * Places a swamp seed randomly and grows a swamp with a size of up to 50 cells
   * around it.
   */
  setSwamp(){
    let x = 0, y = 0;
    do {
      x = parseInt(random(1, this.columns));
      y = parseInt(random(1, this.rows));
    } while(this.cells[x][y].type != 0);

    this.cells[x][y].changeType(1)  // Swamp seed

    let swamp_size = 100;

    // The swamp grows randomly in every direction
    while (swamp_size){
      let dir = parseInt(random(4));
      switch (dir) {
        case 0:  // Grows upwards
          if ((y-1 >= 0) && this.cells[x][y-1].type == 0){
            this.cells[x][--y].changeType(1)
          }
          break;
        case 1:  // Grows leftwards
          if ((x-1 >= 0) && this.cells[x-1][y].type == 0){
            this.cells[--x][y].changeType(1)
          }
          break;
        case 2:  // Grows righttwards
          if ((x+1 < this.columns) && this.cells[x+1][y].type == 0){
            this.cells[++x][y].changeType(1)
          }
          break;
        case 3:  // Grows bottomwards
          if ((y+1 < this.rows) && this.cells[x][y+1].type == 0){
            this.cells[x][++y].changeType(1)
          }
          break;
        default:
          console.log("Sorry, unexpected error");
      }
      swamp_size--;
    }
  }
  
  /*
   * Places a lake seed randomly and grows a lake with a size of up to 200 cells
   * around it.
   */
  setLake(){
    let x = 0, y = 0;
    do {
      x = parseInt(random(1, this.columns));
      y = parseInt(random(1, this.rows));
    } while(this.cells[x][y].type != 0);

    this.cells[x][y].changeType(2)  // Lake seed

    let lake_size = 200;

    // The lake grows randomly in every direction
    while (lake_size){
      let dir = parseInt(random(4));
      switch (dir) {
        case 0:  // Grows upwards
          if ((y-1 >= 0) && this.cells[x][y-1].type == 0){
            this.cells[x][--y].changeType(2)
          }
          break;
        case 1:  // Grows leftwards
          if ((x-1 >= 0) && this.cells[x-1][y].type == 0){
            this.cells[--x][y].changeType(2)
          }
          break;
        case 2:  // Grows righttwards
          if ((x+1 < this.columns) && this.cells[x+1][y].type == 0){
            this.cells[++x][y].changeType(2)
          }
          break;
        case 3:  // Grows bottomwards
          if ((y+1 < this.rows) && this.cells[x][y+1].type == 0){
            this.cells[x][++y].changeType(2)
          }
          break;
        default:
          console.log("Sorry, unexpected error");
      }
      lake_size--;
    }
  }
  
  edit(block, mx, my){
    for (let col=0; col<this.columns; col++) {
      for (let row=0; row<this.rows; row++) {
        
        // Defining cell's limits
        let left = this.padding + (col * this.cell_size);
        let top = this.padding + (row * this.cell_size);
        let sizec = this.cell_size - 2;
        
        if(mx>left && mx<left+sizec && my>top && my<top+sizec) this.cells[col][row].changeType(block);
      }
    }
  }
}
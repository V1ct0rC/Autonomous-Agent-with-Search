/*
 * Represents the agent that will search for a way towards its target (food).
 */
class Agent{
  /*
   * Create an agent instance.
   *
   * @param {number} x - its initial x coordinate.
   * @param {number} y - its initial y coordinate.
   * @param {Cell[][]} grid - the whole map (completely observable).
   * @param {number} cell_size - the dimension (in pixels) of each square cell.
   * @param {number} padding - the spacing (in pixels) from a cell to its egde.
   */
  constructor(x, y, grid, cell_size, padding){
    this.coord = createVector(x, y);
    this.target = createVector(x, y);
    this.drag = 20;
    this.curr_search = "None";
    
    // Every direction that the agent can take (it does not walk diagonally)
    this.directions = [
      { dr: -1, dc: 0, name: 'Up' },
      { dr: 1, dc: 0, name: 'Down' },
      { dr: 0, dc: -1, name: 'Left' },
      { dr: 0, dc: 1, name: 'Right' },
    ];
    this.path = [];
    this.step = 0;
    
    // Control variables
    this.found = false;
    this.done = false;
    this.searching = false;
    this.notfound = false;
    
    // Grid overlay variables
    this.grid = grid;
    this.cell_size = cell_size;
    this.padding = padding;
    
    // Its texture
    this.textr = loadImage('assets/agent_pixel.png')
  }
  
  /*
   * Runs the agent processes and drawings.
   *
   * @param {String} selected_search - search selected by the user.
   */
  run(selected_search){
    // Agent will appear as a red square
    //fill('#cf382b')
    
    // Defining agent's limits
    let left = this.padding + (this.coord.x * this.cell_size);
    let top = this.padding + (this.coord.y * this.cell_size);
    let sizec = this.cell_size - 2;
    
    image(this.textr, left+6, top+8);
    noFill();
    
    this.setSearch(selected_search);  // Applying the desired search

    // The agent performs the search considering its current position as the initial state; (6)
    if (!this.found && !this.done) this.search();
    if (this.found && !this.searching && (frameCount % this.drag == 0)) this.move();
    
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    
    // Showing search steps as an overlay
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        
        if(this.grid[col][row].overlay){
          fill(this.grid[col][row].typecolor_overlay)  // Color for each cell
          let left = this.padding + (col * this.cell_size);
          let top = this.padding + (row * this.cell_size);
          let sizec = this.cell_size - 2;

          rect(left, top, sizec, sizec);  // Representing cells as squares
          noFill();
        }
        if(this.grid[col][row].border){
          noFill();
          stroke(this.grid[col][row].color_border);
          strokeWeight(5);
          
          let left = this.padding + (col * this.cell_size);
          let top = this.padding + (row * this.cell_size);
          let sizec = this.cell_size - 2;

          rect(left, top, sizec, sizec);  // Representing cells as squares
        }
        noStroke();
        
      }
    }
  }
  
  /*
   * Defines its target (food position).
   *
   * @param {number} x - target's x coordinate.
   * @param {number} y - target's y coordinate.
   */
  setTarget(x, y){
    this.target = createVector(x, y);
  }
  
  /*
   * Defines its next search algorithm.
   *
   * @param {String} search - search selected by the user.
   */
  setSearch(search){
    this.curr_search = search
  }
  
  /*
   * Updates the agent's position according to its path array, also creates an over-
   * lay to display the path taken.
   */
  move(){
    // The agent moves towards the food to collect it following the path resulting 
    // from the search; (8)
    
    // Considering different speeds for each terrain
    if(this.grid[this.coord.x][this.coord.y].type == 0) this.drag = 20;
    if(this.grid[this.coord.x][this.coord.y].type == 1) this.drag = 40;
    if(this.grid[this.coord.x][this.coord.y].type == 2) this.drag = 60;
    //this.drag = this.grid[this.coord.x][this.coord.y].cost * 10;
    
    // It cannot move diagoally
    for (const { dr, dc, name } of this.directions) {
      const newCol = this.coord.x + dc;
      const newRow = this.coord.y + dr;
      
      if (this.path[this.step] == name){
        this.coord.add(dc, dr)
        this.step++;
        break;
      }
    }
    
    // When the collision between the agent and the food occurs, the food disappears 
    // from the environment and is counted; (9)
    if(this.coord.equals(this.target)) {
      // Resetting search variables
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
      console.log(`Food collected at ${this.target.x}, ${this.target.y}`)
    }
  }
  
  /*
   * Delays the execution in orther to properly display search steps
   *
   * @param {number} ms - delay time in milliseconds.
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  
  /*
   * Unset every overlay (and border) cells
   */
  eraseOverlay(){
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;

    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < numRows; row++) {
        this.grid[col][row].overlay = false;
        this.grid[col][row].border = false;
      }
    }
  }
  
  /*
   * Highlights the final path to the food in the grid
   */
  showPath(){
    let x = this.coord.x
    let y = this.coord.y
    
    for (let i = 0; i < this.path.length; i++){
      for (const { dr, dc, name } of this.directions) {
        if (this.path[i] == name){
          // Setting final path
          this.grid[x][y].overlay = true;  
          this.grid[x][y].overlay_type = 1;
          this.grid[x][y].update();

          x += dc;
          y += dr;
          break;
        }
      }
    }
    
    this.grid[x][y].overlay = true;  
    this.grid[x][y].overlay_type = 1;
    this.grid[x][y].update();
  }
  
  /*
   * Checks if an cell is walkable (not a rock)
   *
   * @param {Cell[][]} grid - the whole map.
   * @param {number} col - current column.
   * @param {number} row - current row.
   */
  validCell(grid, col, row) {
    const numCols = grid.length;
    const numRows = grid[0].length;
    return row >= 0 && row < numRows && col >= 0 && col < numCols && grid[col][row].type !== 3;
  }
  
  /*
   * Selects the desired search.
   */
  search(){
    // The agent performs the search considering its current position as the 
    // initial state; (6)
    this.done = false;
    
    switch(this.curr_search){
      case "BFS":
        if(!this.searching) this.BFS();
        break;
        
      case "DFS":
        if(!this.searching) this.DFS();
        break;
        
      case "uniform_cost":
        if(!this.searching) this.uniform_cost();
        break;
        
      case "greedy":
        if(!this.searching) this.greedy();
        break;
        
      case "a_star":
        if(!this.searching) this.a_star();
        break;
        
      default:
        //console.log(this.curr_search);
        break;
    }
    // Each search will define {this.path}
  }
  
  /*
   * Searches using BFS, defines the path to be followed and an overlay showing steps
   */
  async BFS(){
    console.log(`${this.curr_search} selected.`);
    this.searching = true;
    
    let queue = [];
    let visited = new Set();
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    const parentMap = new Map();
    
    queue.push({ col: this.coord.x, row: this.coord.y})
    visited.add(`${this.coord.x}-${this.coord.y}`);
    
    while (queue.length > 0) {
      const { col, row, } = queue.shift();
      
      this.grid[col][row].border = false;
      this.grid[col][row].update();
      
      if (row === this.target.y && col === this.target.x) {
        // Reconstruct the path from the target cell to the starting cell
        const path = [];
        let currCol = col;
        let currRow = row;

        while (currCol !== this.coord.x || currRow !== this.coord.y) {
          const parent = parentMap.get(`${currCol}-${currRow}`);
          path.unshift(parent.direction);
          currCol = parent.col;
          currRow = parent.row;
        }
        this.path = path;
        this.found = true;
        this.searching = false;
        
        // With the search result, the agent defines a path to be followed; (7)
        this.showPath();
      }
      if(!this.found){
        for (const {dr, dc, name} of this.directions) {
          const newCol = col + dc;
          const newRow = row + dr;

          if (this.validCell(this.grid, newCol, newRow) && !visited.has(`${newCol}-${newRow}`)) {
            queue.push({ col: newCol, row: newRow });
            visited.add(`${newCol}-${newRow}`);

            this.grid[newCol][newRow].overlay = true;
            this.grid[newCol][newRow].overlay_type = 0;
            this.grid[newCol][newRow].update();
            
            this.grid[newCol][newRow].border = true;
            this.grid[newCol][newRow].update();

            parentMap.set(`${newCol}-${newRow}`, { col, row, direction: name });
          }
        }
      }
      await this.delay(50);
    }
    this.searching = false;
    
    if(this.path.length == 0){
      console.log("Path not found");
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
    }
  }
  
  /*
   * Searches using DFS, defines the path to be followed and an overlay showing steps
   */
  async DFS(){
    console.log(`${this.curr_search} selected.`);
    this.searching = true;
    
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    const visited = Array.from({ length: numCols }, () => Array(numRows).fill(false));
    let stack = [];
    let parentMap = new Map();

    stack.push({ col: this.coord.x, row: this.coord.y, path: [] });

    while (stack.length > 0) {
      const { col, row, dir } = stack.pop();

      if (visited[col][row]) continue; // Skip already visited cells
      visited[col][row] = true;

      if (col === this.target.x && row === this.target.y) {
        const path = [];
        let currCol = col;
        let currRow = row;
        
        this.grid[currCol][currRow].overlay = true;
        this.grid[currCol][currRow].overlay_type = 0;
        this.grid[currCol][currRow].update();
        
        this.grid[col][row].border = true;
        this.grid[col][row].update();

        while (currCol !== this.coord.x || currRow !== this.coord.y) {
          const parent = parentMap.get(`${currCol}-${currRow}`);
          path.unshift(parent.prevDirection);
          currCol = parent.prevCol;
          currRow = parent.prevRow;
        }
        this.path = path;
        this.found = true;
        this.searching = false;
        
        // With the search result, the agent defines a path to be followed; (7)
        this.showPath();
      }
      
      if(!this.found){
       
        this.grid[col][row].overlay = true;
        this.grid[col][row].overlay_type = 0;
        this.grid[col][row].update();
        
        this.grid[col][row].border = true;
        this.grid[col][row].update();
        
        for (const { dr, dc, name } of this.directions) {
          const newCol = col + dc;
          const newRow = row + dr;
          
          if (this.validCell(this.grid, newCol, newRow) && !visited[newCol][newRow]) {
            stack.push({ col: newCol, row: newRow, direction: name });
            parentMap.set(`${newCol}-${newRow}`, { prevCol: col, prevRow: row, prevDirection: name });
          }
          
        } 
      }
      await this.delay(50);
      this.grid[col][row].border = false;
      this.grid[col][row].update();
    }
    this.searching = false;
    
    if(this.path.length == 0){
      console.log("Path not found");
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
    }
  }
  
  /*
   * Searches using Uniform Cost Search, defines the path to be followed and an overlay 
   * showing steps
   */
  async uniform_cost(){
    console.log(`${this.curr_search} selected.`);
    this.searching = true;
    
    let priority_queue = [];
    let distances = [];
    let visited = new Set();
    const parentMap = new Map();
    
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    const maxDistance = 10000000000;
    
    for(let i = 0;i < numCols;i++) {
      let rowDistances = new Array(numRows).fill(maxDistance);
      distances.push(rowDistances);
    }
    
    priority_queue.push({col : this.coord.x, row : this.coord.y, cost : 0});
    visited.add(`${this.coord.x}-${this.coord.y}`);
    distances[this.coord.x][this.coord.y] = 0;
    
    while(priority_queue.length > 0) {
      const { col, row, cost} = priority_queue.shift();
      
      if (row === this.target.y && col === this.target.x) {
        const path = [];
        let currCol = col;
        let currRow = row;

        while (currCol !== this.coord.x || currRow !== this.coord.y) {
          const parent = parentMap.get(`${currCol}-${currRow}`);
          path.unshift(parent.direction);
          currCol = parent.col;
          currRow = parent.row;
        }
        this.path = path;
        this.found = true;
        this.searching = false;
        
        // With the search result, the agent defines a path to be followed; (7)
        this.showPath();
      }
      
      if(!this.found){
        for (const { dr, dc, name } of this.directions) {
          const newCol = col + dc;
          const newRow = row + dr;
          let terrain;

          if(!this.validCell(this.grid, newCol, newRow) || this.grid[newCol][newRow].type == 3) continue;

          this.grid[newCol][newRow].overlay = true;
          this.grid[newCol][newRow].overlay_type = 0;
          this.grid[newCol][newRow].update();

          terrain = this.grid[newCol][newRow].cost;

          if (!visited.has(`${newCol}-${newRow}`) && terrain + cost < distances[newCol][newRow] ) {
            this.grid[newCol][newRow].border = true;
            this.grid[newCol][newRow].update();
            
            distances[newCol][newRow] = terrain + cost;
            priority_queue.push({col : newCol, row : newRow, cost : distances[newCol][newRow]});
            priority_queue.sort((a, b) => a.cost - b.cost )
            visited.add(`${newCol}-${newRow}`);
            parentMap.set(`${newCol}-${newRow}`, { col, row, direction: name });
          }
        }
      }
      await this.delay(50);
      this.grid[col][row].border = false;
      this.grid[col][row].update();
    }
    this.searching = false;
    
    if(this.path.length == 0){
      console.log("Path not found");
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
    }
  }
  
  /*
   * Searches using Greedy Search, defines the path to be followed and an overlay 
   * showing steps
   */
  async greedy(){
    console.log(`${this.curr_search} selected.`);
    this.searching = true;
    
    let priority_queue = [];
    let distances = [];
    let visited = new Set();
    const parentMap = new Map();
    
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    const maxDistance = 10000000000;
    let cellSize = 40;
    
    for(let i = 0;i < numCols;i++) {
      let rowDistances = new Array(numRows).fill(maxDistance);
      distances.push(rowDistances);
    }
    
    priority_queue.push({col : this.coord.x, row : this.coord.y, cost : 0});
    visited.add(`${this.coord.x}-${this.coord.y}`);
    distances[this.coord.x][this.coord.y] = 0;
    
    while(priority_queue.length > 0) {
      const { col, row, cost} = priority_queue.shift();
      
      if (row === this.target.y && col === this.target.x) {
        const path = [];
        let currCol = col;
        let currRow = row;

        while (currCol !== this.coord.x || currRow !== this.coord.y) {
          const parent = parentMap.get(`${currCol}-${currRow}`);
          path.unshift(parent.direction);
          currCol = parent.col;
          currRow = parent.row;
        }
        this.path = path;
        this.found = true;
        this.searching = false;
        
        // With the search result, the agent defines a path to be followed; (7)
        this.showPath();
      }
      
      if(!this.found){
        for (const { dr, dc, name } of this.directions) {
          const newCol = col + dc;
          const newRow = row + dr;

          if(!this.validCell(this.grid, newCol, newRow) || this.grid[newCol][newRow].type == 3) continue;

          let myPosX = this.coord.x;
          let myPosY = this.coord.y;

          let heuristic = abs(newCol- this.target.x) + abs(newRow - this.target.y);

          if (!visited.has(`${newCol}-${newRow}`) && heuristic < distances[newCol][newRow] ) {
            this.grid[newCol][newRow].overlay = true;
            this.grid[newCol][newRow].overlay_type = 0;
            this.grid[newCol][newRow].update();
            
            this.grid[newCol][newRow].border = true;
            this.grid[newCol][newRow].update();

            distances[newCol][newRow] = heuristic;
            priority_queue.push({col : newCol, row : newRow, cost : distances[newCol][newRow]});
            priority_queue.sort((a, b) => a.cost - b.cost )
            visited.add(`${newCol}-${newRow}`);
            parentMap.set(`${newCol}-${newRow}`, { col, row, direction: name });
          }

        }
      }
      await this.delay(50);
      this.grid[col][row].border = false;
      this.grid[col][row].update();
    }
    this.searching = false;
    
    if(this.path.length == 0){
      console.log("Path not found");
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
    }
  }
  
  /*
   * Searches using A* Search, defines the path to be followed and an overlay showing 
   * steps
   */
  async a_star(){
    console.log(`${this.curr_search} selected.`);
    this.searching = true;
    
    let priority_queue = [];
    
    let visited = new Set();
    const numCols = this.grid.length;
    const numRows = this.grid[0].length;
    const maxDistance = 10000000000;
    const parentMap = new Map();
    let distances = [];
    let cellSize = 40;
    
    for(let i = 0;i < numCols;i++) {
      let rowDistances = new Array(numRows).fill(maxDistance);
      distances.push(rowDistances);
    }
    
    priority_queue.push({col : this.coord.x, row : this.coord.y, cost : 0});
    visited.add(`${this.coord.x}-${this.coord.y}`);
    distances[this.coord.x][this.coord.y] = 0;
    
    while(priority_queue.length > 0) {
      const { col, row } = priority_queue.shift();
      
      if (row === this.target.y && col === this.target.x) {
        const path = [];
        let currCol = col;
        let currRow = row;

        while (currCol !== this.coord.x || currRow !== this.coord.y) {
            let parent = parentMap.get(`${currCol}-${currRow}`);
            path.unshift(parent.direction);
            currCol = parent.col;
            currRow = parent.row;
        }
        this.path = path;
        this.found = true;
        this.searching = false;
        
        // With the search result, the agent defines a path to be followed; (7)
        this.showPath();
      }
      
      if(!this.found){
        for (const { dr, dc, name } of this.directions) {
          const newCol = col + dc;
          const newRow = row + dr;
          let terrain;

          if(!this.validCell(this.grid, newCol, newRow) || this.grid[newCol][newRow].type == 3) continue;

          let myPosX = this.coord.x;
          let myPosY = this.coord.y;
          
          let cost = distances[col][row];
          terrain = this.grid[newCol][newRow].cost;

          let heuristic = abs(newCol - this.target.x) + abs(newRow - this.target.y);

          if (!visited.has(`${newCol}-${newRow}`) && terrain + cost < distances[newCol][newRow] ) {
            this.grid[newCol][newRow].overlay = true;
            this.grid[newCol][newRow].overlay_type = 0;
            this.grid[newCol][newRow].update();
            
            this.grid[newCol][newRow].border = true;
            this.grid[newCol][newRow].update();

            distances[newCol][newRow] = terrain + cost;
            priority_queue.push({col : newCol, row : newRow, cost : heuristic + distances[newCol][newRow] });
            priority_queue.sort((a, b) => a.cost - b.cost )
            visited.add(`${newCol}-${newRow}`);
            parentMap.set(`${newCol}-${newRow}`, { col, row, direction: name });
          }
        }
      } 
      await this.delay(50);
      this.grid[col][row].border = false;
      this.grid[col][row].update();
    }
    this.searching = false;
    
    if(this.path.length == 0){
      console.log("Path not found");
      this.done = true;
      this.found = false;
      this.step = 0;
      this.path = [];
      
      this.eraseOverlay();
    }
  }
}
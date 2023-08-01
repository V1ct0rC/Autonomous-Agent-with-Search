/*
 * Represents each square cell on the sceario.
 */
class Cell{
  /*
   * Create an cell instance.
   *
   * @param {number} x - its x coordinate.
   * @param {number} y - its y coordinate.
   * @param {number} type - its terrain type (0-grass, 1-swmp, 2-lake, 3-rock).
   * @param {number} code - each cell has an code.
   */
  constructor(x, y, type, code){
    this.coord = createVector(x, y);
    this.type = type;
    this.code = code
    
    // Setting color
    this.color_list = ['#a4df07', '#a79776', '#71a0c2', '#636162'];
    this.typecolor = this.color_list[this.type];
    
    // Settig cost
    this.cost_list = [1, 5, 10];
    this.cost = this.cost_list[this.type];
    
    // Control variables
    this.has_agent = false;
    this.has_food = false;
    
    // Overlay settings
    this.overlay = false;
    this.overlay_type = 0;
    this.color_list_overlay = ['#2523E275', '#FF110059'];
    this.typecolor_overlay = this.color_list_overlay[this.overlay_type];
    
    this.border = false;
    this.color_border = '#2523E2';
  }
  
  /*
   * Updates its color according to possible changes
   *
   */
  update(){
    this.typecolor_overlay = this.color_list_overlay[this.overlay_type];
    this.typecolor = this.color_list[this.type];
  }
  
  /*
   * Changes the (terrain) type of the cell
   *
   * @param {number} type - its new terrain type (0-grass, 1-swmp, 2-lake, 3-rock).
   */
  changeType(type){
    this.type = type;
    this.typecolor = this.color_list[this.type];
    this.cost = this.cost_list[this.type];
  }
}
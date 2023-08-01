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
    
    // Loading textures
    this.texture_list = [loadImage('assets/grass_pixel1.png'), loadImage('assets/swamp_pixel1.png'), 
                         loadImage('assets/water_pixel2.png'), loadImage('assets/stone_pixel1.png')];
    this.typetexture = this.texture_list[this.type];
    
    // Settig cost
    this.cost_list = [1, 5, 10];
    this.cost = this.cost_list[this.type];
    
    // Control variables
    this.has_agent = false;
    this.has_food = false;
    this.is_rotten = false;
    
    // Overlay settings
    this.overlay = false;
    this.overlay_type = 0;
    this.color_list_overlay = ['#2523E266', '#FF110033'];
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
  }
  
  /*
   * Changes the (terrain) type of the cell, used during scenario generation
   *
   * @param {number} type - its new terrain type (0-grass, 1-swmp, 2-lake, 3-rock).
   */
  changeType(type){
    this.type = type;
    this.typetexture = this.texture_list[this.type];
    this.cost = this.cost_list[this.type];
  }
}
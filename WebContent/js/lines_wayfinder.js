/**
 * field settings
 */
//default settings
var field_width      = 9;
var field_width_max  = 30;
var field_height     = 9;
var field_height_max = 30;
var field_array      = new Array(); // -1 - empty, else - color of the ball
var fields_empty     = field_width * field_height;
var line_len_min     = 5;           // length of the line for remove
var add_balls        = 3;
var add_balls_min    = 1;
var add_balls_max    = 10;
var force_insert     = true;        // insert 0+ balls or the number

//game vars
var score            = 0; 
var ball_selected    = false; 
var bonus_turn       = false;
var queued_colors    = new Array(); //colours for the next balls

//arrays for search
var open_nodes       = new Array(); //
var closed_nodes     = new Array(); //
var path_to_move     = new Array(); //

/**
 * possible ball colors
 */
var possible_colors = new Array('black',
                                'blue',
                                'green',
                                'yellow',
                                'magenta',
                                'red',
                                'white',
                                'grey',
                                'orange',
                                'smiley',
                                'smiley-confuse',
                                'smiley-cool',
                                'smiley-cry',
                                'smiley-draw',
                                'smiley-eek',
                                'smiley-evil'
                                );
var default_colors_qty = 7;

/**
 * array with ball colors
 */
var colors = new Array();

for(var i = 0 ; 
        i < default_colors_qty ;
        i++ ) 
{
  colors.push(possible_colors[i]);
}

/**
 * adds another color to the color array
 * @param {String} color_name
 * @returns {bool} 
 */
function colorsAddColor(color_name)
{  
  if(colors.indexOf(color_name) != -1)
  {
    return false;
  }
  colors.push(color_name);
  return true;
}

/**
 * removes color from array and reindexes it
 * @param {String} color_name
 * @returns {bool}
 */
function colorsRemoveColor(color_name)
{
  if(colors.length < 2)
  {    
    alert(text_cannot_remove_last_color);
    return false;  
  }
  
  var index = colors.indexOf(color_name);
  if(index == -1)
  {
    return false;
  }
  colors.splice(index, 1);  
  return true;
}

/**
 * returns random color index
 * @returns {number}
 */
function getRandomColor()
{
	var random = Math.floor(Math.random() * colors.length);
	return random;	
}

/**
 * returns the name of the color by index
 * @param   {number} color_index
 * @returns {String}
 */
function getColorName(color_index)
{
	//for debug mode, to find out, what's happening
	if(colors[color_index] == undefined)
	{
	  alert(text_error_color_index_part_1 + 
			    color_index + 
			    text_error_color_index_part_2); 
	  return colors[1];
	}	
	return colors[color_index];
}

/**
 * gets the first colour from the queued_colors and fills the queue again
 * @returns {number}
 */
function getQueuedColor()
{
  //remove spare balls if queue is to long
  while(queued_colors.length > add_balls)
  {
    queued_colors.pop();
  }  
	//fill colours
	if(queued_colors.length < add_balls)
	{
		for(var i = add_balls - queued_colors.length ;
		    i > 0 ;
		    i--)
		{
			queued_colors.push(getRandomColor());
			//console.log(i);
		}
	}	
	queued_colors.push(getRandomColor());	
	return queued_colors.shift();
}

/**
 * gets x and y as integers from the id
 * @param string id
 * @returns array((int)y, (int)x)
 */
function getCoordsFromId(elem_id)
{	
	var delimiter_pos = elem_id.indexOf('_');
	var elem_y        = parseInt(elem_id.substring(0, delimiter_pos), 10);
	var elem_x        = parseInt(elem_id.substring(delimiter_pos + 1), 10);
	var coords        = new Array(elem_y, elem_x);
	return coords;
}


/**
 * redraws field and restarts game
 * @param   {Boolean} no_confirm 
 * @returns {Boolean}
 */
function restartGame(no_confirm)
{
	if(!no_confirm && !confirm(text_sure))
	{
		return false;
	}		
	pausecomp(20);
	
	fields_empty  = field_width * field_height;
	score         = 0; 
	ball_selected = false; 
	bonus_turn    = false;
	queued_colors = new Array();
	
	drawGameboard(field_height, field_width, 'place_for_board');
	
	initGame();
	return false;
}

/**
 * draws table rows and cols
 * @param {number} rows
 * @param {number} cols
 * @param {String} elem_id
 */
function drawGameboard(rows, cols, elem_id)
{	
	var output_table = '<table class="board">';	
	for (i_row = 0 ; i_row < rows ; i_row++) 
	{		
		field_array[i_row] = new Array();
		output_table       = output_table + '<tr>';
		for (i_col = 0 ; i_col < cols ; i_col++)
		{
			field_array[i_row][i_col]  = -1;
			output_table               = output_table + 
			'<td><a href="javascript:;">'+
			'<div class="cell" id="'+i_row+'_'+i_col+'">'+
			'</div></a></td>';
		}		
		output_table = output_table + '</tr>';
	}
	output_table = output_table + '</table>';	
	if(elem_id)
	{
		$('#'+elem_id).html(output_table);
		return;
	}
	document.write(output_table);
}

/**
 * puts ball to field
 * @param string elem_id
 * @param int    ball_color
 * @param {bool} fade_in
 */
function putBall (elem_id, ball_color, fade_in)
{
	if(ball_color == null)
	{
		ball_color = getQueuedColor();
		//ball_color = getRandomColor();
	}	
	
	if(fade_in)
	{	 
    $('#'+elem_id).fadeOut(1,
        
      function()
      {    
        $(this).addClass('ball');
        $(this).addClass('b-'+getColorName(ball_color));
        $(this).fadeIn(1);    
      }
    );  
	}
	else
	{
	  $('#'+elem_id).addClass('ball');
	  $('#'+elem_id).addClass('b-'+getColorName(ball_color));	  
	}
	
	var coords = getCoordsFromId(elem_id);
	field_array[coords[0]][coords[1]] = ball_color;
	balls_added++;
	fields_empty--;		
	ballHasLine(elem_id, ball_color);
	updateGui();
}

/**
 * removes ball from field
 * @param elem_id
 * @param {bool} fade_out 
 */
function removeBall (elem_id,fade_out)
{
  if(fade_out)
  {
    $('#'+elem_id).fadeOut(800,
        
        function()
        {    
          $(this).removeClass();
          $(this).addClass('cell');
          $(this).fadeIn(1);    
        }
    );    
  }
  else
  {
      $('#'+elem_id).removeClass();
      $('#'+elem_id).addClass('cell');    
  }  
	
	var coords = getCoordsFromId(elem_id);
	field_array[coords[0]][coords[1]] = -1;
	fields_empty++;
	updateGui();
}

/**
 * randomly adds balls to field
 * @param   int balls_qty
 * @returns int balls_added
 */
function addBallsToField(balls_qty)
{
	balls_added = 0;
	if(fields_empty < 1)
	{
		alert(text_no_more_fields);
		return balls_added;
	}	
	for(balls = balls_qty ; balls > 0 ; balls--)
	{		
		var random_y = Math.floor(Math.random() * field_height);
		var random_x = Math.floor(Math.random() * field_width);
		var field_id = '';
		
		//try the fast method first
		if(isWalkable(random_x, random_y)) // field_array[random_y][random_x] < 0)
		{	
			putBall (random_y+'_'+random_x);			
		}
		else if(force_insert && // hard mode
		        (field_id = getRandomFreeField()))
		{
		  //put ball to random free field
		  putBall (field_id);			
		}			
	  
		//game over
		if(fields_empty < 1)
		{
		  alert(text_no_more_fields);
		  return balls_added;
		}
	}	
	return balls_added;
}

/**
 * returns array with free fields
 * @returns {Array}
 */
function findFreeFields()
{
  var empty_fields = new Array();
  //loop through fields, test if free
  for(y = 0 ; y < field_width ; y++)
  {
    for(x = 0 ; x < field_height ; x++)
    {
      if(isWalkable(x, y))
      {
        empty_fields.push(y+'_'+x);
      }      
    }
  }  
  return empty_fields;
}

/**
 * returns id of the free field or null
 * @returns {mixed}
 */
function getRandomFreeField()
{
  var free_feilds = findFreeFields();   
  if(free_feilds.length < 1)
  {
    return false;    
  }    
  return free_feilds[Math.floor(Math.random() * free_feilds.length)];
}

/**
 * tests if this ball builds a line
 * @param   string ball_id
 * @param   int    ball_color
 * @returns false or array with ids 
 */
function ballHasLine(ball_id, ball_color)
{
	var line          = false;
	var line_len      = 0;	
	var coords        = getCoordsFromId(ball_id);
	var elem_y        = coords[0];
	var elem_x        = coords[1];
	
	//find lines
	var line_n  = doLine(elem_x, elem_y,  0, -1, ball_color, false); 
	var line_no = doLine(elem_x, elem_y,  1, -1, ball_color, false); 
	var line_o  = doLine(elem_x, elem_y,  1,  0, ball_color, false); 
	var line_os = doLine(elem_x, elem_y,  1,  1, ball_color, false); 
	var line_s  = doLine(elem_x, elem_y,  0,  1, ball_color, false); 
	var line_sw = doLine(elem_x, elem_y, -1,  1, ball_color, false);
	var line_w  = doLine(elem_x, elem_y, -1,  0, ball_color, false);
	var line_nw = doLine(elem_x, elem_y, -1, -1, ball_color, false); 
	
	var line_hor       = line_o + line_w;
	//console.log('hor: '+line_hor);
	var line_ver       = line_n + line_s;
	//console.log('ver: '+line_ver);
	var line_slash     = line_sw + line_no;
	//console.log('slash: '+line_slash);
	var line_backslash = line_os + line_nw;
	//console.log('backslash: '+line_backslash);
		
	//delete lines
	if(line_hor >= line_len_min-1)
	{
		//alert(line_hor +' '+ line_len);
	  line_len   += line_hor;
		var line_o  = doLine(elem_x, elem_y,  1,  0, ball_color, true); 
		var line_w  = doLine(elem_x, elem_y, -1,  0, ball_color, true);
		line = true;
	}
	if(line_ver >= line_len_min-1)
	{
		//alert(line_ver +' '+ line_len);
	  line_len   += line_ver;
		var line_n  = doLine(elem_x, elem_y,  0, -1, ball_color, true); 
		var line_s  = doLine(elem_x, elem_y,  0,  1, ball_color, true);
		line = true;
	}
	if(line_slash >= line_len_min-1)
	{
		//alert(line_slash +' '+ line_len);
	  line_len   += line_slash;
		var line_no = doLine(elem_x, elem_y,  1, -1, ball_color, true); 
		var line_sw = doLine(elem_x, elem_y, -1,  1, ball_color, true);
		line = true;
	}
	if(line_backslash >= line_len_min-1)
	{
		//alert(line_backslash +' '+ line_len);
	  line_len   += line_backslash;
		var line_os = doLine(elem_x, elem_y,  1,  1, ball_color, true); 
		var line_wn = doLine(elem_x, elem_y, -1, -1, ball_color, true);
		line = true;
	}
	
	if(line)
	{
		removeBallInLine(elem_x, elem_y);
		++line_len;
	}
	
	//console.log(line_len);
	updateGui();
	doBonusPoints(line_len);
	return line;
}

/**
 * calculates bonus points and adds them to score
 * @param {number} balls
 */
function doBonusPoints(balls)
{
  //if balls > line_len_min                  -> double score
  //if balls > (field_width+field_height)/2  -> x10
  if(balls > ((field_width+field_height)/2))
  {
    score = score + balls*9;
    //$('#score').html(score+' (x10)');
    alert(balls+' x10');
  }
  else if(balls > line_len_min)
  {
    score = score + balls;
    //$('#score').html(score+' (x2)');
    alert(balls+' x2');
  }
}

/**
 * searches for the balls with defined color
 * returns the length of the found line and 
 * removes it, if erase == true
 * @param cur_x     int 
 * @param cur_y     int 
 * @param inc_x     int 
 * @param inc_y     int 
 * @param color     int
 * @param erase     bool
 * @returns {Number}
 */
function doLine(cur_x, cur_y, inc_x, inc_y, color, erase)
{
	var found = 0;
	var new_x = cur_x + inc_x;
	var new_y = cur_y + inc_y;

	if(!fieldExists(new_x, new_y))
	{
		return found;		
	}
	
	if(field_array[new_y][new_x] == color) //right color on new position?
	{
		//console.log(colors[color] + ': ' + new_x + ' - ' + new_y + ' ('+found+')');
		found++;
		if(erase == true)
		{
			removeBallInLine(new_x, new_y);	
			bonus_turn = true;
		}
		found = found + doLine(new_x, new_y, inc_x, inc_y, color, erase);
	}	
	//console.log(found);
	return found;
}

/**
 * selects field
 * @param x
 * @param y
 */
function selectField(x, y)
{
	var elem_id = '';
	elem_id     = y + '_' + x;
	//alert('('+elem_id+')');
	$('#'+elem_id).addClass('selected');
}

/**
 * removes field's selection
 * @param x
 * @param y
 */
function deselectField(x, y)
{
	var elem_id = y + '_' + x;
	$('#'+elem_id).removeClass('selected');
}

/**
 * removes balls for the line
 * also adds score and does stuff
 * @param new_x
 * @param new_y
 */
function removeBallInLine(new_x, new_y)
{
	selectField(new_x, new_y);
	removeBall(new_y + '_' + new_x);
	deselectField(new_x, new_y);
	addScore();
}

/**
 * adds score and does stuff
 */
function addScore(new_score)
{   
	if(new_score == null)
	{
		score++;
	}
	else
    {
		score = new_score;
    }
	updateGui();
}

/**
 * writes vars to GUI
 */
function updateGui()
{
	$('#score').html(score);	
	$('#fields_empty').html(fields_empty);
	
	var output = '';
	for(var i = 0;
	    i < queued_colors.length ;
	    i++ )
	{
		//<div class="cell ball b-magenta"></div>
		//	$('#'+elem_id).removeClass();
		//$('#'+elem_id).addClass('cell');
		//output = output + queued_colors[i] + ' ';
		
		var output = output + 
					'<span class="cell ball b-'+getColorName(queued_colors[i])+
					'">&nbsp;&nbsp;&nbsp;&nbsp;</span>';
		
	}	
	$('#next_balls').html(output);
	//console.log(queued_colors);
}

/**
 * tests if fiel exist
 * @param x
 * @param y
 * @returns {Boolean}
 */
function fieldExists(x, y)
{
	if(x < 0 || 
	   y < 0 ||
	   x+1 > field_width ||
	   y+1 > field_height)
	{
		return false;
	}	
	return true;
}

/**
 * tests if field is free
 * @param x
 * @param y
 * @returns {Boolean}
 */
function isWalkable(x, y) 
{
	if(fieldExists(x, y))
	{
		return field_array[y][x] == -1;
	}
	return false;
}

/**
 * select a ball for manupulations
 * @param elem_id
 */
function chooseBall(elem_id)
{
	var coords = getCoordsFromId(elem_id);
	if(ball_selected != false)
  {
		//console.log(ball_selected);
		deselectField(ball_selected[1],ball_selected[0]);
  }	
	selectField(coords[1],coords[0]);
	ball_selected = coords;
}

/**
 * moves ball to another field
 * @param elem_id
 */
function moveSelectedBallTo(elem_id)
{
	var coords = getCoordsFromId(elem_id);	
	initSearch(ball_selected[1],ball_selected[0]);
	//console.log(ball_selected[1] +' - '+ball_selected[0]);
	if(isNodeInArray(closed_nodes, elem_id) == false)
	{
		//console.log(closed_nodes);
		//console.log(open_nodes);
		//console.log(elem_id);
		alert(text_no_way);
		return;
	}
	
	ball_color = field_array[ball_selected[0]][ball_selected[1]];	
	//console.log(elem_id + ': ' + ball_color);	
  deselectField(ball_selected[1],ball_selected[0]);
  
  moveBallFromTo(ball_selected[0]+'_'+ball_selected[1], 
                 elem_id, 
                 ball_color);
  
  ball_selected = false; //?
    
  if(bonus_turn)
  {    	
  	bonus_turn = false;
  	return;
  }
  addBallsToField(add_balls);
}

/**
 * organize movement of the ball
 * @param start_id
 * @param target_id
 * @param ball_color
 */
function moveBallFromTo(start_id, target_id, ball_color)
{
  //@todo move to global
  var with_path = true;
  
  if(!with_path)
  {
    //jump to the field
    removeBall(start_id, false);
    putBall(target_id, ball_color, false);    
  }
  else
  {
    //with the movement
    generatePath(target_id);  
    var cur_id  = start_id;
    while(path_to_move.length > 0)
    {    
      var next_id = path_to_move.pop();
      removeBall(cur_id, true);
      putBall(next_id, ball_color, false);
      cur_id  = next_id;
    }    
  }  
}


/**
 * fills path_to_move with the path from the start top the target node
 * @param target_id
 */
function generatePath(target_id)
{
  path_to_move    = new Array();
  var target_key  = isNodeInArray(closed_nodes, target_id);
  var target_node = closed_nodes[target_key];  
  do
  {
    path_to_move.push(target_node[0]);   
    target_node = target_node[3];
  }
  while(target_node[3]);
}

/**
 * prepares walkable area for start node
 * @param int x
 * @param int y
 */
function initSearch(x, y)
{
	//clear arrays
	open_nodes   = new Array();
	closed_nodes = new Array();
	//move start to closed_nodes
	//node format {id,x,y,ParentNode()}
	var start_node = new Array(y+'_'+x, x, y, null);
	closed_nodes.push(start_node);
	//find it's neghbours 
	findNeighbours(x,y,start_node);
	
	//loop through neigbours, start findNeighbours for them
	//and move them to closed_nodes
	var test = 10;
	while(open_nodes.length > 0)
	{
		var node = open_nodes.shift();
		closed_nodes.push(node);		
		findNeighbours(node[1], node[2], node);
		//selectField(node[1], node[2]);
		if(test < 1) //for debug
		{
			//return;
		}
		--test;
	}
}

/**
 * finds all neighbour fields, tests if they are walkable
 * and saves them to open nodes
 * @param   int x
 * @param   int y
 * @param   Node parent_node
 * @returns int nighbours_found
 */
function findNeighbours(x,y,parent_node)
{
	var tmp             = 0;	
	var nighbours_found = 0;
	//find 4 neighbours and move them to open_nodes
	//if they are walkable
	tmp = x-1;
	if(isWalkable(tmp, y) &&
	   isNodeInArray(open_nodes, y+'_'+tmp)   == false &&
	   isNodeInArray(closed_nodes, y+'_'+tmp) == false)
	{
		var node = new Array(y+'_'+tmp, tmp, y, parent_node);			
		open_nodes.push(node);
		++nighbours_found;
	}
	
	tmp = x+1;
	if(isWalkable(tmp, y) &&
	   isNodeInArray(open_nodes, y+'_'+tmp)   == false &&
	   isNodeInArray(closed_nodes, y+'_'+tmp) == false)
	{
		var node = new Array(y+'_'+tmp, tmp, y, parent_node);	
		open_nodes.push(node);
		++nighbours_found;
	}
	
	tmp = y-1;
	if(isWalkable(x, tmp) &&
	   isNodeInArray(open_nodes, tmp+'_'+x)   == false &&
	   isNodeInArray(closed_nodes, tmp+'_'+x) == false)
	{
		var node = new Array(tmp+'_'+x, x, tmp, parent_node);	
		open_nodes.push(node);
		++nighbours_found;
	}
	
	tmp = y+1;
	if(isWalkable(x, tmp) &&
	   isNodeInArray(open_nodes, tmp+'_'+x)   == false &&
	   isNodeInArray(closed_nodes, tmp+'_'+x) == false)
	{
		var node = new Array(tmp+'_'+x, x, tmp, parent_node);	
		open_nodes.push(node);
		++nighbours_found;
	}	
	return nighbours_found;
}

/**
 * tests if node is in array
 * @param array nodes
 * @param string node_id
 * @returns {Boolean} / {Number} array key of the element
 */
function isNodeInArray(nodes, node_id)
{
	//loop through array and return true if node is in array
    for ( var i = 0 ; i < nodes.length ; i++ ) 
    {
    	if(nodes[i][0] == node_id)
    	{
    	  return i;
    	  //return true;
    	}
    }	
	return false;
}

/**
 * makes pause for millis ms
 * @param millis
 * @author www.sean.co.uk
 */
function pausecomp(millis) 
{
  var date = new Date();
  var curDate = null;  
  do 
  { 
    curDate = new Date(); 
  } 
  while(curDate-date < millis);
}

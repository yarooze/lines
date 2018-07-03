/**
 * 
 */

//a litle bit oop for a*
//actually not used yet

/**
 * @class Node
 */
function Node(x,y)
{
	//fields
	this.x = x;
	this.y = y;
	
	this.f = 0; //distance to goal
	this.g = 0;
	this.h = 0;
	
	this.prev_id = null //we save the prev node
	
	//methods
	this.distance = distance;
	this.isEqual  = isEqual;
}

/**
 * returns the distance to the goal node
 * methos for Node Class
 * @param   Node goal_node
 * @returns int
 */
function distance(goal_node)
{
	//var coords = getCoordsFromId(goal_node_id);
	var dx     = goal_node.x - this.x;
	var dy     = goal_node.y - this.y;
	
	return dx*dx + dy*dy;
}

/**
 * checks if this node is the goal node
 * methos for Node Class
 * @param   Node goal_node
 * @returns bool 
 */
function isEqual(goal_node)
{
	//var coords = getCoordsFromId(goal_node_id);
	return (goal_node.x == this.x && goal_node.y == this.y)
}
//Class Node end

/**
 * compares two nodes if the second one 
 * is closer than the first one
 * @param Node lhs
 * @param Node rhs
 * @returns bool
 */
function compareNode(lhs, rhs)
{
	return lhs.f > rhs.f;
}

/**
 * sorts array with nodes
 * @param   array to_sort
 * @returns array
 */
function nodeArraySort(to_sort) 
{
   var sorted = false; 
   while (!sorted) 
   {
	  sorted = true;
      for (var i=0; i<to_sort.length-1; i++) 
      {
         if (compareNode(to_sort[i], to_sort[i+1])) 
         {
        	sorted       = false;
            tmp_var      = to_sort[i];
            to_sort[i]   = to_sort[i+1];
            to_sort[i+1] = tmp_var;
         }
      }
   }
   return to_sort;
}

/**
 * starts search 
 * @param Node start
 * @param Node end
 */
function startSearch(start_node, end_node)
{
	//var array_size = field_array.length;
	open_nodes     = new Array();
	closed_nodes   = new Array();

	start          = start_node;
	end            = end_node;
	start.h        = start.distance(end);
	start.f        = start.h;
	
	count          = 0;

	//and moar...
	
//	open_nodes.push(start);
//	open_nodes = nodeArraySort(open_nodes);	
}

/**
 * search function
 * @returns {Boolean}
 */
function step()
{
	if(open_nodes.length < 1)
	{		
		return false;
	}
	
	n = open_nodes.shift();
	
	//and moar...
}


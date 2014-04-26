#pragma strict
//name icon image
public var iconName : String = "wayIcon.psd";

//radius of each collision detecton with the enemy
public var radius : float  = 1.0;
//toggle of order direction (first to last index)
public var orderDirection : boolean = false;

//get all the transforms of teh waypoints
private var waypoints : Transform[];
//current waypoint index
private var int_wayIndex : int;
//next waypoint index
private var int_nextIndex : int;
//length of the array containing all index
private var int_wayLength : int;
//movement direction of the enemy to next waypoint
private var v3_direction : Vector3;
//cheking if the enemy hit the waypoint
private var b_isHitRadius : boolean;

function Awake() : void{
	//get all the transforms of the gameobject  include the children  and the transform of this gameobject
	waypoints = gameObject.GetComponentsInChildren.<Transform>();
	//set up the length of all transform
	int_wayLength = waypoints.Length;
	int_wayIndex = 0;
	int_nextIndex = 1;
	//cheking the orderDirection; if it's false, it's mean the AI
	//isn't moving by order, so using the random index of waypoint
	if(!orderDirection){
		var int_randomWay : int = Mathf.Floor(Random.value * int_wayLength);
		//cheking if the waypoint length is more than 1
		if(int_wayLength > 1){
			//use random index
			while(int_wayIndex == int_randomWay){
				int_randomWay = Mathf.Floor(Random.value * int_wayLength);
			}	
		}
		int_nextIndex = int_randomWay;
	}
	//set the direction to zero
	v3_direction = Vector3.zero;
	//to ignore the first waypoint at the begging of the game
	b_isHitRadius = true;
} 

function Start () {

}

function Update () {

}

public function StartPosition() : Vector3{

	return waypoints[0].position;
}

public function GetDirection(AI : Transform) : Vector3{
	if(Vector3.Distance(AI.position, waypoints[int_nextIndex].position) <= radius){
		//only checks once when the Ai hit de way point
		if(!b_isHitRadius){
			b_isHitRadius = true;
			//update the current wayindex
			int_wayIndex = int_nextIndex;
			if(orderDirection == true){
				//get the next wayIndex
				int_nextIndex = (int_nextIndex + 1) % int_wayLength;
			}else{
				var int_randomWay : int = Mathf.Floor(Random.value * int_wayLength);
				//cheking to make sure that the waypoint length is more than 1
				if(int_wayLength > 1){
					while(int_wayIndex == int_randomWay){
						int_randomWay = Mathf.Floor(Random.value * int_wayLength);
					}	
				}
				int_nextIndex = int_randomWay;
			}
		}
	}else{
		b_isHitRadius = false;
	}
	
	var v3_currentPosition : Vector3 = new Vector3(AI.position.x, waypoints[int_nextIndex].position.y, AI.position.z);
	v3_direction = (waypoints[int_nextIndex].position - v3_currentPosition);
	
	return v3_direction;
}

public function GetDirectionToPlayer(AI : Transform, player : Transform) : Vector3{
//direction from the current position of the enemy to the player
	var v3_currentPosition : Vector3 = new Vector3(AI.position.x, waypoints[int_nextIndex].position.y, AI.position.z);
	var v3_playerPosition : Vector3 = new Vector3(player.position.x, waypoints[int_nextIndex].position.y, player.position.z);
	
	v3_direction = (v3_playerPosition - v3_currentPosition);
	return v3_direction;
}

public function AwayFromWaypoint(AI : Transform, distance : float) : boolean{
	var b_isAway = false;
	//checking if the enemy is away from the target waypoint in the specific distance or not
	if(Vector3.Distance(AI.position, waypoints[int_nextIndex].position) >= distance)
		b_isAway = true;
	return b_isAway;
}

//Debug function. Draw the icon image. the radius, and the line directon each waypoint //////////////
public  function OnDrawGizmos() : void{
	//get all transform of this game objects include the children and the transform of this game object
	var waypointGizmos : Transform[] = gameObject.GetComponentsInChildren.<Transform>();
	if(waypointGizmos != null){
		if(orderDirection){
			//Draw line by the order of each waypoint 0,1,2,3
			for(var orderWaypoint : int = 0; orderWaypoint < waypointGizmos.Length; orderWaypoint++){
				Gizmos.color = Color.red;
				//get the next  waypoint
				var orderNextWaypoint : int = (orderWaypoint + 1) % waypointGizmos.Length;
				Gizmos.DrawLine(waypointGizmos[orderWaypoint].position, waypointGizmos[orderNextWaypoint].position);
				Gizmos.DrawIcon(waypointGizmos[orderWaypoint].position, iconName, true);
				Gizmos.DrawWireSphere(waypointGizmos[orderWaypoint].position, radius);
			}
		}else{
			//Draw line from one point to every point except itself
			for(var uOrderWaypoint : int = 0; uOrderWaypoint < waypointGizmos.Length; uOrderWaypoint++){
				for(var otherWaypoint : int = uOrderWaypoint; otherWaypoint < waypointGizmos.Length; otherWaypoint++){
					Gizmos.color = Color.red;
					Gizmos.DrawLine(waypointGizmos[uOrderWaypoint].position, waypointGizmos[otherWaypoint].position);
				}			
				Gizmos.DrawIcon(waypointGizmos[uOrderWaypoint].position, iconName, true);
				Gizmos.color = Color.green;
				Gizmos.DrawWireSphere(waypointGizmos[uOrderWaypoint].position, radius);
				
			}
		}
	}
}












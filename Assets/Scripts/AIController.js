#pragma strict
//Waypoint
public var wayPoint : Waypoints;
//Rocket Launcher
public var rocketLauncher : RocketLauncher;
//Get the Player
public var player : Transform;
//Animation Params
public var _animation : Animation;
public var idleAnimation : AnimationClip;
public var walkAnimation : AnimationClip;
public var runAnimation : AnimationClip;
public var shotAnimation : AnimationClip;
public var walkAnimationSpeed : float = 1.5;
public var idleAnimationSpeed : float = 1.0;
public var runAnimationSpeed : float = 2.0;
public var shotAnimationSpeed : float = 0.5;
//Character movement speed
public var runSpeed : int = 6;
public var walkSpeed : int = 2;
public var jumpSpeed : float = 8.0;
public var gravity : float = 20.0;
//Shot Range
public var shotRange : float = 15.0;
//Detected the player - increase from the shot range
public var getPlayerRange : float = 5.0;
//Max distance from waypoint
public var waypointDistance : float = 10.0;
//To make the enemy walk for 4 secend - then change to think
public var walkingTime : float = 4.0;
//To make the enemy stop for 2 secend - then change to walk
public var thinkingTime : float = 2.0;
//Ai current HP
public var aiHP : float = 100;

//AI MAx HP
private var aiMaxHP : float;
//Character Controller
private var controller : CharacterController;
//Collision Flag return from Moving the character
private var c_collisionFlags : CollisionFlags;
//Move Params
private var f_verticalSpeed : float = 0.0;
private var f_moveSpeed : float = 0.0;
private var v3_moveDirection : Vector3 = Vector3.zero;
//Boolean
private var b_isRun : boolean;
private var b_isAiming : boolean;
private var b_isJumping : boolean;
private var b_isStop : boolean;
//Shot Params
private var b_isPrepare : boolean = false;
private var b_isShot : boolean = false;
//Rotate Params
private var q_currentRotation : Quaternion; //current rotation of the character
private var q_rot : Quaternion; //Rotate to left or right direction
private var f_rotateSpeed : float = 1.0; //Smooth speed of rotation
//Stop time Counting
private var f_lastTime : float = 0;

private var f_inAirTime : float;
private var f_inAirStartTime : float;

public function Awake() : void{
	controller = GetComponent(CharacterController);
	b_isRun = false;
	b_isAiming = false;
	b_isJumping = false;
	f_moveSpeed = walkSpeed;
	c_collisionFlags = CollisionFlags.CollidedBelow;
	f_moveSpeed = walkSpeed;
	//To make the character stop moving at the certain time
	f_lastTime = Time.time; //Tracking the time between each movement of the character
	b_isStop = false;
	aiMaxHP = aiHP;
	
	//Set up animation speed and wrapmode
	_animation[walkAnimation.name].speed = walkAnimationSpeed;
	_animation[walkAnimation.name].wrapMode = WrapMode.Loop;
	_animation[runAnimation.name].speed = runAnimationSpeed;
	_animation[runAnimation.name].wrapMode = WrapMode.Loop;
	_animation[idleAnimation.name].speed = idleAnimationSpeed;
	_animation[idleAnimation.name].wrapMode = WrapMode.Loop;
}

function Start () {
	transform.position = wayPoint.StartPosition();

}

function Update () {
	if (StaticVars.b_isGameOver == false) {
		var v3_rocketDirection : Vector3 = (player.position - transform.position).normalized;
		//Checking if the enemy position is away from the waypoint in the certain distance, 
		//Make the enemy stop running, shooting, and walk back to the target waypoint
		if (wayPoint.AwayFromWaypoint(transform, waypointDistance)) {
			b_isAiming = false;
			b_isRun = false;
		} else {
			//Checking if the enemy is not aiming - check for running
			if (!Shot(v3_rocketDirection)) {
				//Checking if the ai is run or not aiming
				Run();
			}
		}
		if (!b_isAiming) {
			//If the ai is run don't make it think
			//Get the direction
			if (b_isRun) {
				var v3_targetDirection : Vector3 = wayPoint.GetDirectionToPlayer(transform, player); //Move Direct to the player
			} else {
				if (thinkingTime > 0) {
					if (!IsThinking()) {
						v3_targetDirection = wayPoint.GetDirection(transform); //Use random Direction
					} else {
						v3_targetDirection = Vector3.zero;
					}
				} else {
					v3_targetDirection = wayPoint.GetDirection(transform); //Use random Direction
				}
			}
			
			//If the target direction is not zero - mean there is no button pressing
			if (v3_targetDirection != Vector3.zero) {
				//Rotate toward the target direction
				v3_moveDirection = Vector3.Slerp(v3_moveDirection, v3_targetDirection, f_rotateSpeed * Time.deltaTime);
				//Get only direction by normalize our target vector
				v3_moveDirection = v3_moveDirection.normalized;
			} else {
				v3_moveDirection = Vector3.zero;
			}
			
			//Checking if character is on the ground
			if (!b_isJumping) {
				//Holding Shift to run
				if (b_isRun) {
					f_moveSpeed = runSpeed;
				} else {
					b_isRun = false;
					f_moveSpeed = walkSpeed;
				}  
		        //Press Space to Jump
		        if (Jump(v3_moveDirection)) {
		      	  	b_isJumping = true;
		            f_verticalSpeed = jumpSpeed;
		        }
			}

			// Apply gravity
			if (IsGrounded()) {
				f_verticalSpeed = 0.0; //if our character are grounded
				b_isJumping = false; //Checking if our character is in the air or not
				f_inAirTime  = 0.0;
				f_inAirStartTime = Time.time;
			} else {
				f_verticalSpeed -= gravity * Time.deltaTime; //if our character in the air
				//Count Time
				f_inAirTime = Time.time - f_inAirStartTime;
			}
			
			// Calculate actual motion
			var v3_movement : Vector3 = (v3_moveDirection * f_moveSpeed) + Vector3 (0, f_verticalSpeed, 0); // Apply the vertical speed if character fall down
			v3_movement *= Time.deltaTime;
			
			//Set the prepare animation to false
			b_isPrepare = false;
	
			////////////////////////////////////////////////////////
			//Checking if the character is moving or not
			if (v3_moveDirection != Vector3.zero) {
				if (f_moveSpeed == walkSpeed) {
					_animation.CrossFade(walkAnimation.name);
				} else {
					_animation.CrossFade(runAnimation.name);
				}
			} else {
				_animation.CrossFade(idleAnimation.name);
			}
			// Move the controller
	   		c_collisionFlags = controller.Move(v3_movement);
	   		
	   		//Update rotation of the character
		    if ((v3_moveDirection != Vector3.zero) && (!b_isAiming)) {
		    	transform.rotation = Quaternion.LookRotation(v3_moveDirection);
		    }

		} else {//Aiming
	   		v3_moveDirection = Vector3.MoveTowards(v3_moveDirection, v3_rocketDirection, 0.1);
	   		v3_moveDirection = v3_moveDirection.normalized;
	   		
	   		// Apply gravity
			if (IsGrounded()) {
				f_verticalSpeed = 0.0; //if our character are grounded
				b_isJumping = false; //Checking if our character is in the air or not
				f_inAirTime = 0.0;
				f_inAirStartTime = Time.time;
			} else {
				f_verticalSpeed -= gravity * Time.deltaTime; //if our character in the air
				//Count Time
				f_inAirTime = Time.time - f_inAirStartTime;
			}
			
			// Calculate actual motion
			v3_movement = Vector3 (0, f_verticalSpeed, 0); // Apply the vertical speed if character fall down
			v3_movement *= Time.deltaTime;
			
			//Checking if the character is playing the shot animation
			if (!b_isPrepare) {
				b_isShot = false;
				//Play the shot preparing animation function
				WaitForPrepare();
			} else {
				if (v3_rocketDirection == v3_moveDirection) {
					if (!b_isShot) {
						b_isShot = true;
						//Play the shot animation function
						WaitForShot();
					}
				}
			}
			
			// Move the controller
	   		c_collisionFlags = controller.Move(new Vector3(0, v3_movement.y, 0));
	   		//Update rotation of the character
		    transform.rotation = Quaternion.LookRotation(v3_moveDirection);
		}
	} else {
		//Gameover
		_animation.CrossFade(idleAnimation.name);
	}
			
}

// BEHAVIOR FUNCTIONS OF THE AI //////////////////////////////////////////
//Cheking if the
public function IsGrounded() : boolean{
	return (c_collisionFlags & CollisionFlags.CollidedBelow);
}

public function OnCollisionEnter(col : Collision){
	if(StaticVars.b_isGameOver == false){
		if(col.transform.tag == "Rocket"){
			var rocket : Rocket = col.gameObject.GetComponent(Rocket);
			var f_damage : float = rocket.getDamage();
			//clamp down the hitpoint
			aiHP = Mathf.Clamp(aiHP - f_damage, 0, aiMaxHP);
		}
	}
}

//get the percent of the maximum HP with the current HP
public function GetHpPercent() : float{
	return aiHP /aiMaxHP;
}

public function Shot(direction : Vector3) : boolean{
	var hit : RaycastHit;
	b_isAiming = false;
	//cheking if the player hit the shooting range
	if(Vector3.Distance(transform.position, player.position) <= shotRange){
		//cast ray shotRange meters in shot direction, to see if nothing blocks the rocket
		if(Physics.Raycast(transform.position, direction, hit, shotRange)){
			if(hit.transform.tag != "Wall"){
				b_isAiming = true;
			}
		}
	}
	return b_isAiming;
}

public function Jump(direction : Vector3): boolean{
	var b_isGoJump : boolean = false;
	//cheking for Jumping if the next y  position is different than the current y position
	var hit : RaycastHit;
	var position1 : Vector3 = transform.position + controller.center + Vector3.up * (-controller.height * 0.5);
	var position2 : Vector3 = position1 + Vector3.up * controller.height;
	//cast character controller shape moveSpeed  meters forward, to see if it is about to hit anything
	if((Physics.CapsuleCast(position1, position2, 0.1, direction, hit)) && (c_collisionFlags & CollisionFlags.Sides)){
		if(hit.transform.tag == "Wall"){
			b_isGoJump = true;
		}
	}
	return b_isGoJump;
}

public function Run() : boolean{
	b_isRun = false;
	//make the enemy run when the player hit certain radius which is between the shotRange and getPlayerRange
	if((Vector3.Distance(transform.position, player.position) <= (getPlayerRange + shotRange)) && (Vector3.Distance(transform.position, player.position) > shotRange)){
		b_isRun = true;
	}
	return b_isRun;
}

public function IsThinking() : boolean{
	//Calculate the time that let enemy walk and stop for the certain time
		//get the time when enemy stop walking
	if(b_isStop){
		var f_time : float = thinkingTime;
	}else{
		//get the time when the enemy is walking
		f_time = walkingTime;
	}
	if(Time.time >= (f_lastTime + f_time)){
		if(b_isStop){
			b_isStop = false;
		}else{
			b_isStop = true;
		}
		f_lastTime = Time.time;
	}
	return b_isStop;
}

// ANIMATION CONTROL FUNCTIONS ///////////////////////////////////////////
//Wait for shot animation
protected function WaitForShot() : IEnumerator{
	_animation[shotAnimation.name].speed = shotAnimationSpeed;
	_animation[shotAnimation.name].wrapMode = WrapMode.ClampForever;
	_animation.PlayQueued(shotAnimation.name, QueueMode.PlayNow);
	BroadcastMessage("Fire", shotAnimation.length);
	
	yield WaitForSeconds(shotAnimation.length);
	b_isShot = false;
}

protected function WaitForPrepare() : IEnumerator{

	_animation[shotAnimation.name].speed = shotAnimationSpeed * 2;
	_animation[shotAnimation.name].wrapMode = WrapMode.ClampForever;
	_animation.CrossFade(shotAnimation.name, 0.6);
	b_isPrepare = true;
}

// DEBUG FUNCTION ////////////////////////////////////////////////////////
// Draw a line from the enemy position to the player position
public function OnDrawGizmos() : void{
	if(player != null){
		Gizmos.color = Color.blue;
		Gizmos.DrawLine(transform.position, player.position);
	}
}

@script RequireComponent(CharacterController)
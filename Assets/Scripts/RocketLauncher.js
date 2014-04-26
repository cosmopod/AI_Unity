public var smoke : GameObject;
public var smokePosition : Transform;
public var rocketConstant : ConstantForce;
public var speed : float = 10;
public var ammoCount : int = 20;

public var hitDamage : float = 20; //NEW - Damage

private var lastShot : float = 0.0;
//NEW - to count the ammo
private var b_isCountAmmon : boolean;

private var rocketPrefab : ConstantForce;
//NEW
private var rocket : Rocket;

public function Awake() : void {
	//NEW - if the ammonCount set to -1 = infinit ammo
	if (ammoCount == -1) {
		b_isCountAmmon = false;
	} else {
		b_isCountAmmon = true;
	}
}

public function Fire(_reloadTime : float) : void {
	if (b_isCountAmmon) {
		if (Time.time > (_reloadTime + lastShot) && ammoCount > 0) {
			rocketPrefab = ConstantForce.Instantiate(rocketConstant, transform.position, transform.rotation);
			rocketPrefab.relativeForce = new Vector3(0, 0, speed);
			//New get the Rocket Component and set up the damage
			rocket = rocketPrefab.gameObject.GetComponent(Rocket);
			rocket.setDamage(hitDamage);
			
			GameObject.Instantiate(smoke, smokePosition.position, smokePosition.rotation);
			
			//We ignore the collision between rocket and character
			Physics.IgnoreCollision(rocketPrefab.collider, transform.root.collider);
			
			lastShot = Time.time;
			ammoCount--;
		}
	} else {
		if (Time.time > (_reloadTime + lastShot)) {
			rocketPrefab = ConstantForce.Instantiate(rocketConstant, transform.position, transform.rotation);
			rocketPrefab.relativeForce = new Vector3(0, 0, speed);
			//New get the Rocket Component and set up the damage
			rocket = rocketPrefab.gameObject.GetComponent(Rocket);
			rocket.setDamage(hitDamage);
			
			GameObject.Instantiate(smoke, smokePosition.position, smokePosition.rotation);
			
			//We ignore the collision between rocket and character
			Physics.IgnoreCollision(rocketPrefab.collider, transform.parent.collider);
			
			lastShot = Time.time;
		}
	}
}

public function Reload () : void {
	ammoCount = 20;
}
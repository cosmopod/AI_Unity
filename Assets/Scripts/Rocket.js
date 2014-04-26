@script RequireComponent(ConstantForce)

public var timeOut : float = 3.0; // Destroy after 3.0 seconds.
public var explosionParticle : GameObject;

//NEW - set damage for this rocket
private var f_damage : float = 20;
//Set Damage
public function setDamage (_damage : float) : void {
	f_damage = _damage;
}
//Get Damage
public function getDamage () : float {
	return f_damage;
}

// Use this for initialization
public function Start () : void {
	Invoke("KillObject", timeOut);
}

public function OnCollisionEnter (others : Collision) : void {
	//Create the explosion on the first impact point of the rocket and collider
	var contactPoint : ContactPoint = others.contacts[0];
	var rotation : Quaternion = Quaternion.FromToRotation(Vector3.up, contactPoint.normal);
	GameObject.Instantiate(explosionParticle, contactPoint.point, rotation);
	
	KillObject();
}

public function KillObject () : void {
	//Stop the emit the particle
	var emitter : ParticleEmitter = GetComponentInChildren(ParticleEmitter);
	if (emitter != null) {
		emitter.emit = false; // Stop Emit
	}
	
	//In here We set the particle to auto destruct to destroy itself after a life time (or we can setup it in the editor)
	var particleAnimator : ParticleAnimator = GetComponentInChildren(ParticleAnimator);
	if (particleAnimator != null) {
		particleAnimator.autodestruct = true;
	}
	
	//Detach the trail renderer in our praticles
	transform.DetachChildren();
	
	//Destroy this Object
	GameObject.Destroy(gameObject);
}

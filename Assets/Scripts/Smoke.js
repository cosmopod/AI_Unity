public var timeOut : float = 0.5; // Destroy after 0.5 seconds.

// Use this for initialization
public function Start () : void {
	Invoke("KillObject", timeOut);
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
}
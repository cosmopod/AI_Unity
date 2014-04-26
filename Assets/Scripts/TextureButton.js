public var levelToLoad : String;
public var normalTexture : Texture2D;
public var rollOverTexture : Texture2D;

public function Awake() : void {
	StaticVars.b_isGameOver = false;
	guiTexture.enabled = false;
}

public function Update() : void {
	if (StaticVars.b_isGameOver) {
		guiTexture.enabled = true;
	}
}

public function OnMouseEnter () : void {  //Mouse Roll over function
	guiTexture.texture = rollOverTexture;
}

public function OnMouseExit() : void { //Mouse Roll out function
	guiTexture.texture = normalTexture;
}

public function OnMouseUp() : IEnumerator{ // Mouse up function
	yield new WaitForSeconds (1.0); //Wait for 0.5 secs. until do the next function
	guiTexture.enabled = false;
	Application.LoadLevel(levelToLoad);
}


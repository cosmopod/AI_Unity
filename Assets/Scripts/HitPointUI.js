#pragma strict

public var ai : AIController;
public var player : New3PSController;
public var frameTexture : Texture2D;
public var hpTexture : Texture2D;
public var aiTexture : Texture2D;
public var textHpTexture : Texture2D;
public var textAiTexture : Texture2D;

function Start () {

}

function Update () {
	//cheking if the player or the AI hit-point are equal or below 0
	if((player.GetHpPercent() <= 0.0 || ai.GetHpPercent() <= 0.0)){
		StaticVars.b_isGameOver = true;
	}
}

public function OnGUI() : void{
		//Draw Text
	GUI.DrawTexture (Rect (10,10,46,32), textHpTexture);
	GUI.DrawTexture (Rect (10,42,95,32), textAiTexture);
	
	//Character Hp
	// Create one Group to contain both images
	// Adjust the first 2 coordinates to place it somewhere else on-screen
	GUI.BeginGroup (Rect (110,15,156,21));
	// Draw the background image
	GUI.DrawTexture(Rect (0,0,156,21), frameTexture);
	// Create a second Group which will be clipped
	// We want to clip the image and not scale it, which is why we need the second Group
	GUI.BeginGroup (Rect (0,0,player.GetHpPercent() * 156, 21));
	// Draw the foreground image
	GUI.DrawTexture (Rect (0,0,156,21), hpTexture);
	// End both Groups
	GUI.EndGroup ();
	GUI.EndGroup ();
	
	//AI HP
	// Create one Group to contain both images
	// Adjust the first 2 coordinates to place it somewhere else on-screen
	GUI.BeginGroup (Rect (110,47,156,21));
	// Draw the background image
	GUI.DrawTexture(Rect (0,0,156,21), frameTexture);
	// Create a second Group which will be clipped
	// We want to clip the image and not scale it, which is why we need the second Group
	GUI.BeginGroup (Rect (0,0,ai.GetHpPercent() * 156, 21));
	// Draw the foreground image
	GUI.DrawTexture (Rect (0,0,156,21), aiTexture);
	// End both Groups
	GUI.EndGroup ();
	GUI.EndGroup ();
	
}
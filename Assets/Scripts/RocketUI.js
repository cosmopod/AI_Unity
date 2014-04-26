public var rocketLauncher : RocketLauncher;
public var customSkin : GUISkin;
public var width : float = 80;
public var height : float = 25;

public function OnGUI() : void {
	GUI.skin = customSkin;
	DrawShadowText(new Rect(Screen.width*transform.position.x, (Screen.height*(1.0 - (transform.position.y - 0.005))), width, height), rocketLauncher.ammoCount.ToString(), customSkin.GetStyle("CustomText"), Color.white);
}

//Draw a 45 degree black shadow text by shifting 2 pixel bottom-right
public function DrawShadowText (position : Rect, text : String, style : GUIStyle, textColor : Color) : void {
	var backupStyle : GUIStyle = style;
	//Draw a Shadow Text
	style.normal.textColor = Color.black;
	//Shift 2 pixel left and 2 pixel bottom
	position.x += 2;
	position.y += 2;
	GUI.Label(position, text, style);
	/////////////////////////////////////////////
	//Draw a Text
	style.normal.textColor = textColor;
	//Shift pixel back
	position.x -= 2;
	position.y -= 2;
	GUI.Label(position, text, style);
	style = backupStyle; // Set style back
}
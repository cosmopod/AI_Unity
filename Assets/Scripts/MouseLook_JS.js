@script AddComponentMenu("Camera-Control/Mouse Look JS")

enum RotationAxes { MouseXAndY, MouseX, MouseY }
public var axes : RotationAxes = RotationAxes.MouseXAndY;
public var sensitivityX : float = 15;
public var sensitivityY : float = 15;

public var minimumX : float = -360;
public var maximumX : float = 360;

public var minimumY : float = -60;
public var maximumY : float = 60;

private var rotationY : float = 0;

public function Start () : void {
	// Make the rigid body not change rotation
	if (rigidbody)
		rigidbody.freezeRotation = true;
}

public function Update () : void {
	//Access to TextureButton Static parameter
	if (StaticVars.b_isGameOver == false) {
		if (axes == RotationAxes.MouseXAndY) {
			var rotationX : float = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
		} else if (axes == RotationAxes.MouseX) {
			transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
		} else {
			rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
			rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
		}
	}
}

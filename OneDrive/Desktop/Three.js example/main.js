preload(libs['GUI']);
preload('three.js');
preload('GLTFLoader.js');
preload('OrbitControls.js');

var main=function(args){
	

	args.app.clearContents();//clears the loading animation

	var wind=args.app.getWindow();//gets the window object, which has many parameters, methods, and listeners
	//for example:
	wind.whenResized().then((wind)=>{
		//if(area) area.innerHTML="Window resized!";
	})

	//We create a GUI menu bar with one menu item:
	var menulayout=new MenuLayout();
	menulayout.getMenuBar().append(new MenuItem('Help')).whenClicked().then((item)=>{
		area.innerHTML="Help clicked!";
	});

	//You can append GUI elements to the window like this:
	wind.getContent().append(menulayout);

	//Or alternatively you can append custom divs made with vanilla JS:
	var area=document.createElement('div');
	opn.set(area.style,{
		position:"absolute",
		display:"block",
		boxSizing:"border-box",
		width:"100%",
		height:"100%",
		padding:"0px",
		background:"black",
		overflow:"hidden",
		color:"white",
		fontWeight:"700",
		fontSize:"28px",
		fontFamily:"Arial",
		textAlign: "center"
	});
	menulayout.getContainer().div.appendChild(area);
	
	// Set up scene
	const scene = new THREE.Scene();

	let div=document.createElement('div');
	area.appendChild(div);
	div.style.width='100%';
	div.style.height='100%';

	// Set up camera
	const camera = new THREE.PerspectiveCamera(75, div.clientWidth / div.clientHeight, 0.1, 1000);
	camera.position.z = 15;
	camera.position.y = 2;
	camera.position.x = 0;

	// Set up renderer
	const renderer = new THREE.WebGLRenderer();
	
	renderer.setSize(div.clientWidth, div.clientHeight);
	div.appendChild(renderer.domElement);

	// Set up environment lighting for better rendering of PBR materials
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Adjust intensity as needed
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(5, 5, 5);
	scene.add(directionalLight);

	// Set up grid for better understanding of geometry
	const gridHelper = new THREE.GridHelper(200, 50);
	scene.add(gridHelper);

	// Create random objects throughout background
	function createRandomObj() {
		const geometry = new THREE.SphereGeometry(0.25, 24, 24);
		const material = new THREE.MeshStandardMaterial( {color: 0xffffff});
		const randomObj = new THREE.Mesh(geometry, material);

		const[x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread (100) );
		
		randomObj.position.set(x, y, z);
		scene.add(randomObj);
 	}

	Array(200).fill().forEach(createRandomObj);
	
	

	// Create a cube
	const geometry = new THREE.TorusGeometry();
	const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
	const cube = new THREE.Mesh(geometry, material);
	cube.scale.x=2;
	cube.scale.y=2;
	cube.scale.z=2;
	scene.add(cube);

	// Create the GLTF loader
	const loader = new GLTFLoader();
	var model=null;
	// Load a GLTF model
	loader.load(
		'scene-v1/scene.gltf',  // Path to the model file
		(gltf) => {
			model=gltf.scene;
			// Add the loaded model to the scene
			scene.add(gltf.scene);
			console.log("Model loaded successfully!");
		},
		(xhr) => {
			// Called while loading is in progress
			console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		},
		(error) => {
			// Called if there is an error during the loading process
			console.error('An error happened', error);
		}
	);

	const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;  // Enable smooth damping (inertia)
        controls.dampingFactor = 0.05;  // Damping factor
        controls.screenSpacePanning = false;  // Disable panning
        controls.maxPolarAngle = Math.PI / 2;  // Limit the vertical rotation

	// Animation loop
	function animate() {
		requestAnimationFrame(animate);

		// Rotate the cube
		//cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.01;
		if(model!=null){
			model.rotation.y+=0.01;
		}

		controls.update();

		renderer.render(scene, camera);
	}

	animate();

}
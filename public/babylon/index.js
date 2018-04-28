
/******* Add the create scene function ******/
var createScene = function (canvas, engine) {

    // Create the scene space
    var scene = new BABYLON.Scene(engine);
    var vrHelper = scene.createDefaultVRExperience();

    // Add and manipulate meshes in the scene
    // var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: .5 }, scene);
    // sphere.position.y = 1;
    // sphere.position.z = 1;

    // Light
    var spot = new BABYLON.PointLight("spot", new BABYLON.Vector3(0, 30, 10), scene);
    spot.diffuse = new BABYLON.Color3(1, 1, 1);
    spot.specular = new BABYLON.Color3(0, 0, 0);

    // Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0.8, 100, BABYLON.Vector3.Zero(), scene);
    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    camera.lowerRadiusLimit = 30;
    camera.upperRadiusLimit = 150;
    camera.attachControl(canvas, true);

    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", 20, 20, 250, 0, 1, scene, false);
    ground.material = groundMaterial;

    vrHelper.enableTeleportation({floorMeshName: "ground"});
    vrHelper.teleportationEnabled = true;

    //Sphere to see the light's position
    // var sun = BABYLON.Mesh.CreateSphere("sun", 10, 4, scene);
    // sun.material = new BABYLON.StandardMaterial("sun", scene);
    // sun.material.emissiveColor = new BABYLON.Color3(1, 1, 0);

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

    //Sun animation
    // scene.registerBeforeRender(function () {
    //     sun.position = spot.position;
    //     spot.position.x -= 0.5;
    //     if (spot.position.x < -90)
    //         spot.position.x = 100;
    // });

    return scene;
};

window.addEventListener("load", function () { // Watch for browser/canvas resize events
    var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
    var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

    var scene = createScene(canvas, engine); //Call the createScene function
    
    window.addEventListener("resize", function () { // Watch for browser/canvas resize events
        engine.resize();
    });

    engine.runRenderLoop(function () { // Register a render loop to repeatedly render the scene
        scene.render();
    });
});

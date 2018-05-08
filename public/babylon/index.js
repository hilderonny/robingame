var scene, vrHelper, meshestointeract = [], dragobject;

function addinteractions(interactionmanager, targetmesh) {
    console.log(interactionmanager, targetmesh);
    interactionmanager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: targetmesh
    }, function(evt) {
        targetmesh.material.wireframe = true;
        dragobject = targetmesh;
    }));
    interactionmanager.registerAction(new BABYLON.ExecuteCodeAction({
        trigger: BABYLON.ActionManager.OnIntersectionExitTrigger, parameter: targetmesh
    }, function(evt) {
        targetmesh.material.wireframe = false;
        dragobject = null;
    }));
}

function createhand(controller) {
    var hand = BABYLON.MeshBuilder.CreateSphere("hand", { segments: 1, diameter: 0.1 }, scene);
    hand.position = new BABYLON.Vector3(controller.hand === "right" ? 0.01 : -0.01, -0.02, -0.04);
    hand.parent = controller.mesh;
    controller.onMainButtonStateChangedObservable.add(function(stateObject) {
        if (!dragobject) return;
        dragobject.setParent(stateObject.pressed ? hand : null);
    });
    hand.actionManager = new BABYLON.ActionManager(scene);
    meshestointeract.forEach(function (m) {
        addinteractions(hand.actionManager, m);
    });
}

// Panel which can be grabbed on the edges and moved
function grabdemo() {

    var boundingbox = BABYLON.MeshBuilder.CreateBox("boundingbox", { size: .2 }, scene);
    boundingbox.position = new BABYLON.Vector3(0, 1.5, 0.3);
    boundingbox.material = new BABYLON.StandardMaterial("boundingboxmaterial", scene);
    boundingbox.material.emissiveColor = new BABYLON.Color3(0, 0, 1);

    meshestointeract.push(boundingbox);
}

var createScene = function (canvas, engine) {

    // Create the scene space
    scene = new BABYLON.Scene(engine);

    vrHelper = scene.createDefaultVRExperience();
    vrHelper.onControllerMeshLoaded.add(createhand);

    grabdemo();

    // Light
    var spot = new BABYLON.PointLight("spot", new BABYLON.Vector3(-10, 30, -10), scene);
    spot.diffuse = new BABYLON.Color3(1, 1, 1);
    spot.specular = new BABYLON.Color3(0, 0, 0);

    // Camera
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 100, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);
    // scene.activeCamera.minZ = 0;

    // Ground
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/earth.jpg", scene);

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/worldHeightMap.jpg", 20, 20, 250, 0, 1, scene, false);
    ground.material = groundMaterial;

    // vrHelper.enableTeleportation({floorMeshName: "ground"});
    // vrHelper.teleportationEnabled = true;

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

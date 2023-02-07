//RoryWalsh 2023

const initScene = async function () {
    //load audio engine corresponding sample
    csound = await create({ worker: true, options: ['-odac', '--0dbfs=1'] });
    await loadAsset("./Anybody Here by alphahog Id-46363 1.wav", "Anybody Here by alphahog Id-46363 1.wav");
    await loadAsset("./awh.wav", "awh.wav");
    await startAudio();
    engine.displayLoadingUI();
    var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -1, -0.3), scene);
    let camera;

    //import interrogation room mesh and position it accordingly
    BABYLON.SceneLoader.ImportMesh("", "/", "scene.gltf", scene, function (newMeshes) {
        scene.createDefaultCameraOrLight(false, true, true);
        camera = scene.activeCamera;
        camera.attachControl(canvas, true);

        scene.activeCamera = camera;
        newMeshes[0].scaling = new BABYLON.Vector3(2.8, 2.8, 2.8);
        newMeshes[0].position.y = -350;
        newMeshes[0].position.z = -1600;
        camera.rotation.y = 3.14;

        setTimeout(function () {
            engine.hideLoadingUI();
        }, 100);
    });

    // Move the light with the camera
    scene.registerBeforeRender(function () {
        light.position = camera.position;
        scene.activeCamera.position.y = -0.35;
    });

    scene.onKeyboardObservable.add((kbInfo) => {
        console.log(kbInfo.event.keyCode);
        if (kbInfo.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
            if (csound) {
                //if number 1 key is pressed
                if (kbInfo.event.keyCode == 49) {
                    resumeAudio();
                    //add modes for the room
                    addRoomModes({
                        sample: "Anybody Here by alphahog Id-46363 1.wav",
                        reverb: 0.4,
                        axial: [100],
                        tangential: [100],
                        oblique: [100]
                    });
                }
                //if number 2 key is pressed
                else if (kbInfo.event.keyCode == 50) {
                    resumeAudio();
                    //add modes for the room
                    addRoomModes({
                        sample: "Anybody Here by alphahog Id-46363 1.wav",
                        reverb: 0.4,
                        axial: [100, 200, 300, 400, 500],
                        tangential: [200, 300, 400],
                        oblique: [240, 450, 480]
                    });
                }
            }
        }
    });
}
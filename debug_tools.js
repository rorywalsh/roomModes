// GUI
var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
var panel = new BABYLON.GUI.StackPanel();
panel.width = "220px";
panel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
panel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
advancedTexture.addControl(panel);

var header = new BABYLON.GUI.TextBlock();
header.text = "Y-rotation: 0 deg";
header.height = "30px";
header.color = "white";
panel.addControl(header);

var slider = new BABYLON.GUI.Slider();
slider.minimum = -200;
slider.maximum = 200;
slider.value = 0;
slider.isVertical = true;
slider.height = "200px";
slider.width = "20px";
slider.onValueChangedObservable.add(function (value) {
    header.text = "Y-position: " + value;
    if (importedMeshes) {
        importedMeshes[0].position.y = value;
    }
});
panel.addControl(slider);  
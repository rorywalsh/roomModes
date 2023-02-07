
//RoryWalsh 2023
let csoundObj;

const create = async (args = {}) => {
    const { Csound } = await import('./csound.js');
    if (csoundObj) {
        return;
    }

    let inputChannelCount = typeof args.inputChannelCount === "undefined" ? 2 : args.inputChannelCount;
    let outputChannelCount = typeof args.outputChannelCount === "undefined" ? 2 : args.outputChannelCount;
    let worker = typeof args.worker === "undefined" ? false : args.worker;
    let spn = typeof args.spn === "undefined" ? false : args.spn;
    let options = typeof args.options === "undefined" ? [] : args.options;

    csoundObj = await Csound({
        useWorker: worker,
        useSPN: spn,
        outputChannelCount: outputChannelCount,
        inputChannelCount: inputChannelCount
    });

    //set default 0dbfs
    await csoundObj.setOption("--0dbfs=1");

    options.forEach(async function (o) {
        await csoundObj.setOption(o);
    });

    return csoundObj;
};

const startAudio = async () => {
    const startPromise = csoundObj.start();
    csoundObj.once("onAudioNodeCreated", (ctx) => {
        if (ctx.state === "suspended") {
            ctx.resume();
        }
    });
    await startPromise;

}

const resumeAudio = async () => {
    let ctx = await csoundObj.getAudioContext();
    if (ctx.state === "suspended") {
        ctx.resume();
        await csoundObj.start();
    }
}

const loadAsset = async (fileURL, fileName) => {
    const response = await fetch(fileURL);
    const testSampleArrayBuffer = await response.arrayBuffer();
    await csoundObj.fs.writeFile(fileName, new Uint8Array(testSampleArrayBuffer));
};

const addRoomModes = function (data) {
    console.log(data);
    let instr = `
    instr 2
    aIn diskin2 "${data.sample}", 1, 0, 0
    p3 = filelen("${data.sample}")+4\n`;

    for (let i = 0; i < data.axial.length; i++) {
        instr += 'aAx' + i + ' mode aIn, ' + data.axial[i] + ', 10\n';
    }

    for (let i = 0; i < data.tangential.length; i++) {
        instr += 'aTan' + i + ' mode aIn*.5, ' + data.tangential[i] + ', 10\n';
    }

    for (let i = 0; i < data.oblique.length; i++) {
        instr += 'aOb' + i + ' mode aIn*.25, ' + data.oblique[i] + ', 10\n';
    }

    instr += "aAxialMix = ((";
    for (let i = 0; i < data.axial.length; i++) {
        instr += 'aAx' + i + (i < data.axial.length - 1 ? "+" : "")
    }
    instr += `))/${data.axial.length}\n`;

    instr += "aTangentialMix = ((";
    for (let i = 0; i < data.tangential.length; i++) {
        instr += 'aTan' + i + (i < data.tangential.length - 1 ? "+" : "")
    }
    instr += `))/${data.tangential.length}\n`;

    instr += "aObliqueMix = ((";
    for (let i = 0; i < data.oblique.length; i++) {
        instr += 'aOb' + i + (i < data.oblique.length - 1 ? "+" : "")
    }
    instr += `))/${data.tangential.length}\n`;

    instr += `\naMix balance (aAxialMix+aTangentialMix+aObliqueMix)/3, aIn\n`;
    instr += `aMix, aMixR reverbsc aMix+aIn, aMix+aIn, ${data.reverb}, 10000`;
    instr += "\noutall (aMix)\nendin\n";

    console.log(instr);
    csound.evalCode(instr)
    csound.evalCode(`schedule(2, 0, 13)`);

}

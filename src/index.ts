function runBench(n: number): number {
    let result = 0;
    for (var i = 0; i < n; i++) {
        result++;
    }

    return result;
}

async function main() {
    const memory = new WebAssembly.Memory({
        initial: 200,
        maximum: 200
    });

    const byteView = new Uint8Array(memory.buffer);

    const imports = {
            env: {
                memory,
                prints: (strPtr: number) => console.log(fromAscii(strPtr))
            },
    };

    // Given a pointer to a string, return the full string
    function fromAscii(strPtr: number): string {
        let currPtr = strPtr;
        let currentChar = byteView[currPtr];
        let result = "";
        while (currentChar != 0) {
            result += String.fromCharCode(currentChar);
            currPtr++;
            currentChar = byteView[currPtr];
        }

        return result;
    }

    const result = await WebAssembly.instantiateStreaming(
        fetch('./dist/strtest.wasm'),
        imports
    );

    const main = result.instance.exports.main as CallableFunction;
    const cBench = result.instance.exports.runBench as CallableFunction;

    main();

    const jsPerfStart = performance.now();
    const jsResult = runBench(100000000);
    const jsPerfEnd = performance.now();

    const cPerfStart = performance.now();
    const cResult = cBench(100000000);
    const cPerfEnd = performance.now();

    console.log('js: ', jsPerfEnd - jsPerfStart, jsResult);
    console.log('c: ', cPerfEnd - cPerfStart, cResult);
}

window.onload = async function() {
    await main();
};
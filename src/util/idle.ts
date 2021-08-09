export function idle() {
    //@ts-ignore
    return new Promise((r) => requestIdleCallback(r));
}
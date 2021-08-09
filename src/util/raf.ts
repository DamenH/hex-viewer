export function raf() {
    return new Promise((r) => requestAnimationFrame(r));
}
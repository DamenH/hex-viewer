<script lang="ts">
import { onMount } from "svelte";

export let bytes: Uint8Array;
export let columns: number;
export let observer: IntersectionObserver;
export let index: number;
export let visible: boolean;

let dataCluster: HTMLElement;

let html: string = "";

onMount(() => {
    generate();
    observer.observe(dataCluster);
});

function generate() {
    let cluster = [];
    for (let i = 0; i < bytes.length / columns; i++) {
        let row: string[] = [];

        for (let j = 0; j < columns; j++) {
            row.push(`0${bytes[i * columns + j].toString(16).toUpperCase()}`.slice(-2));
        }
        cluster.push(row.join(" ").trim());
    }
    html += cluster.join("\n");
}
</script>

<div bind:this={dataCluster} id="cluster-{index}" style="height: 100%; width: 100%">
    {#if visible}
        {@html html}
    {:else}
        {@html Array(16 * 3)
            .fill(`&nbsp;`)
            .join("")}
    {/if}
</div>

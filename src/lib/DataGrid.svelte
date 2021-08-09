<script lang="ts">
import { onMount } from "svelte";

import DataCluster from "./DataCluster.svelte";
import { raf } from "../util/raf";
import { done } from "./stores";

export let bytes: Uint8Array;
export let columns: number;
export let clusterSize: number;
export let clusterHeight: number;

let visibility = new Array(Math.ceil(bytes.length / clusterSize)).fill(true);

let observer: IntersectionObserver;

function updateDone() {
    done.set(true);
    return "";
}

onMount(() => {
    observer = new IntersectionObserver(
        (entries, observer) => {
            if (true) return; // unfortunately this doesn't really help
            entries.forEach(async (entry) => {
                let target = entry.target.id;
                visibility[parseInt(target.split("-")[1])] = entry.isIntersecting;
            });
        },
        {
            threshold: 0,
        }
    );
});

interface ClusterData {
    bytes: Uint8Array;
    needsUpdate: boolean;
}
let clusters: ClusterData[] = [];
async function generateClusters() {
    for (let i = 0; i < Math.ceil(bytes.length / clusterSize); i++) {
        clusters.push({
            bytes: bytes.slice(i * clusterSize, i * clusterSize + clusterSize),
            needsUpdate: false,
        });
    }
}
</script>

{#await generateClusters()}
    {""}
{:then}
    {#each clusters as cluster, i}
        <div style="contain: content; height: {clusterHeight}px; width: max-content;">
            {#await raf()}
                {@html Array(16 * 3)
                    .fill("&nbsp;")
                    .join("")}
            {:then}
                <DataCluster bytes={cluster.bytes} {columns} {observer} index={i} visible={visibility[i]} />
                {i === clusters.length - 1 ? updateDone() : ""}
            {/await}
        </div>
    {/each}
{/await}

<style global>
.modal {
    font-size: 30px;
    padding: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    position: relative;
    width: max-content;
    height: max-content;
    background-color: grey;
    border-radius: 3px;
}

.spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
    to {
        -webkit-transform: rotate(360deg);
    }
}
</style>

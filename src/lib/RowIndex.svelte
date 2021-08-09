<script lang="ts">
import { raf } from "../util/raf";

export let indices: string[];
export let clusterSize: number;
export let clusterHeight: number;

let test: HTMLElement;

interface ClusterData {
    indices: string[];
    visible: boolean;
}
let clusters: ClusterData[] = [];

let rows: string[] = [];

async function generateClusters() {
    for (let i = 0; i < Math.ceil(indices.length / clusterSize); i++) {
        clusters.push({
            indices: indices.slice(i * clusterSize, i * clusterSize + clusterSize),
            visible: true,
        });
        rows.push(printIndices(clusters[i].indices));
    }
}

function printIndices(indices: string[]) {
    let text = "";
    for (let i = 0; i < indices.length; i++) {
        text += indices[i] + "\n";
    }
    return text;
}
</script>

{#await generateClusters()}
    {""}
{:then}
    {#each clusters as cluster}
        <div style="contain: content; height: {clusterHeight}px; width: max-content;">
            {#await raf()}
                {@html Array(6).fill("&nbsp;").join("")}
            {:then}
                {printIndices(cluster.indices)}
            {/await}
        </div>
    {/each}
{/await}

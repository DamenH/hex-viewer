<script lang="ts">
import ColumnIndex from "./ColumnIndex.svelte";
import RowIndex from "./RowIndex.svelte";
import DataGrid from "./DataGrid.svelte";
import { onMount } from "svelte";
import { raf } from "../util/raf";
import { done } from "./stores";

const length = 524_288;// && 16_384 && 8_388_608 && 16_777_216;
export let columns = 16;

let hexView: HTMLElement;
let dataGrid: HTMLElement;
let rowData: HTMLElement;

let rowHeight = 0;

let data = new ArrayBuffer(length);
let mainArray = new Uint8Array(data);
let dataU32 = new Uint32Array(data);
for (let i = 0; i < dataU32.length; i++) {
    dataU32[i] = Math.floor(Math.random() * 4294967295);
}

const clusterSize = Math.min(length, 16_384);

$: indices = Array(Math.ceil(length / columns))
    .fill("")
    .map((v, i) => `00000${(i * columns).toString(16).toUpperCase()}`.slice(-6));
$: clusterHeight = (clusterSize / columns) * rowHeight;

let doneLoading = false;
done.subscribe((value) => {
    doneLoading = value;
});

onMount(() => {
    calculateHeight();
});



function calculateHeight() {
    let span = document.createElement("div");
    span.innerHTML = "test";
    span.style.visibility = "hidden";
    dataGrid.appendChild(span);
    rowHeight = span.getBoundingClientRect().bottom - span.getBoundingClientRect().top;
    dataGrid.removeChild(span);
}
</script>

{#if !doneLoading}
    <div class="loading">
        <div class="modal">
            Loading...
            <div class="spinner" />
        </div>
    </div>
{/if}

<div class="hex-view" bind:this={hexView}>
    <div class="goto" />
    <div class="column-index">
        <ColumnIndex {columns} />
    </div>
    <div class="row-data" bind:this={rowData}>
        <div class="row-index">
            {#await raf()}
                {" "}
            {:then}
                <RowIndex {indices} clusterSize={clusterSize / columns} {clusterHeight} />
            {/await}
        </div>
        <div class="data-grid" bind:this={dataGrid}>
            {#await raf()}
                {" "}
            {:then}
                <DataGrid bytes={mainArray} {columns} {clusterSize} {clusterHeight} />
            {/await}
        </div>
    </div>
</div>

<style global>
.hex-view {
    font-size: 14px;
    font-family: Consolas, monospace;
    border: 1px solid black;
    border-right: none;
    background-color: hsl(0, 0%, 95%);
    height: calc(100vh - 30px - 2em);
    width: min-content;
    display: grid;
    grid-template-columns: 4rem max-content;
    grid-template-rows: max-content auto;
    grid-template-areas:
        "goto column"
        "hex hex";
}

.row-data {
    width: auto;
    display: grid;
    overflow-y: scroll;
    grid-template-columns: 4rem max-content;
    grid-template-rows: minmax(1.1rem, 2vh) auto;
    justify-items: center;
    grid-template-areas: "row data";
    grid-area: hex;
}

.column-index {
    grid-area: column;
    font-weight: bold;
    border-bottom: 1px solid black;
    border-right: 1px solid black;
    padding-right: 0.5rem;
}

.goto {
    grid-area: goto;
    text-align: center;
    border-bottom: 1px solid black;
}

.row-index {
    grid-area: row;
    font-weight: bold;
    white-space: pre-line;
}
.data-grid {
    grid-area: data;
    white-space: pre-line;
    padding-right: 0.5rem;
}

.loading {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100vw;
    height: 100vh;
    backdrop-filter: blur(2px);
    color: white;
    background-color: hsla(0, 0%, 10%, 0.75);
    top: 0;
    left: 0;
    z-index: 100;
}

.row-data::-webkit-scrollbar {
    width: 0.75rem;
    pointer-events: none;
}

.row-data::-webkit-scrollbar-track {
    border-left: 1px solid black;
    border-right: 1px solid black;
    border-bottom: none;
    pointer-events: none;
}

.row-data::-webkit-scrollbar-thumb {
    background: hsl(0, 0%, 30%);
    pointer-events: none;
}

.row-data::-webkit-scrollbar-thumb:hover {
    background: black;
    pointer-events: none;
}
</style>

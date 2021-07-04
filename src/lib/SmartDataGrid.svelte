<script lang="ts">
import { onMount, beforeUpdate, afterUpdate } from "svelte";

let dataGrid: HTMLElement;

let currentStartIndex: number;
let currentEndIndex: number;
let height: number;

export let items: Array<number>;
export let columns;
export let cellHeight = 21;

// The cells currently being rendered to the DOM.
let visibleCells: Array<number> = [];
let scrollDirection: "UP" | "DOWN";
let offset = 0;

let autoScroll = false;
let preventBug = true;

/**
 * The heights of the spaces above and below the rendered data.
 * Used to emulate a normal scrolling experience. Values are
 * updates as you go up and down the data grid.
 */
let topSpacerHeight: number;
let bottomSpacerHeight: number;

onMount(async () => {
  updateVisibleCells();
  updateSizes();
});

async function onScroll(event: Event) {
  updateVisibleCells();
  updateSizes();
}

/**
 * Updates the cells that are currently visible in the viewport.
 */
function updateVisibleCells() {
  let visibleAreaStart = dataGrid.scrollTop;
  let visibleAreaEnd = dataGrid.scrollTop + height;
  let startIndex = Math.floor(visibleAreaStart / cellHeight) * columns;
  let endIndex = Math.ceil(visibleAreaEnd / cellHeight) * columns;
  endIndex = Math.min(items.length, endIndex);

  // scrollDirection = currentStartIndex < startIndex ? "UP" : "DOWN";
  // console.log(scrollDirection);

  [currentStartIndex, currentEndIndex] = [startIndex, endIndex];
  visibleCells = items.slice(startIndex, endIndex);
}

/**
 * Updates the sizes of the top and bottom spacers.
 */
function updateSizes() {
  topSpacerHeight = Math.floor(currentStartIndex / columns) * cellHeight + offset;
  bottomSpacerHeight = Math.floor((items.length - currentEndIndex) / columns) * cellHeight;
}

/**
 * Pretty prints the state of `visibleCells` into the console.
 */
function showVisibleCells() {
  let output: string[] = [];
  let row = "";
  for (let i = 0; i < visibleCells.length; i++) {
    row += `0${visibleCells[i].toString(16).toUpperCase()} `.slice(-3);
    if ((i + 1) % columns == 0) {
      output.push(row.slice(0, row.length - 1));
      row = "";
    }
  }
  console.log(JSON.stringify(output, null, 2));
}

let currentScrollValue = 0;
let previousScrollValue = 0;
let scrollValueDifference = 0;

beforeUpdate(() => {
  // console.log(scrollValueDifference);
  previousScrollValue = dataGrid?.scrollTop ?? 0;
  // Hacky workaround that may shed light on the issue?
  if (preventBug && scrollValueDifference < 0) {
    dataGrid.scrollTop = dataGrid.scrollTop + scrollValueDifference;
  }
});

afterUpdate(() => {
  currentScrollValue = dataGrid?.scrollTop ?? 0;
  scrollValueDifference = previousScrollValue - currentScrollValue;
});

function autoScrolling() {
  if (autoScroll) dataGrid.scrollTop += 1;
  window.requestAnimationFrame(autoScrolling);
}
window.requestAnimationFrame(autoScrolling);
</script>

<svelte:window on:scroll|capture={onScroll} bind:innerHeight={height} />

<div class="data-grid" bind:this={dataGrid}>
  <div class="data-grid-space" style="height: {topSpacerHeight}px;" />
  {#if visibleCells?.length}
    {#each Array(Math.ceil(visibleCells.length / columns)) as rIndex, i}
      <span class="data-row">
        {#each Array(columns) as cIndex, j}
          <span class="row-item">
            {`0${visibleCells[i * columns + j].toString(16).toUpperCase()}`.slice(-2)}
          </span>
        {/each}
      </span>
    {/each}
  {/if}
  <div class="data-grid-space" style="height: {bottomSpacerHeight}px;" />
</div>

<table>
  <tr>
    <td><button on:click={() => offset--}>Dec</button><button on:click={() => offset++}>Inc</button></td>
    <td>
      <input type="range" min="-50" max="50" bind:value={offset} name="offset" />
      <label for="offset">
        Top Offset:{offset}
      </label>
    </td>
  </tr>
  <tr>
    <td colspan="4">
      <button on:click={() => (autoScroll = !autoScroll)}>Toggle</button> Autoscroll:
      <span style="font-weight: bold;">{autoScroll}</span>
    </td>
  </tr>
  <tr>
    <td colspan="4">
      <button on:click={() => (preventBug = !preventBug)}>Toggle</button> Prevent Scroll Down Bug:
      <span style="font-weight: bold;">{preventBug}</span>
    </td>
  </tr>
</table>

<!-- <input type="range" min="-50" max="50" bind:value={offset} name="offset" />
<label for="offset">{offset}</label>
<button on:click={() => offset--}>Dec</button>
<button on:click={() => offset++}>Inc</button> -->
<style scoped>
.data-grid {
  font-size: 16px;
  font-family: Consolas, monospace;
  height: 50vh;
  width: 100%;
  max-width: 400px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  overflow-y: scroll;
  /* scroll-behavior: smooth; */
}

.data-grid-space {
  width: 100%;
}

.data-row {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
}

/* .row-item {
    margin-right: 0.15rem;
    margin-left: 0.15rem;
  } */

.row-item:nth-child(1) {
  margin-left: 0.15rem;
}
</style>

<script lang="ts">
import { onMount, beforeUpdate, afterUpdate } from "svelte";

let dataGrid: HTMLElement;

let startIndex: number;
let endIndex: number;
let height: number;

export let items: Array<number>;
export let columns;
export let cellHeight = 19;

// The cells currently being rendered to the DOM.
let visibleCells: Array<number> = [];

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
  startIndex = Math.floor(visibleAreaStart / cellHeight) * columns;
  endIndex = Math.ceil(visibleAreaEnd / cellHeight) * columns;
  endIndex = Math.min(items.length, endIndex);

  // scrollDirection = currentStartIndex < startIndex ? "UP" : "DOWN";
  // console.log(scrollDirection);

  visibleCells = items.slice(startIndex, endIndex);
}

/**
 * Updates the sizes of the top and bottom spacers.
 */
function updateSizes() {
  topSpacerHeight = Math.floor(startIndex / columns) * cellHeight;
  bottomSpacerHeight =
    Math.floor((items.length - endIndex) / columns) * cellHeight;
}

let previousScrollValue: number;

beforeUpdate(() => {
  previousScrollValue = dataGrid?.scrollTop;
});

afterUpdate(() => {
  dataGrid.scrollTop = previousScrollValue;
});
</script>

<svelte:window on:scroll|capture={onScroll} bind:innerHeight={height} />

<div class="data-grid" bind:this={dataGrid}>
  <div class="data-grid-space" style="height: {topSpacerHeight}px;" />
  {#if visibleCells?.length}
    {#each Array(Math.ceil(visibleCells.length / columns)) as rIndex, i}
      <span class="data-row">
        {#each Array(columns) as cIndex, j}
          <span class="row-item">
            {`0${visibleCells[i * columns + j]
              .toString(16)
              .toUpperCase()}`.slice(-2)}
          </span>
        {/each}
      </span>
    {/each}
  {/if}
  <div class="data-grid-space" style="height: {bottomSpacerHeight}px;" />
</div>

<style scoped>
.data-grid {
  font-size: 16px;
  font-family: Consolas, monospace;
  height: 96vh;
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

.row-item:nth-child(1) {
  margin-left: 0.15rem;
}
</style>

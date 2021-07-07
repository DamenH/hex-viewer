<script lang="ts">
import { onMount, beforeUpdate, afterUpdate } from "svelte";

// Properties
export let items: Array<number>;
export let columns;

// A reference to the datagrid element.
let dataGrid: HTMLElement;
let scrollbar: HTMLElement;

let startIndex: number;
let endIndex: number;

let cellHeight = 19;
let height: number;
let scrollBarWidth = 16;

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
  updateVisibleCells(0);
  updateSizes();
  mouseMoveWhilstDown(scrollbar, updateScrollThumb);
});

let lastKnownScrollPosition = 0;
let ticking = false;

let unthrottledTimeStamp = 0;
let throttledTimeStamp = 0;

let auxDown = false;

async function onScroll(event: Event) {
  lastKnownScrollPosition = dataGrid.scrollTop;
  if (!ticking) {
    window.requestAnimationFrame(function () {
      updateVisibleCells(lastKnownScrollPosition);
      updateSizes();
      ticking = false;
    });
    ticking = true;
  }
}

function mouseMoveWhilstDown(target, whileMove: (event: MouseEvent) => void) {
  var endMove = () => {
    window.removeEventListener("mousemove", whileMove);
    window.removeEventListener("mouseup", endMove);
  };

  target.addEventListener("mousedown", (event) => {
    event.stopPropagation();
    window.addEventListener("mousemove", whileMove);
    window.addEventListener("mouseup", endMove);
  });
}

function updateScrollThumb(event: MouseEvent) {
  const rect = dataGrid.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const yPercentage = Math.min(1, y / (rect.bottom - rect.top) - 0.005);
  dataGrid.scroll(
    0,
    Math.min(dataGrid.scrollHeight, yPercentage * dataGrid.scrollHeight)
  );
}

function down(event: MouseEvent) {
  const rect = dataGrid.getBoundingClientRect();
  const y = event.clientY - rect.top;
  const yPercentage = Math.min(1, y / (rect.bottom - rect.top) - 0.005);
  dataGrid.scroll(
    0,
    Math.min(dataGrid.scrollHeight, yPercentage * dataGrid.scrollHeight)
  );
}

/**
 * Updates the cells that are currently visible in the viewport.
 */
function updateVisibleCells(scrollPosition: number) {
  let visibleAreaStart = scrollPosition;
  let visibleAreaEnd = scrollPosition + height;
  let newStartIndex = Math.floor(visibleAreaStart / cellHeight) * columns;
  let newEndIndex = Math.min(
    items.length,
    newStartIndex + Math.floor(height / cellHeight) * columns
  );

  visibleCells = items.slice(newStartIndex, newEndIndex);

  [startIndex, endIndex] = [newStartIndex, newEndIndex];
  return;

  {
    //delete cells at the benning
    let deleteEndIndex = newStartIndex < endIndex ? newStartIndex : endIndex;

    for (let i = startIndex; i < deleteEndIndex; i++) {
      visibleCells.shift();
    }

    //detele cells at the end
    let deleteStartIndex = newEndIndex > startIndex ? newEndIndex : startIndex;

    for (let i = deleteStartIndex; i < endIndex; i++) {
      visibleCells.pop();
    }

    //insert from at the beginning
    let insertTo = newEndIndex < startIndex ? newEndIndex : startIndex;

    if (insertTo > newStartIndex) {
      //temporary array for added cells
      let cells = [];

      for (let i = startIndex; i < insertTo; i++) {
        //add cell to temporary array so it's sorted correctly, as we go backwards
        cells.push(items[i]);
      }

      if (visibleCells.length) {
        visibleCells.unshift(...cells);
      } else {
        visibleCells = cells;
      }
    }

    //insert from at the end
    let insertFrom = newStartIndex > endIndex ? newStartIndex : endIndex;

    if (insertFrom < newEndIndex) {
      for (let i = insertFrom; i < newEndIndex; i++) {
        visibleCells.push(items[i]);
      }
    }
  }
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
  previousScrollValue = lastKnownScrollPosition;
});

afterUpdate(() => {
  dataGrid.scrollTop = previousScrollValue;
});
</script>

<svelte:window bind:innerHeight={height} />

<div class="container">
  <div class="data-grid" bind:this={dataGrid} on:scroll={onScroll}>
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
  <div class="scrollbar" bind:this={scrollbar} on:mousedown={down} />
</div>

<style scoped>
.container {
  margin: 0;
  padding: 0;
  height: 96vh;
  width: 100%;
  max-width: 400px;
  position: relative;
  user-select: none;
}
.scrollbar {
  height: 101%;
  width: 1.1rem;
  position: absolute;
  left: calc(100% - 1.05rem);
  z-index: 10;
}
.data-grid {
  font-size: 16px;
  font-family: Consolas, monospace;
  height: 100%;
  width: 100%;
  max-width: 400px;
  position: absolute;
  overflow-y: scroll;
}

.data-grid::-webkit-scrollbar {
  width: 1rem;
  pointer-events: none;
}

.data-grid::-webkit-scrollbar-track {
  border-left: 1px solid #373737;
  border-right: 1px solid #373737;
  pointer-events: none;
}

.data-grid::-webkit-scrollbar-thumb {
  background: #424242;
  pointer-events: none;
}

.data-grid::-webkit-scrollbar-thumb:hover {
  background: #4f4f4f;
  pointer-events: none;
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

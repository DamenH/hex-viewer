<script lang="ts">
  import { onMount, beforeUpdate, afterUpdate } from "svelte";

  let dataGrid: HTMLElement;

  let currentStartIndex: number;
  let currentEndIndex: number;
  let height: number;

  export let items: Array<number>;
  export let columns;
  export let cellHeight = 16.25;

  // The cells currently being rendered to the DOM.
  let visibleCells: Array<number> = [];

  // The space above and below the rendered data.
  // Used to emulate a normal scrolling experience.
  // Changes as you go up and down the data grid.
  let topSpacerHeight: number;
  let bottomSpacerHeight: number;

  onMount(async () => {
    updateVisibleCells();
    updateSizes();
  });

  function onScroll(event: Event) {
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

    [currentStartIndex, currentEndIndex] = [startIndex, endIndex];
    visibleCells = items.slice(startIndex, endIndex);
  }

  /**
   * Updates the sizes of the top and bottom spacers.
   */
  function updateSizes() {
    bottomSpacerHeight = Math.floor((items.length - currentEndIndex) / columns) * cellHeight;
    topSpacerHeight = Math.floor(currentStartIndex / columns) * cellHeight;
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
    console.log(scrollValueDifference);
    previousScrollValue = dataGrid?.scrollTop ?? 0;

    // Hacky workaround that may shed light on the issue?
    // if (scrollValueDifference < 0) {
    //     dataGrid.scrollTop = dataGrid.scrollTop + scrollValueDifference / 4;
    // }
  });

  afterUpdate(() => {
    currentScrollValue = dataGrid?.scrollTop ?? 0;
    scrollValueDifference = previousScrollValue - currentScrollValue;
  });
</script>

<svelte:window on:scroll|capture={onScroll} bind:innerHeight={height} />

<div class="data-grid" bind:this={dataGrid}>
  <button on:click={showVisibleCells} style="position:absolute; left: 450px;"> Visible Cells </button>
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

<style scoped>
  .data-grid {
    font-size: 14px;
    font-family: Consolas;
    width: 400px;
    height: 50vh;
    overflow-y: scroll;
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

  .row-item {
    margin-right: 0.25rem;
    margin-left: 0.25rem;
  }

  .row-item:nth-child(1) {
    margin-left: 0.5rem;
  }
</style>

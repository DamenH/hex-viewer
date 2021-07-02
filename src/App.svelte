<script lang="ts">
  import SmartDataGrid from "./lib/SmartDataGrid.svelte";

  let numColumns = 16;
  let numBytes = 65536;
  let memoryArray = new Array(numBytes).fill(0).map(() => Math.floor(Math.random() * 255));
</script>

<main>
  <SmartDataGrid items={memoryArray} columns={numColumns} />
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    border: 0;
  }
  main {
    overflow-y: hidden;
  }
</style>

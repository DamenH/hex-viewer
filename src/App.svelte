<script lang="ts">
import SmartDataGrid from "./lib/SmartDataGrid.svelte";

let numColumns = 16;
let numBytes = 65536;
$: memoryArray = new Array(numBytes)
  .fill(0)
  .map(() => Math.floor(Math.random() * 255));
</script>

<main>
  <SmartDataGrid bind:items={memoryArray} columns={numColumns} />
</main>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: data-grid;
  padding-right: 0.5rem;
}
</style>

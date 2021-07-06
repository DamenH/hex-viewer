<script lang="ts">
import SmartDataGrid from "./lib/SmartDataGrid.svelte";

let numColumns = 16;
let numBytes = 65536;
$: memoryArray = new Array(numBytes)
  .fill(0)
  .map(() => Math.floor(Math.random() * 255));
</script>

<main>
  <section>
    <div class="data-grid">
      <SmartDataGrid bind:items={memoryArray} columns={numColumns} />
    </div>
  </section>
</main>

<style>
:root {
  margin: 0;
  padding: 0;
}
main {
  font-family: Arial, Helvetica, sans-serif;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-template-areas:
    "description"
    "data-grid";
}

.data-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  grid-area: data-grid;
  padding-right: 0.5rem;
}
</style>

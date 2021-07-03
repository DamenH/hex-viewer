<script lang="ts">
  import SmartDataGrid from "./lib/SmartDataGrid.svelte";

  let numColumns = 16;
  let numBytes = 65536;
  $: memoryArray = new Array(numBytes).fill(0).map(() => Math.floor(Math.random() * 255));
</script>

<main>
  <section class="description">
    <h3>Description</h3>
    <p>
      <a href="//github.com/DamenH/hex-viewer/blob/master/src/lib/SmartDataGrid.svelte">This</a> component is able to display
      arbitrarily large arrays of hex values (on the order of 10s of millions). It does this by only rendering to the DOM
      the cells that are currently visible. A traditional scroll experience is emulated by including spacer elements above
      and below the visible cells, as well as recalculating the currently visible cells as the component is scrolled.
    </p>
    <h3>Problems</h3>
    <h4>
      <a href="//github.com/DamenH/hex-viewer/blob/master/src/lib/SmartDataGrid.svelte#L89">Infinite Scroll Bug</a>
    </h4>
    <p>
      Without the hacky fix linked above, upon scrolling down the component will undergo rapid and uncontrolled infinite
      scrolling that is multiplied by the scroll "momentum". This behavior can be seen by setting the prevent scroll bug
      to false.
    </p>
    <h4>Weird Snapping</h4>
    <p>
      Even with this fix there is this weird snapping behavior that happens when the topmost element is removed from the
      DOM. This can be prevented by setting the offset to greater than 25. This offset is added to the top spacer
      element. I have correlated this to mean this behavior doesn't happen when the element being removed is visibile.
      BUT ONLY WHEN GOING DOWN.
    </p>
    <p>
      What's perplexing is threefold. Neither of these issues only happen when scrolling down. Neither of these issues
      happen when autoscrolling (but slow middle mouse down still does). And finally, none of these issues happen in
      Firefox.
    </p>
  </section>
  <section>
    <div class="data-grid">
      <SmartDataGrid bind:items={memoryArray} columns={numColumns} />
    </div>
  </section>
</main>

<style scoped>
  main {
    font-family: Arial, Helvetica, sans-serif;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    grid-template-areas:
      "description"
      "data-grid";
  }

  p {
    text-align: justify;
    text-justify: inter-word;
  }
  .data-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: max-content;
    grid-area: data-grid;
    margin-left: 1rem;
  }

  .description {
    grid-area: description;
    padding-bottom: 2rem;
  }
</style>

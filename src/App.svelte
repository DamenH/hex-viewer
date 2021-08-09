<script lang="ts">
import HexViewer from "./lib/HexViewer.svelte";
</script>

<main>
  <HexViewer />
</main>

<style global>
html,
body {
  margin: 0;
  border: 0;
  padding: 0;
  transform: rotateY(0.0deg) rotateX(-0.0deg);
}
body {
  background-color: hsl(0, 0%, 73%);
}
main {
  font-size: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

form {
  font-family: Arial, Helvetica, sans-serif;
  margin: 10px;
}
</style>

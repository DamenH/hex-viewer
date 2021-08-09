<script lang="ts">
export let columns = 16;

$: columnIndex =
    Array(columns)
        .fill("")
        .map((v, i) => `0${i.toString(16).toUpperCase()}`)
        .join(" ") + "&nbsp;&nbsp;";
</script>

{@html columnIndex}

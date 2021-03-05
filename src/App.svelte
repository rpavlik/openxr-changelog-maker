<script lang="ts">
  import Ref from './Ref.svelte'

  export let name: string;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Where is your change being submitted?
  </p>
  <Ref codeChangeOnly={true} allowSuffix={true} />
</main>

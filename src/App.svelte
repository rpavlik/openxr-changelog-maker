<script lang="ts">
  import type { Repo, RefType } from "./reference";
  import Ref from "./Ref.svelte";
  import RefEditable from "./RefEditable.svelte";

  export let name: string;
  let repo: Repo;
  let refType: RefType;
  let refNumber: number;
</script>

<main>
  <h1>Hello {name}!</h1>
  <p>
    Where is your change being submitted?
  </p>
  <RefEditable codeChangeOnly={true} {repo} />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

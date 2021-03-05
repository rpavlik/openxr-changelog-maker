<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
    RepoHumanName,
    // Reference,
  } from "./shared/reference";

  import type { Repo, RefType } from "./shared/reference";
  export let repo: Repo;
  export let refType: RefType;
  export let refNumber: number;
  export let editable = true;

  function sendEditMessage() {
    dispatch("edit", { repo, refType, refNumber });
  }
</script>

<span class="repo">{RepoHumanName[repo]}</span>
<span class="refType">{refType}</span>
<span class="refNumber">{refNumber}</span>
{#if editable}
<button on:click={sendEditMessage}>Edit</button>
{/if}
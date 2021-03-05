<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import { RepoHumanName, RefTypeHumanName } from "./shared/reference";

  import type { StrictGeneralReference } from "./shared/reference";
  export let ref: StrictGeneralReference | null = null;
  export let editable = true;

  function sendEditMessage() {
    console.log("dispatching edit event:", ref);
    dispatch("edit", { ref });
  }
</script>

{#if ref}
  <span class="repo">{RepoHumanName[ref.repo]}</span>
  <span class="refType">{RefTypeHumanName[ref.refType]}</span>
  <span class="refNumber">{ref.refNumber}</span>
  {#if ref.suffix}
  <span class="refSuffix">({ref.suffix})</span>
  {/if}
{:else}
  <span class="warning">reference not valid</span>
{/if}
{#if editable}
  <button on:click={sendEditMessage}>Edit</button>
{/if}

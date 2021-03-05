<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
isReferenceValid,
    RepoHumanName,
    // Reference,
  } from "./shared/reference";

  import type { Repo, RefType , PartialReference} from "./shared/reference";
  // export let repo: Repo;
  // export let refType: RefType;
  // export let refNumber: number;
  export let ref: PartialReference = {repo: null, refType: null, refNumber: null};
  export let editable = true;

  function sendEditMessage() {
    console.log("dispatching edit event:", ref);
    dispatch("edit", {ref});
  }
</script>
{#if ref.repo}
<span class="repo">{RepoHumanName[ref.repo]}</span>
<span class="refType">{ref.refType}</span>
<span class="refNumber">{ref.refNumber}</span>
{:else}
<span class="warning">reference not valid</span>
{/if}
{#if editable}
<button on:click={sendEditMessage}>Edit</button>
{/if}
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
    RepoHumanName,
    AllRepos,
    CodeChangeRefType,
    RefTypes,
    isReferenceValid,
  } from "./shared/reference";

  import type { PartialReference } from "./shared/reference";
  export let codeChangeOnly: boolean = false;
  export let submittable: boolean = true;
  export let ref: PartialReference = {
    repo: null,
    refType: null,
    refNumber: null,
  };
  $: {
    if (codeChangeOnly) {
      if (ref.repo) {
        ref.refType = CodeChangeRefType[ref.repo];
      } else {
        ref.refType = "Pull Request";
      }
    }
  }
  let valid: boolean = false;
  $: valid = isReferenceValid(ref);
  function save() {
    console.log("dispatching saved event:", ref);
    dispatch("saved", {ref});
  }
</script>

<form on:submit|preventDefault={save}>
  <label for="repo-select">Choose a repository:</label>
  <select id="repo-select" bind:value={ref.repo}>
    <option value={null}>none selected</option>
    {#each AllRepos as r}
      <option value={r} selected={r == ref.repo}>{RepoHumanName[r]}</option>
    {/each}
  </select>

  {#if codeChangeOnly}
    {#if ref.refType != null}
      {ref.refType}
    {/if}
  {:else}
    <label for="reftype-select">Choose a reference type:</label>
    <select id="reftype-select" bind:value={ref.refType}>
      <option value={null}>none selected</option>
      <option value={RefTypes.Issue} selected={RefTypes.Issue == ref.refType}
        >{RefTypes.Issue}</option
      >
      {#if ref.repo}
        <option
          value={CodeChangeRefType[ref.repo]}
          selected={CodeChangeRefType[ref.repo] == ref.refType}
          >{CodeChangeRefType[ref.repo]}</option
        >
      {/if}
    </select>
  {/if}

  <label for="refnum">Number:</label>
  <input type="number" min="01" id="refnum" bind:value={ref.refNumber} />
  {#if submittable}
    <button type="submit" disabled={!valid} on:click>Confirm</button>
  {/if}
</form>

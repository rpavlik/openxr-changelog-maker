<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
    RepoHumanName,
    AllRepos,
    CodeChangeRefType,
    RefTypes,
    ValidRefTypes,PartialReference,
    isReferenceValid,
  } from "./shared/reference";

  import type { Repo, RefType } from "./shared/reference";
  export let codeChangeOnly: boolean = false;
  export let repo: Repo | null = null;
  export let submittable: boolean = true;
  export let refType: RefType | null;

  $: {
    if (codeChangeOnly) {
      if (repo) {
        refType = CodeChangeRefType[repo];
      } else {
        refType = "Pull Request";
      }
    }
  }
  let valid: boolean = false;
  $: valid = isReferenceValid({ repo, refType, refNumber });

  export let refNumber: number | null = null;

  function save() {
    dispatch("saved", { repo, refType, refNumber });
  }
</script>

<form on:submit|preventDefault={save}>
  <label for="repo-select">Choose a repository:</label>
  <select id="repo-select" bind:value={repo}>
    <option value={null}>none selected</option>
    {#each AllRepos as r}
      <option value={r} selected={r == repo}>{RepoHumanName[r]}</option>
    {/each}
  </select>

  {#if codeChangeOnly}
    {#if refType != null}
      {refType}
    {/if}
  {:else}
    <label for="reftype-select">Choose a reference type:</label>
    <select id="reftype-select" bind:value={refType}>
      <option value={null}>none selected</option>
      <option value={RefTypes.Issue} selected={RefTypes.Issue == refType}
        >{RefTypes.Issue}</option
      >
      {#if repo}
        <option
          value={CodeChangeRefType[repo]}
          selected={CodeChangeRefType[repo] == refType}
          >{CodeChangeRefType[repo]}</option
        >
      {/if}
    </select>
  {/if}

  <label for="refnum">Number:</label>
  <input type="number" min="01" id="refnum" bind:value={refNumber} />
  {#if submittable}
    <button type="submit" disabled={!valid} on:click>Confirm</button>
  {/if}
</form>

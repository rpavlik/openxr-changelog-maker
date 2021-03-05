<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
    RepoHumanName,
    AllRepos,
    CodeChangeRefType,
    RefTypes,
    ValidRefTypes,
  } from "../modules/openxr-changelog-reference";

  import type { Repo, RefType } from "../modules/openxr-changelog-reference";
  export let codeChangeOnly: boolean = false;
  export let repo: Repo | null = null;
  export let submittable: boolean = true;
  let refType: RefType | null;

  let valid: boolean = false;
  $: {
    if (!repo || !refType || !refNumber) {
      valid = false;
    }
    valid = ValidRefTypes[repo].has(refType);
  }
  let refNumber: number | null = null;

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

  <label for="refnum">{refType ? refType : ""} number:</label>
  <input type="number" min="01" id="refnum" bind:value={refNumber} />
  {#if submittable}
    <button type="submit" on:click>Confirm</button>
  {/if}
</form>

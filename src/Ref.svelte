<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  import {
    RepoHumanName,
    // Reference,
  } from "../modules/openxr-changelog-reference";

  import type { Repo, RefType } from "../modules/openxr-changelog-reference";
  export let repo: Repo;
  export let refType: RefType;
  export let refNumber: number;

  function sendEditMessage() {
    dispatch("edit", { repo, refType, refNumber });
  }
</script>

<span class="repo">{RepoHumanName[repo]}</span>
<span class="refType">{refType}</span>
<span class="refNumber">{refNumber}</span>
<button on:click={sendEditMessage}>Edit</button>

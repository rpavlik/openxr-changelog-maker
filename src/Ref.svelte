<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import RefEditable from "./RefEditable.svelte";
  import RefView from "./RefView.svelte";
  import { normalizeReference } from "./shared/reference";
  import type {
    PartialReference,
    StrictGeneralReference,
  } from "./shared/reference";
  import type { RefEvent } from "./types";

  export let editing = true;
  export let editable = true;
  export let codeChangeOnly: boolean = false;
  export let submittable: boolean = true;
  export let allowSuffix: boolean = false;
  let ref: PartialReference = {};
  let normalizedRef: StrictGeneralReference | null = null;

  interface ComponentAndProps {
    component: SvelteComponent;
    props: object;
  }
  let editorProps = {
    codeChangeOnly,
    ref,
    submittable: submittable && editable,
    allowSuffix,
  };
  let viewerProps = {
    editable,
    ref: normalizedRef,
  };
  let components = new Map<boolean, ComponentAndProps>([
    [
      true,
      {
        component: RefEditable,
        props: editorProps,
      },
    ],
    [
      false,
      {
        component: RefView,
        props: viewerProps,
      },
    ],
  ]);

  let active: ComponentAndProps;
  $: {
    active = components.get(editing);
  }

  function handleSave(event: RefEvent) {
    ref = event.detail.ref;
    normalizedRef = normalizeReference(ref);
    editing = false;
    viewerProps.ref = { ...normalizedRef };
  }
  function handleEdit(event: RefEvent) {
    ref = event.detail.ref;
    editing = true;
    editorProps.ref = { ...ref };
  }
</script>

<svelte:component
  this={active.component}
  {...active.props}
  {ref}
  on:edit={handleEdit}
  on:saved={handleSave}
/>

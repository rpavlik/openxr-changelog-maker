<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import RefEditable from "./RefEditable.svelte";
  import RefView from "./RefView.svelte";
  import type { PartialReference } from "./shared/reference";

  export let editing = true;
  export let editable = true;
  export let codeChangeOnly: boolean = false;
  export let submittable: boolean = true;
  let ref: PartialReference;

  interface ComponentAndProps {
    component: SvelteComponent;
    props: object;
  }
  let editorProps = {
    codeChangeOnly,
    ref,
    submittable: submittable && editable,
  };
  let viewerProps = {
    editable,
    ref,
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

  function handleSave(event) {
    ref = event.detail.ref;
    editing = false;
    viewerProps.ref = {...ref};
  }
  function handleEdit(event) {
    ref = event.detail.ref;
    editing = true;
    editorProps.ref = {...ref};
  }
</script>

<svelte:component
  this={active.component}
  {...active.props}
  {ref}
  on:edit={handleEdit}
  on:saved={handleSave}
/>

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
      component: SvelteComponent,
      props: object,
  };
  let components = new Map<boolean, ComponentAndProps>([
    [
      true,
      {
        component: RefEditable,
        props: {
            codeChangeOnly,
            submittable: submittable && editable
        }
      },
    ],
    [
      false,
      {
        component: RefView,
        props: {
            editable
        }
      },
    ],
  ]);

  let active: ComponentAndProps;
  $: {
    active = components.get(editing);
  }

  function handleSave(event) {
      
  }
</script>

<svelte:component this={active.component} {...active.props}  {...ref} on:saved={handleSave} />

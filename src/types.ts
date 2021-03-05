import type { PartialReference } from "./shared/reference";

export interface RefEvent {
    detail: {
        ref: PartialReference
    }
}
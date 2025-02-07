import { createDojoStore } from "@dojoengine/sdk/react";
import { SchemaType } from "@/generated/models.gen";

export const useDojoStore = createDojoStore<SchemaType>();

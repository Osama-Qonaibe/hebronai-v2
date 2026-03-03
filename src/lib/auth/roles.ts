import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from "better-auth/plugins/admin/access";
import { PERMISSION_TYPES } from "app-types/permissions";

const permissions = {
  ...defaultStatements,
  workflow: [...Object.values(PERMISSION_TYPES)],
  agent: [...Object.values(PERMISSION_TYPES)],
  mcp: [...Object.values(PERMISSION_TYPES)],
  chat: [...Object.values(PERMISSION_TYPES)],
  temporaryChat: [...Object.values(PERMISSION_TYPES)],
};

export const ac = createAccessControl(permissions);

export const user = ac.newRole({
  user: [],
  session: [],
  workflow: ["view", "use", "list"],
  agent: ["view", "use", "list", "create", "update", "delete"],
  mcp: ["view", "use", "list"],
  chat: [...Object.values(PERMISSION_TYPES)],
  temporaryChat: [...Object.values(PERMISSION_TYPES)],
});

export const editor = ac.newRole({
  user: [],
  session: [],
  workflow: [...Object.values(PERMISSION_TYPES)],
  agent: [...Object.values(PERMISSION_TYPES)],
  mcp: ["create", "view", "update", "delete", "use", "list"],
  chat: [...Object.values(PERMISSION_TYPES)],
  temporaryChat: [...Object.values(PERMISSION_TYPES)],
});

export const admin = ac.newRole({
  user: [...defaultStatements.user],
  session: [...defaultStatements.session],
  workflow: [...Object.values(PERMISSION_TYPES)],
  agent: [...Object.values(PERMISSION_TYPES)],
  mcp: [...Object.values(PERMISSION_TYPES)],
  chat: [...Object.values(PERMISSION_TYPES)],
  temporaryChat: [...Object.values(PERMISSION_TYPES)],
});

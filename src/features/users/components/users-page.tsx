"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EntityDetailSheet } from "@/components/management/entity-detail-sheet";
import { EntityFormDialog } from "@/components/management/entity-form-dialog";
import { EntityPagination } from "@/components/management/entity-pagination";
import { EntityTable } from "@/components/management/entity-table";
import { EntityToolbar } from "@/components/management/entity-toolbar";
import { useTranslation } from "@/lib/i18n/client";
import { z } from "zod";
import { userRoleEnum } from "../schemas/user.schema";
import { useUpdateUser, useUsers } from "../hooks/use-users";
import type { UpdateUserInput, User } from "../types/user.types";

const updateUserFormSchema = z.object({
  role: userRoleEnum,
  verified: z.enum(["true", "false"]),
  active: z.enum(["true", "false"]),
});

type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;

export function UsersPage() {
  const { t } = useTranslation();
  const { data, isLoading, isError, refetch } = useUsers();
  const updateUser = useUpdateUser();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);
  const [editing, setEditing] = useState<User | null>(null);

  const items = data?.items ?? [];
  const filtered = search.trim()
    ? items.filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const handleSubmit = async (values: UpdateUserFormValues) => {
    if (!editing) return;
    const input: UpdateUserInput = {
      role: values.role,
      verified: values.verified === "true",
      active: values.active === "true",
    };
    await updateUser.mutateAsync({ id: editing.id, input });
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      <EntityToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholderKey="common.search"
      />
      <EntityTable<User>
        columns={[
          {
            key: "username",
            headerKey: "users.columns.username",
            render: (user) => <span className="font-medium">{user.username}</span>,
          },
          {
            key: "email",
            headerKey: "users.columns.email",
            render: (user) => user.email,
          },
          {
            key: "role",
            headerKey: "users.columns.role",
            render: (user) => <Badge variant="secondary">{t(`users.roles.${user.role}`)}</Badge>,
          },
          {
            key: "actions",
            headerKey: "common.actions",
            render: (user) => (
              <Button
                variant="ghost"
                size="icon"
                onClick={(event) => {
                  event.stopPropagation();
                  setEditing(user);
                }}
                aria-label={t("users.edit.title")}
              >
                <Pencil />
              </Button>
            ),
          },
        ]}
        rows={filtered}
        rowKey={(user) => user.id}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        onRowClick={setSelected}
        emptyTitleKey="users.empty"
        emptyDescriptionKey="users.emptyDescription"
      />
      <EntityPagination
        meta={data}
        onPageChange={() => undefined}
        pageLabelKey="common.pagination"
        previousLabelKey="common.previous"
        nextLabelKey="common.next"
      />
      <EntityDetailSheet<User>
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        titleKey="users.detail.title"
        record={selected}
        fields={[
          {
            key: "username",
            labelKey: "users.columns.username",
            render: (user) => user.username,
          },
          {
            key: "email",
            labelKey: "users.columns.email",
            render: (user) => user.email,
          },
          {
            key: "phone",
            labelKey: "users.detail.phone",
            render: (user) => user.phone || t("common.noData"),
          },
          {
            key: "countryCode",
            labelKey: "users.detail.countryCode",
            render: (user) => user.countryCode || t("common.noData"),
          },
          {
            key: "role",
            labelKey: "users.columns.role",
            render: (user) => t(`users.roles.${user.role}`),
          },
          {
            key: "verified",
            labelKey: "users.columns.verified",
            render: (user) =>
              user.verified ? t("common.yes") : t("common.no"),
          },
          {
            key: "active",
            labelKey: "users.columns.active",
            render: (user) => (user.active ? t("common.yes") : t("common.no")),
          },
          {
            key: "createdAt",
            labelKey: "users.detail.createdAt",
            render: (user) => (user.createdAt ? new Date(user.createdAt).toLocaleString() : t("common.noData")),
          },
        ]}
      />
      <EntityFormDialog<UpdateUserFormValues>
        open={Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
        titleKey="users.edit.title"
        submitLabelKey="users.edit.submit"
        schema={updateUserFormSchema}
        fields={[
          {
            name: "role",
            labelKey: "users.columns.role",
            type: "select",
            options: ["student", "landlord", "admin", "super_admin", "manager"].map(
              (value) => ({ value, labelKey: `users.roles.${value}` }),
            ),
          },
          {
            name: "verified",
            labelKey: "users.columns.verified",
            type: "select",
            options: [
              { value: "true", labelKey: "common.yes" },
              { value: "false", labelKey: "common.no" },
            ],
          },
          {
            name: "active",
            labelKey: "users.columns.active",
            type: "select",
            options: [
              { value: "true", labelKey: "common.yes" },
              { value: "false", labelKey: "common.no" },
            ],
          },
        ]}
        initialValues={
          editing
            ? {
                role: editing.role,
                verified: editing.verified ? "true" : "false",
                active: editing.active ? "true" : "false",
              }
            : undefined
        }
        isSubmitting={updateUser.isPending}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

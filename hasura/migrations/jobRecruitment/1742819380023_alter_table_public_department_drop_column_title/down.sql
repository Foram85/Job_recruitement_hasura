alter table "public"."department" alter column "title" set default ''this is title'::text';
alter table "public"."department" alter column "title" drop not null;
alter table "public"."department" add column "title" text;

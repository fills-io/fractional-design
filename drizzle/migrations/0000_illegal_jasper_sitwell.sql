CREATE TYPE "public"."concept_status" AS ENUM('draft', 'generating', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."creation_mode" AS ENUM('quick', 'full', 'from-image');--> statement-breakpoint
CREATE TABLE "concepts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "concept_status" DEFAULT 'draft' NOT NULL,
	"creation_mode" "creation_mode" DEFAULT 'full' NOT NULL,
	"share_token" text,
	"space_type" text NOT NULL,
	"space_details" jsonb,
	"reference_images" jsonb,
	"pinterest_selections" jsonb,
	"design_dna" text,
	"color_tones" jsonb,
	"psychological_analysis" text,
	"marketing_analysis" text,
	"keywords" jsonb,
	"cinematic_description" text,
	"strategic_pillars" jsonb,
	"section_mood_lines" jsonb,
	"rich_color_system" jsonb,
	"images" jsonb,
	"prompt" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "concepts_share_token_unique" UNIQUE("share_token")
);
--> statement-breakpoint
CREATE TABLE "mood_boards" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"concept_id" uuid NOT NULL,
	"page_order" jsonb,
	"captions" jsonb,
	"hero_image_selections" jsonb,
	"layout_variation" text,
	"hidden_pages" jsonb,
	"format" text,
	"logo" text,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mood_boards_concept_id_unique" UNIQUE("concept_id")
);
--> statement-breakpoint
ALTER TABLE "mood_boards" ADD CONSTRAINT "mood_boards_concept_id_concepts_id_fk" FOREIGN KEY ("concept_id") REFERENCES "public"."concepts"("id") ON DELETE cascade ON UPDATE no action;
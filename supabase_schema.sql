CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Products" (
    "Id" text NOT NULL,
    "Name" text NOT NULL,
    "Price" numeric NOT NULL,
    "OriginalPrice" numeric,
    "Rating" double precision NOT NULL,
    "Reviews" integer NOT NULL,
    "Image" text,
    "Badge" text,
    "BadgeColor" text,
    "OnSale" boolean NOT NULL,
    "SaleDiscount" numeric,
    "Quantity" integer NOT NULL,
    "Status" boolean NOT NULL,
    "Sales" integer NOT NULL,
    "Permissions" text,
    "ProductId" text,
    CONSTRAINT "PK_Products" PRIMARY KEY ("Id")
);

INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('1', 'BEST SELLER', 'orange', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', 'Premium Leather Handbag', TRUE, 35000.0, 'Create,Edit,Delete', 25000.0, '#PRD-001', 50, 4.7999999999999998, 124, 110.0, 125, TRUE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('2', NULL, NULL, 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', 'Modern Crossbody Bag', FALSE, NULL, 'Create,Edit,Delete', 18500.0, '#PRD-002', 0, 4.5, 89, 0.0, 0, FALSE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('3', 'TRENDING', 'red', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', 'Classic Tote Bag', TRUE, 28000.0, 'Create,Edit,Delete', 22000.0, '#PRD-003', 120, 4.9000000000000004, 215, 90.0, 89, TRUE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('4', 'LIMITED', 'orange', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', 'Minimalist Backpack', TRUE, 45000.0, 'Create,Edit,Delete', 32000.0, '#PRD-004', 30, 4.7000000000000002, 156, 100.0, 52, TRUE);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260310200249_InitialSupabase', '10.0.3');

COMMIT;


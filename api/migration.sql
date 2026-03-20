CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;
CREATE TABLE "Customers" (
    "Id" text NOT NULL,
    "FullName" text NOT NULL,
    "Email" text NOT NULL,
    "Phone" text NOT NULL,
    "EmergencyPhone" text,
    "City" text NOT NULL,
    "FullAddress" text NOT NULL,
    "Gender" text NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Customers" PRIMARY KEY ("Id")
);

CREATE TABLE "Products" (
    "Id" text NOT NULL,
    "Name" text NOT NULL,
    "Price" numeric NOT NULL,
    "OriginalPrice" numeric,
    "Rating" double precision NOT NULL,
    "Reviews" integer NOT NULL,
    "Image" text,
    "ImagePublicId" text,
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

CREATE TABLE "Orders" (
    "Id" text NOT NULL,
    "OrderId" text NOT NULL,
    "Status" text NOT NULL,
    "PlacedAt" timestamp with time zone NOT NULL,
    "Subtotal" numeric(18,2) NOT NULL,
    "Shipping" numeric(18,2) NOT NULL,
    "Tax" numeric(18,2) NOT NULL,
    "Total" numeric(18,2) NOT NULL,
    "PaymentMethod" text NOT NULL,
    "CustomerId" text NOT NULL,
    CONSTRAINT "PK_Orders" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_Orders_Customers_CustomerId" FOREIGN KEY ("CustomerId") REFERENCES "Customers" ("Id") ON DELETE CASCADE
);

CREATE TABLE "OrderItems" (
    "Id" text NOT NULL,
    "ProductId" text NOT NULL,
    "ProductName" text NOT NULL,
    "PriceAtOrderTime" numeric(18,2) NOT NULL,
    "Quantity" integer NOT NULL,
    "OrderId" text NOT NULL,
    CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_OrderItems_Orders_OrderId" FOREIGN KEY ("OrderId") REFERENCES "Orders" ("Id") ON DELETE CASCADE
);

INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "ImagePublicId", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('1', 'BEST SELLER', 'orange', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', NULL, 'Premium Leather Handbag', TRUE, 35000.0, 'Create,Edit,Delete', 25000.0, '#PRD-001', 50, 4.7999999999999998, 124, 110.0, 125, TRUE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "ImagePublicId", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('2', NULL, NULL, 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', NULL, 'Modern Crossbody Bag', FALSE, NULL, 'Create,Edit,Delete', 18500.0, '#PRD-002', 0, 4.5, 89, 0.0, 0, FALSE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "ImagePublicId", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('3', 'TRENDING', 'red', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', NULL, 'Classic Tote Bag', TRUE, 28000.0, 'Create,Edit,Delete', 22000.0, '#PRD-003', 120, 4.9000000000000004, 215, 90.0, 89, TRUE);
INSERT INTO "Products" ("Id", "Badge", "BadgeColor", "Image", "ImagePublicId", "Name", "OnSale", "OriginalPrice", "Permissions", "Price", "ProductId", "Quantity", "Rating", "Reviews", "SaleDiscount", "Sales", "Status")
VALUES ('4', 'LIMITED', 'orange', 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048', NULL, 'Minimalist Backpack', TRUE, 45000.0, 'Create,Edit,Delete', 32000.0, '#PRD-004', 30, 4.7000000000000002, 156, 100.0, 52, TRUE);

CREATE INDEX "IX_OrderItems_OrderId" ON "OrderItems" ("OrderId");

CREATE INDEX "IX_Orders_CustomerId" ON "Orders" ("CustomerId");

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20260313193826_InitialSupabase', '10.0.4');

COMMIT;

